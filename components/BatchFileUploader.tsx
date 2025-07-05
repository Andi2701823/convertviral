'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiCheck, FiX, FiDownload } from 'react-icons/fi';
import { fileFormats, fileCategories } from '@/lib/fileTypes';
import { trackFileUploadStarted, trackConversionCompleted } from '@/lib/analytics';

interface BatchFileUploaderProps {
  initialTargetFormat?: string;
}

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  status: 'idle' | 'uploading' | 'converting' | 'completed' | 'error';
  progress: number;
  error?: string;
  convertedUrl?: string;
}

export default function BatchFileUploader({ initialTargetFormat }: BatchFileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>(initialTargetFormat || '');
  const [isConverting, setIsConverting] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  
  // Filter formats based on the first selected file's category
  const getCompatibleFormats = () => {
    if (files.length === 0) return Object.values(fileFormats);
    
    const firstFile = files[0];
    const fileExtension = firstFile.name.split('.').pop()?.toLowerCase() || '';
    
    // Find the category of the first file
    let firstFileCategory = '';
    for (const formatKey in fileFormats) {
      if (fileFormats[formatKey].extension === fileExtension) {
        firstFileCategory = fileFormats[formatKey].category.id;
        break;
      }
    }
    
    // If we couldn't determine the category, show all formats
    if (!firstFileCategory) return Object.values(fileFormats);
    
    // Filter formats to only show those in the same category
    return Object.values(fileFormats).filter(
      format => format.category.id === firstFileCategory
    );
  };
  
  const compatibleFormats = getCompatibleFormats();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      // Track file upload started for analytics
      trackFileUploadStarted('batch', acceptedFiles.length);
      
      const newFiles = acceptedFiles.map(file => 
        Object.assign(file, {
          id: Math.random().toString(36).substring(2, 15),
          preview: URL.createObjectURL(file),
          status: 'idle',
          progress: 0,
        }) as FileWithPreview
      );
      
      setFiles(prev => [...prev, ...newFiles]);
      
      // Auto-select target format based on first file if not already selected
      if (!targetFormat && newFiles.length > 0) {
        const fileExtension = newFiles[0].name.split('.').pop()?.toLowerCase() || '';
        
        // Find a compatible format that's different from the source
        for (const formatKey in fileFormats) {
          const format = fileFormats[formatKey];
          if (format.extension !== fileExtension && 
              format.category.id === getFileCategory(fileExtension)) {
            setTargetFormat(formatKey);
            break;
          }
        }
      }
    }
  }, [targetFormat]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'audio/*': [],
      'video/*': [],
      // Add more accepted types as needed
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 10,
  });
  
  // Helper function to get file category
  const getFileCategory = (extension: string): string => {
    for (const formatKey in fileFormats) {
      if (fileFormats[formatKey].extension === extension) {
        return fileFormats[formatKey].category.id;
      }
    }
    return '';
  };
  
  // Remove file from the list
  const removeFile = (id: string) => {
    setFiles(files => {
      const fileToRemove = files.find(file => file.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return files.filter(file => file.id !== id);
    });
  };
  
  // Start batch conversion
  const startConversion = async () => {
    if (files.length === 0 || !targetFormat || isConverting) return;
    
    setIsConverting(true);
    setAllCompleted(false);
    
    // Update status of all files to uploading
    setFiles(files => 
      files.map(file => ({
        ...file,
        status: 'uploading',
        progress: 0,
      }))
    );
    
    // Process each file sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate file upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id
              ? { ...f, progress, status: progress < 100 ? 'uploading' : 'converting' }
              : f
          )
        );
      }
      
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update file status to completed or error (randomly for demo)
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id
            ? { 
                ...f, 
                status: success ? 'completed' : 'error',
                error: success ? undefined : 'Conversion failed. Please try again.',
                convertedUrl: success ? '#' : undefined, // In a real app, this would be the actual download URL
              }
            : f
        )
      );
      
      // Track conversion completed for analytics
      if (success) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        trackConversionCompleted({
          sourceFormat: fileExtension,
          targetFormat: targetFormat,
          fileSize: file.size,
          conversionTime: 1000, // Simulated conversion time
          success: true,
        });
      }
    }
    
    setIsConverting(false);
    setAllCompleted(true);
  };
  
  // Download all converted files as ZIP
  const downloadAllAsZip = () => {
    // In a real implementation, this would create and download a ZIP file
    alert('In a real implementation, this would download all converted files as a ZIP archive.');
  };
  
  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);
  
  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <FiUpload className="w-10 h-10 text-gray-400" />
          <p className="text-lg font-medium text-gray-700">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop files here, or click to select files'}
          </p>
          <p className="text-sm text-gray-500">
            Up to 10 files, 100MB each
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <label htmlFor="target-format" className="block text-sm font-medium text-gray-700 mb-1">
                Convert all files to:
              </label>
              <select
                id="target-format"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                disabled={isConverting}
              >
                <option value="">Select target format</option>
                {compatibleFormats.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.name} (.{format.extension})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={startConversion}
                disabled={files.length === 0 || !targetFormat || isConverting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  files.length === 0 || !targetFormat || isConverting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isConverting ? 'Converting...' : 'Convert All'}
              </button>
              
              {allCompleted && (
                <button
                  type="button"
                  onClick={downloadAllAsZip}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FiDownload className="-ml-1 mr-2 h-5 w-5" />
                  Download All (ZIP)
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li key={file.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FiFile className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {file.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {file.status === 'idle' && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isConverting}
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      )}
                      
                      {(file.status === 'uploading' || file.status === 'converting') && (
                        <div className="w-24">
                          <div className="bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                file.status === 'uploading' ? 'bg-blue-600' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {file.status === 'uploading' ? 'Uploading' : 'Converting'} ({file.progress}%)
                          </span>
                        </div>
                      )}
                      
                      {file.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <FiCheck className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-500">Completed</span>
                          <a 
                            href={file.convertedUrl} 
                            download
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FiDownload className="h-5 w-5" />
                          </a>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center space-x-2">
                          <FiX className="h-5 w-5 text-red-500" />
                          <span className="text-sm text-red-500" title={file.error}>
                            Error
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}