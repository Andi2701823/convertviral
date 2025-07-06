'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface FileConverterProps {
  maxFileSize: number;
}

const FileConverter: React.FC<FileConverterProps> = ({ maxFileSize }) => {
  const t = useTranslations('conversion');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setUploadError(null);
      if (fileRejections.length > 0) {
        setUploadError(`File is larger than ${maxFileSize / 1024 / 1024}MB`);
        return;
      }
      setUploadedFiles(acceptedFiles);
    },
    [maxFileSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxFileSize,
    multiple: false,
  });

  const handleConvert = () => {
    if (uploadedFiles.length === 0) return;

    setIsConverting(true);
    setConversionProgress(0);
    setConvertedFile(null);

    const interval = setInterval(() => {
      setConversionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsConverting(false);
          setConvertedFile(URL.createObjectURL(new Blob(["dummy file content"], {type: "text/plain"})));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
        }`}>
        <input {...getInputProps()} />
        <p className="text-gray-500">{t('drop_files_here')}</p>
      </div>

      {uploadError && <p className="text-red-500 mt-4">{uploadError}</p>}

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">{t('uploaded_file')}</h3>
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file.name} className="mt-2 p-2 bg-gray-100 rounded-md">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleConvert}
          disabled={uploadedFiles.length === 0 || isConverting}
          className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors duration-300">
          {isConverting ? t('converting') : t('convert_now')}
        </button>
      </div>

      {isConverting && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-primary-600 h-2.5 rounded-full"
              style={{ width: `${conversionProgress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${conversionProgress}%` }}
              transition={{ duration: 0.5 }}></motion.div>
          </div>
          <p className="text-center mt-2">{conversionProgress}%</p>
        </div>
      )}

      {convertedFile && (
        <div className="mt-6 text-center">
          <a
            href={convertedFile}
            download={`converted-${uploadedFiles[0].name}`}
            className="inline-flex items-center justify-center bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300">
            {t('download_file')}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileConverter;