'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { formatFileSize } from '@/lib/fileTypes';

interface FileFormat {
  id: string;
  name: string;
  extensions: string[];
}

interface ConversionJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: {
    url: string;
    filename: string;
    size: number;
  };
  error?: string;
}

const fileFormats: Record<string, FileFormat[]> = {
  document: [
    { id: 'pdf', name: 'PDF', extensions: ['.pdf'] },
    { id: 'docx', name: 'Word', extensions: ['.docx', '.doc'] },
    { id: 'xlsx', name: 'Excel', extensions: ['.xlsx', '.xls'] },
  ],
  image: [
    { id: 'jpg', name: 'JPG', extensions: ['.jpg', '.jpeg'] },
    { id: 'png', name: 'PNG', extensions: ['.png'] },
    { id: 'webp', name: 'WebP', extensions: ['.webp'] },
  ],
  audio: [
    { id: 'mp3', name: 'MP3', extensions: ['.mp3'] },
    { id: 'wav', name: 'WAV', extensions: ['.wav'] },
  ],
  video: [
    { id: 'mp4', name: 'MP4', extensions: ['.mp4'] },
    { id: 'mov', name: 'MOV', extensions: ['.mov'] },
  ],
};

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  // Determine source format from file
  const getSourceFormat = (file: File): string => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return ext;
  };

  // Get target formats based on source format
  const getTargetFormats = (sourceFormat: string): FileFormat[] => {
    const sourceToTargets: Record<string, FileFormat[]> = {
      pdf: [{ id: 'jpg', name: 'JPG', extensions: ['.jpg'] }],
      jpg: [{ id: 'png', name: 'PNG', extensions: ['.png'] }],
      png: [{ id: 'jpg', name: 'JPG', extensions: ['.jpg'] }],
      mp4: [{ id: 'mp3', name: 'MP3', extensions: ['.mp3'] }],
      mp3: [{ id: 'wav', name: 'WAV', extensions: ['.wav'] }],
    };
    return sourceToTargets[sourceFormat] || [];
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setFile(file);
    setUploadError(null);
    setConversionJob(null);
    setConversionError(null);

    // Check file size
    if (file.size > maxFileSize) {
      setUploadError(`File size exceeds the ${formatFileSize(maxFileSize)} limit`);
      return;
    }

    // Auto-select first available target format
    const sourceFormat = getSourceFormat(file);
    const targets = getTargetFormats(sourceFormat);
    if (targets.length > 0) {
      setSelectedFormat(targets[0].id);
    }
  }, [maxFileSize]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: maxFileSize,
  });

  // Start conversion
  const handleConvert = async () => {
    if (!file || !selectedFormat) return;

    setIsConverting(true);
    setConversionError(null);
    setConversionJob({ jobId: '', status: 'processing', progress: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetFormat', selectedFormat);

      const response = await fetch('/api/convert-simple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      const data = await response.json();

      if (data.status === 'completed' && data.result) {
        setConversionJob({
          jobId: data.jobId,
          status: 'completed',
          progress: 100,
          result: data.result,
        });
      } else {
        setConversionJob({
          jobId: data.jobId,
          status: 'processing',
          progress: 50,
        });
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError(error instanceof Error ? error.message : 'Conversion failed');
      setConversionJob(null);
    } finally {
      setIsConverting(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setSelectedFormat('pdf');
    setConversionJob(null);
    setUploadError(null);
    setConversionError(null);
  };

  const sourceFormat = file ? getSourceFormat(file) : '';
  const targetFormats = file ? getTargetFormats(sourceFormat) : [];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {/* Drop zone */}
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-surface-300 hover:border-primary-400 hover:bg-surface-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 text-primary-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            {isDragActive ? (
              <p className="text-lg text-primary-600">Drop the file here...</p>
            ) : (
              <>
                <p className="text-lg text-surface-700">Drag & drop a file here, or click to select</p>
                <p className="text-sm text-surface-500">Maximum file size: {formatFileSize(maxFileSize)}</p>
              </>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {uploadError}
        </div>
      )}

      {/* File selected */}
      {file && !conversionJob && (
        <div className="mt-6">
          <div className="p-4 bg-surface-100 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-surface-800 truncate">{file.name}</p>
                <p className="text-sm text-surface-500">{formatFileSize(file.size)}</p>
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
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Convert to:
              </label>
              <div className="flex flex-wrap gap-2">
                {targetFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFormat === format.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                    }`}
                  >
                    {format.name}
                  </button>
                ))}
              </div>

              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="mt-4 w-full bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isConverting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.216A8 8 0 0120 12h4v-4.216l-2.857-2.857A8 8 0 0112 4.432V0H8v4.432a8 8 0 01-2.143 5.784L4 12z"></path>
                    </svg>
                    Converting...
                  </>
                ) : (
                  'Convert Now'
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
              <p>No compatible conversion formats available for this file type.</p>
            </div>
          )}

          {conversionError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {conversionError}
            </div>
          )}
        </div>
      )}

      {/* Conversion in progress */}
      {conversionJob && conversionJob.status === 'processing' && (
        <div className="mt-6">
          <div className="p-4 bg-surface-100 rounded-lg">
            <h3 className="font-semibold mb-4 text-surface-800">Converting...</h3>

            <div className="mt-4">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                  {conversionJob.progress}%
                </span>
              </div>
              <div className="overflow-hidden h-2 rounded-full bg-surface-200">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${conversionJob.progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary-500"
                />
              </div>
            </div>

            <p className="text-sm text-surface-500 mt-4">Please wait while your file is being converted...</p>

            <button
              onClick={resetForm}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Conversion completed */}
      {conversionJob && conversionJob.status === 'completed' && conversionJob.result && (
        <div className="mt-6">
          <div className="p-4 bg-surface-100 rounded-lg">
            <div className="flex items-center text-accent-600 mb-4">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Conversion completed!</span>
            </div>

            <a
              href={conversionJob.result.url}
              download={conversionJob.result.filename}
              className="inline-flex items-center justify-center w-full bg-accent-600 hover:bg-accent-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download ({formatFileSize(conversionJob.result.size)})
            </a>

            <button
              onClick={resetForm}
              className="mt-4 w-full text-center text-sm text-surface-600 hover:text-primary-600"
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
