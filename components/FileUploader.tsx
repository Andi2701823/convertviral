'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { formatFileSize } from '@/lib/fileTypes';
import { io, Socket } from 'socket.io-client';

interface FileFormat {
  id: string;
  name: string;
  extensions: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url?: string;
}

interface FileUploaderProps {
  sourceFormat?: string;
  targetFormat?: string;
}

interface ConversionJob {
  jobId: string;
  sourceFile: UploadedFile;
  targetFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: {
    downloadUrl: string;
    fileName: string;
    fileSize: number;
  };
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

const fileFormats: Record<string, FileFormat[]> = {
  document: [
    { id: 'pdf', name: 'PDF', extensions: ['.pdf'] },
    { id: 'docx', name: 'Word', extensions: ['.docx', '.doc'] },
    { id: 'xlsx', name: 'Excel', extensions: ['.xlsx', '.xls'] },
    { id: 'pptx', name: 'PowerPoint', extensions: ['.pptx', '.ppt'] },
    { id: 'txt', name: 'Text', extensions: ['.txt'] },
  ],
  image: [
    { id: 'jpg', name: 'JPG', extensions: ['.jpg', '.jpeg'] },
    { id: 'png', name: 'PNG', extensions: ['.png'] },
    { id: 'gif', name: 'GIF', extensions: ['.gif'] },
    { id: 'webp', name: 'WebP', extensions: ['.webp'] },
    { id: 'svg', name: 'SVG', extensions: ['.svg'] },
  ],
  audio: [
    { id: 'mp3', name: 'MP3', extensions: ['.mp3'] },
    { id: 'wav', name: 'WAV', extensions: ['.wav'] },
    { id: 'ogg', name: 'OGG', extensions: ['.ogg'] },
    { id: 'flac', name: 'FLAC', extensions: ['.flac'] },
  ],
  video: [
    { id: 'mp4', name: 'MP4', extensions: ['.mp4'] },
    { id: 'avi', name: 'AVI', extensions: ['.avi'] },
    { id: 'mov', name: 'MOV', extensions: ['.mov'] },
    { id: 'webm', name: 'WebM', extensions: ['.webm'] },
  ],
};

const FileUploader = ({ sourceFormat = '', targetFormat = '' }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [targetFormats, setTargetFormats] = useState<FileFormat[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const maxFileSize = 50 * 1024 * 1024; // 50MB for free users

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
          setConversionJob(prev => prev ? { ...prev, progress: data.progress } : null);
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

  // Fetch conversion progress periodically as a fallback
  useEffect(() => {
    if (conversionJob && conversionJob.status === 'processing') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/progress?jobId=${conversionJob.jobId}`);
          if (response.ok) {
            const data = await response.json();
            setConversionJob(prev => prev ? { ...prev, progress: data.progress } : null);
            
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
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      }, 2000);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [conversionJob]);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFile(file);
    
    // Check file size
    if (file.size > maxFileSize) {
      setUploadError(`File size exceeds the ${formatFileSize(maxFileSize)} limit`);
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      const uploadData = await uploadResponse.json();
      
      setUploadedFile({
        id: uploadData.fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        url: uploadData.url,
      });
      
      // Get compatible target formats
      const formatsResponse = await fetch(`/api/formats?sourceFormat=${uploadData.extension}`);
      
      if (!formatsResponse.ok) {
        const errorData = await formatsResponse.json();
        throw new Error(errorData.error || 'Failed to get compatible formats');
      }
      
      const formatsData = await formatsResponse.json();
      setTargetFormats(formatsData.formats);
      
      if (formatsData.formats.length > 0) {
        setSelectedFormat(formatsData.formats[0].id);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
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
    maxFiles: 1,
    maxSize: maxFileSize,
    disabled: isUploading || !!conversionJob,
  });

  // Start conversion
  const handleConvert = async () => {
    if (!uploadedFile || !selectedFormat) return;
    
    setIsConverting(true);
    setConversionError(null);
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: uploadedFile.id,
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
        sourceFile: uploadedFile,
        targetFormat: selectedFormat,
        status: 'processing',
        progress: 0,
        startedAt: new Date(),
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError(error instanceof Error ? error.message : 'Failed to start conversion');
    } finally {
      setIsConverting(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setUploadedFile(null);
    setTargetFormats([]);
    setSelectedFormat('');
    setConversionJob(null);
    setUploadError(null);
    setConversionError(null);
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {!uploadedFile && (
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
      
      {uploadedFile && !conversionJob && (
        <div className="mt-6">
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Selected File</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm truncate">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
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
                    {format.name} (.{format.extensions[0].replace('.', '')})
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleConvert}
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
      )}
      
      {conversionJob && (
        <div className="mt-6">
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">
              {conversionJob.status === 'completed' ? 'Conversion Complete' : 
               conversionJob.status === 'failed' ? 'Conversion Failed' : 
               'Converting File'}
            </h3>
            
            <div className="mb-2">
              <p className="text-sm truncate">{conversionJob.sourceFile.name}</p>
              <p className="text-xs text-gray-500">
                Converting to {targetFormats.find(f => f.id === conversionJob.targetFormat)?.name || conversionJob.targetFormat}
              </p>
            </div>
            
            {conversionJob.status === 'processing' && (
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {Math.round(conversionJob.progress)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: `${conversionJob.progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {conversionJob.status === 'completed' && conversionJob.result && (
              <div className="mt-4">
                <div className="flex items-center text-green-600 mb-2">
                  <FaCheck className="mr-2" />
                  <span>Conversion completed successfully!</span>
                </div>
                
                <a
                  href={conversionJob.result.downloadUrl}
                  download={conversionJob.result.fileName}
                  className="mt-2 inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Download ({formatFileSize(conversionJob.result.fileSize)})
                </a>
              </div>
            )}
            
            {conversionJob.status === 'failed' && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <FaExclamationTriangle className="mr-2" />
                {conversionJob.error || 'An unknown error occurred during conversion'}
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

export default FileUploader;