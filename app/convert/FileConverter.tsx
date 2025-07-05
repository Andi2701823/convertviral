'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload, FaSpinner, FaCheck, FaExclamationTriangle, FaWifi, FaRegClock } from 'react-icons/fa';
import { formatFileSize } from '../../lib/fileTypes';
import { io, Socket } from 'socket.io-client';

// Using type definitions from /types/service-worker.d.ts

interface FileConverterProps {
  maxFileSize?: number; // in bytes
}

interface UploadedFileWithId extends UploadedFile {
  id: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url?: string;
  originalFile?: File;
}

interface ConversionJob {
  jobId: string;
  sourceFile: UploadedFile;
  targetFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  stage?: 'uploading' | 'validating' | 'converting' | 'retrying';
  result?: {
    downloadUrl: string;
    fileName: string;
    fileSize: number;
  };
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

interface FormatOption {
  id: string;
  name: string;
  extension: string;
}

const FileConverter: React.FC<FileConverterProps> = ({ maxFileSize = 50 * 1024 * 1024 }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileWithId[]>([]);
  const [conversionJobs, setConversionJobs] = useState<ConversionJob[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [targetFormats, setTargetFormats] = useState<FormatOption[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [conversionStage, setConversionStage] = useState<'uploading' | 'validating' | 'converting' | 'retrying' | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [queuedForOffline, setQueuedForOffline] = useState<boolean>(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (conversionJob && conversionJob.status === 'processing') {
      // Connect to Socket.IO server
      const socketIo = io(window.location.origin, {
        path: '/socket.io',
        transports: ['websocket', 'polling']
      });
      
      socketIo.on('connect', () => {
        console.log('Socket.IO connected');
        // Subscribe to job updates
        socketIo.emit('subscribe', { jobId: conversionJob.jobId });
      });
      
      socketIo.on('progress', (data) => {
        if (data.jobId === conversionJob.jobId) {
          setConversionJob(prev => prev ? { ...prev, progress: data.progress, stage: data.stage || prev.stage } : null);
        }
      });
      
      socketIo.on('completed', (data) => {
        if (data.jobId === conversionJob.jobId) {
          setConversionJob(prev => prev ? { 
            ...prev, 
            status: 'completed', 
            progress: 100,
            result: data.result,
            completedAt: new Date()
          } : null);
          socketIo.disconnect();
        }
      });
      
      socketIo.on('failed', (data) => {
        if (data.jobId === conversionJob.jobId) {
          setConversionJob(prev => prev ? { 
            ...prev, 
            status: 'failed', 
            error: data.error,
            completedAt: new Date()
          } : null);
          setConversionError(data.error);
          socketIo.disconnect();
        }
      });
      
      socketIo.on('error', (error) => {
        console.error('Socket.IO error:', error);
        setConversionError(error.message || 'Connection error');
      });
      
      socketIo.on('disconnect', () => {
        console.log('Socket.IO disconnected');
      });
      
      setSocket(socketIo);
      
      return () => {
        socketIo.disconnect();
      };
    }
  }, [conversionJob]);
  
  // Function to queue conversion for offline processing
  const queueOfflineConversion = async () => {
    const uploadedFile = uploadedFiles[0]; // Assuming only one file is processed at a time
    if (!uploadedFile || !selectedFormat || !uploadedFile.originalFile) return;

    try {
      // Dynamically import to avoid SSR issues
      const { addPendingConversion } = await import('../../lib/offlineStorage');

      // Create a unique ID for the conversion
      const conversionId = `offline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Create a new object that conforms to UploadedFileWithId
      const uploadedFileWithId: UploadedFileWithId = {
        id: conversionId, // Assign the generated ID
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        uploadedAt: new Date(), // Or use an existing timestamp if available
        // url: uploadedFile.url, // If url is available on the original File object
      };

      // Queue the conversion in IndexedDB
      await addPendingConversion({
        id: conversionId,
        fileId: uploadedFileWithId.id,
        fileName: uploadedFileWithId.name,
        fromFormat: uploadedFileWithId.name.split('.').pop() || '',
        toFormat: targetFormats.find(f => f.id === selectedFormat)?.extension || selectedFormat,
        fileSize: uploadedFileWithId.size,
        fileData: uploadedFile.originalFile, // Store the original File object for when we're back online
        targetFormat: selectedFormat,
        createdAt: new Date().toISOString()
      });
      
      // Update UI to show queued status
      setQueuedForOffline(true);
      
      // Register for background sync if available
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        // Use type assertion to handle the sync property
        await (registration as any).sync.register('conversion-sync');
      }
    } catch (error) {
      console.error('Failed to queue offline conversion:', error);
      setConversionError('Failed to queue conversion for offline processing');
    }
  };

  // Fetch conversion progress periodically as a fallback
  useEffect(() => {
    if (conversionJob && conversionJob.status === 'processing') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/progress?jobId=${conversionJob.jobId}`);
          if (response.ok) {
            const data = await response.json();
            setConversionJob(prev => prev ? { ...prev, progress: data.progress, stage: data.stage || prev.stage } : null);
            
            if (data.status === 'completed') {
              setConversionJob(prev => prev ? { 
                ...prev, 
                status: 'completed', 
                progress: 100,
                result: data.result,
                completedAt: new Date()
              } : null);
              clearInterval(interval);
            } else if (data.status === 'failed') {
              setConversionJob(prev => prev ? { 
                ...prev, 
                status: 'failed', 
                error: data.error,
                completedAt: new Date()
              } : null);
              setConversionError(data.error);
              clearInterval(interval);
            }
          } else {
            console.error('Failed to fetch conversion progress:', response.statusText);
            setConversionError('Failed to fetch conversion progress');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error fetching conversion progress:', error);
          setConversionError('Error fetching conversion progress');
          clearInterval(interval);
        }
      }, 3000); // Poll every 3 seconds
      
      return () => clearInterval(interval);
    }
  }, [conversionJob]);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    const filesWithIds: UploadedFileWithId[] = acceptedFiles.map(file => ({
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      originalFile: file, // Store the original File object if needed later
    })).filter(file => {
      if (file.size > maxFileSize) {
        setUploadError(`File ${file.name} is too large. Max size is ${formatFileSize(maxFileSize)}.`);
        return false;
      }
      return true;
    });

    if (filesWithIds.length > 0) {
      setUploadedFiles(filesWithIds);
      setUploadError(null);
      // Automatically trigger upload or further processing here if needed
    }
  }, [maxFileSize]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'application/vnd.ms-powerpoint': [],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
      'audio/*': [],
      'video/*': [],
    },
    multiple: true,
    disabled: isUploading || !!conversionJob,
  });

  // Start conversion
  const startConversion = async () => {
    if (uploadedFiles.length === 0 || !selectedFormat || !uploadedFiles[0].originalFile) return;
    
    setIsConverting(true);
    setConversionError(null);
    
    // Check if we're offline
    if (!isOnline) {
      try {
        await queueOfflineConversion();
        setIsConverting(false);
        return;
      } catch (error) {
        console.error('Failed to queue offline conversion:', error);
        setConversionError('Failed to queue conversion for offline processing');
        setIsConverting(false);
        return;
      }
    }
    
    try {
      const originalFile = uploadedFiles[0].originalFile; // Get the original File object
      const fileId = `online-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const uploadedFileWithId: UploadedFileWithId = {
        id: fileId,
        name: originalFile.name,
        size: originalFile.size,
        type: originalFile.type,
        uploadedAt: new Date(),
      };

      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: uploadedFileWithId.id,
          targetFormat: selectedFormat,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start conversion');
      }
      
      const data = await response.json();
      
      setConversionJob({
        jobId: data.jobId,
        sourceFile: uploadedFileWithId,
        targetFormat: selectedFormat,
        status: 'processing',
        progress: 0,
        startedAt: new Date(),
      });
    } catch (error) {
      console.error('Conversion error:', error);
      
      // If the error is due to network issues, try to queue for offline processing
      if (!navigator.onLine || error instanceof TypeError) {
        try {
          await queueOfflineConversion();
        } catch (offlineError) {
          setConversionError('Failed to start conversion and could not queue for offline processing');
        }
      } else {
        setConversionError(error instanceof Error ? error.message : 'Failed to start conversion');
      }
    } finally {
      setIsConverting(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setUploadedFiles([]);
    setTargetFormats([]);
    setSelectedFormat('');
    setConversionJob(null);
    setUploadError(null);
    setConversionError(null);
    setQueuedForOffline(false);
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };
  
  // Navigate to offline page
  const goToOfflinePage = () => {
    window.location.href = '/offline';
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Convert Your Files</h2>
      
      {/* Offline status indicator */}
      {!isOnline && ( 
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <FaWifi className="mr-2" />
            <span>You are currently offline. Conversions will be queued for processing when you're back online.</span>
          </div>
          <button 
            onClick={goToOfflinePage}
            className="text-sm bg-yellow-200 hover:bg-yellow-300 text-yellow-800 py-1 px-3 rounded-md transition-colors"
          >
            View Offline Data
          </button>
        </div>
      )}

      
      {uploadedFiles.length === 0 && (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <FaUpload className="text-4xl text-gray-400" />
            {isDragActive ? (
              <p className="text-lg">Drop the file here...</p>
            ) : (
              <>
                <p className="text-lg">Drag & drop a file here, or click to select</p>
                <p className="text-sm text-gray-500">Maximum file size: {formatFileSize(maxFileSize)}</p>
              </>
            )}
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {uploadError}
        </div>
      )}
      
      {isUploading && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <FaSpinner className="animate-spin text-blue-500" />
            <span>Uploading file...</span>
          </div>
        </div>
      )}
      
      {uploadedFiles.length > 0 && !conversionJob && (
        <div>
          <div className="mt-6">
            <div className="p-4 bg-gray-100 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Uploaded Files</h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file: UploadedFileWithId) => (
                  <li key={file.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center space-x-2">
                      <FaCheck className="text-green-500" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button 
                      onClick={() => setUploadedFiles(files => files.filter(f => f.id !== file.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <div className="p-4 bg-gray-100 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Selected File</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm truncate">{uploadedFiles[0]?.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(uploadedFiles[0]?.size)}</p>
                </div>
                <button 
                  onClick={resetForm}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          
          {targetFormats.length > 0 ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Convert to:
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {targetFormats.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.name} (.{format.extension})
                  </option>
                ))}
              </select>
              
              <button
                onClick={startConversion}
                disabled={isConverting || !selectedFormat}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isConverting ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Starting Conversion...
                  </span>
                ) : (
                  'Convert Now'
                )}
              </button>
            </div>
          ) : (
            <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
              <p>No compatible conversion formats available for this file.</p>
            </div>
          )}
          
          {conversionError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {conversionError}
            </div>
          )}
          </div>
        </div>
      )}
      
      {queuedForOffline && (
        <div className="mt-6">
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <FaRegClock className="mr-2 text-blue-500" />
              Conversion Queued for Offline Processing
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Your conversion has been saved and will be processed automatically when you're back online.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={resetForm}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md transition-colors"
              >
                Convert Another File
              </button>
              <button
                onClick={goToOfflinePage}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-md transition-colors"
              >
                View Queued Conversions
              </button>
            </div>
          </div>
        </div>
      )}
      
      {conversionJob && !queuedForOffline && (
        <div className="mt-6">
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">
              {conversionJob?.status === 'completed' ? 'Conversion Complete' : 
               conversionJob?.status === 'failed' ? 'Conversion Failed' : 
               'Converting File'}
            </h3>
            
            <div className="mb-2">
              <p className="text-sm truncate">{(conversionJob as ConversionJob).sourceFile.name}</p>
              <p className="text-xs text-gray-500">
                Converting to {targetFormats.find(f => f.id === (conversionJob as ConversionJob).targetFormat)?.name || (conversionJob as ConversionJob).targetFormat}
              </p>
            </div>
            
            {(conversionJob as ConversionJob).status === 'processing' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 relative overflow-hidden">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(conversionJob as ConversionJob)?.progress ?? 0}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-semibold text-white mix-blend-difference">
                      {conversionJob?.stage === 'validating' && 'Validating file...'}
                      {conversionJob?.stage === 'converting' && `Converting... ${conversionJob?.progress ?? 0}%`}
                      {conversionJob?.stage === 'retrying' && `Retrying...`}
                      {!(conversionJob?.stage) && `Processing... ${conversionJob?.progress ?? 0}%`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {(conversionJob as ConversionJob).status === 'completed' && (conversionJob as ConversionJob).result && (
              <div className="mt-4">
                <div className="flex items-center text-green-600 mb-2">
                  <FaCheck className="mr-2" />
                  <span>Conversion completed successfully!</span>
                </div>
                
                <a
                  href={(conversionJob as ConversionJob).result?.downloadUrl}
                  download={(conversionJob as ConversionJob).result?.fileName}
                  className="mt-2 inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Download ({formatFileSize((conversionJob as ConversionJob).result?.fileSize ?? 0)})
                </a>
              </div>
            )}
            
            {(conversionJob as ConversionJob).status === 'failed' && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <FaExclamationTriangle className="mr-2" />
                {conversionJob?.error || 'An unknown error occurred during conversion'}
              </div>
            )}
            
            <button 
              onClick={resetForm}
              className="mt-4 text-sm text-blue-500 hover:text-blue-700"
            >
              Convert Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileConverter;