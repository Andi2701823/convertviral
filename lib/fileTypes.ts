import { IconType } from 'react-icons';
import { FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAudio, FaFileVideo, FaFileArchive, FaFileCode, FaBook } from 'react-icons/fa';

// Define file format type
export interface FileFormat {
  id: string;
  name: string;
  extension: string;
  mimeTypes: string[];
  category: FileCategory;
  icon: IconType;
  description: string;
  maxSizeInBytes?: number;
}

// Define file category type
export interface FileCategory {
  id: string;
  name: string;
  icon: IconType;
  description: string;
}

// Define file categories
export const fileCategories: Record<string, FileCategory> = {
  document: {
    id: 'document',
    name: 'Documents',
    icon: FaFileAlt,
    description: 'Document files like PDF, Word, Excel, etc.',
  },
  image: {
    id: 'image',
    name: 'Images',
    icon: FaFileImage,
    description: 'Image files like JPG, PNG, GIF, etc.',
  },
  audio: {
    id: 'audio',
    name: 'Audio',
    icon: FaFileAudio,
    description: 'Audio files like MP3, WAV, FLAC, etc.',
  },
  video: {
    id: 'video',
    name: 'Video',
    icon: FaFileVideo,
    description: 'Video files like MP4, AVI, MOV, etc.',
  },
  archive: {
    id: 'archive',
    name: 'Archives',
    icon: FaFileArchive,
    description: 'Archive files like ZIP, RAR, etc.',
  },
  ebook: {
    id: 'ebook',
    name: 'Ebooks',
    icon: FaBook,
    description: 'Ebook files like EPUB, MOBI, etc.',
  },
};

// Define file formats
export const fileFormats: Record<string, FileFormat> = {
  // Document formats
  pdf: {
    id: 'pdf',
    name: 'PDF',
    extension: 'pdf',
    mimeTypes: ['application/pdf'],
    category: fileCategories.document,
    icon: FaFilePdf,
    description: 'Portable Document Format',
  },
  docx: {
    id: 'docx',
    name: 'Word Document',
    extension: 'docx',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    category: fileCategories.document,
    icon: FaFileWord,
    description: 'Microsoft Word Document',
  },
  doc: {
    id: 'doc',
    name: 'Word Document (Legacy)',
    extension: 'doc',
    mimeTypes: ['application/msword'],
    category: fileCategories.document,
    icon: FaFileWord,
    description: 'Microsoft Word Document (Legacy)',
  },
  xlsx: {
    id: 'xlsx',
    name: 'Excel Spreadsheet',
    extension: 'xlsx',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    category: fileCategories.document,
    icon: FaFileExcel,
    description: 'Microsoft Excel Spreadsheet',
  },
  xls: {
    id: 'xls',
    name: 'Excel Spreadsheet (Legacy)',
    extension: 'xls',
    mimeTypes: ['application/vnd.ms-excel'],
    category: fileCategories.document,
    icon: FaFileExcel,
    description: 'Microsoft Excel Spreadsheet (Legacy)',
  },
  pptx: {
    id: 'pptx',
    name: 'PowerPoint Presentation',
    extension: 'pptx',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    category: fileCategories.document,
    icon: FaFilePowerpoint,
    description: 'Microsoft PowerPoint Presentation',
  },
  ppt: {
    id: 'ppt',
    name: 'PowerPoint Presentation (Legacy)',
    extension: 'ppt',
    mimeTypes: ['application/vnd.ms-powerpoint'],
    category: fileCategories.document,
    icon: FaFilePowerpoint,
    description: 'Microsoft PowerPoint Presentation (Legacy)',
  },
  txt: {
    id: 'txt',
    name: 'Text File',
    extension: 'txt',
    mimeTypes: ['text/plain'],
    category: fileCategories.document,
    icon: FaFileAlt,
    description: 'Plain Text File',
  },
  
  // Image formats
  jpg: {
    id: 'jpg',
    name: 'JPEG Image',
    extension: 'jpg',
    mimeTypes: ['image/jpeg'],
    category: fileCategories.image,
    icon: FaFileImage,
    description: 'JPEG Image Format',
  },
  png: {
    id: 'png',
    name: 'PNG Image',
    extension: 'png',
    mimeTypes: ['image/png'],
    category: fileCategories.image,
    icon: FaFileImage,
    description: 'Portable Network Graphics',
  },
  gif: {
    id: 'gif',
    name: 'GIF Image',
    extension: 'gif',
    mimeTypes: ['image/gif'],
    category: fileCategories.image,
    icon: FaFileImage,
    description: 'Graphics Interchange Format',
  },
  webp: {
    id: 'webp',
    name: 'WebP Image',
    extension: 'webp',
    mimeTypes: ['image/webp'],
    category: fileCategories.image,
    icon: FaFileImage,
    description: 'Web Picture Format',
  },
  svg: {
    id: 'svg',
    name: 'SVG Image',
    extension: 'svg',
    mimeTypes: ['image/svg+xml'],
    category: fileCategories.image,
    icon: FaFileImage,
    description: 'Scalable Vector Graphics',
  },
  heic: {
    id: 'heic',
    name: 'HEIC Image',
    extension: 'heic',
    mimeTypes: ['image/heic', 'image/heif'],
    category: fileCategories.image,
    icon: FaFileImage,
    description: 'High Efficiency Image Format',
  },
  raw: {
    id: 'raw',
    name: 'RAW Image',
    extension: 'raw',
    mimeTypes: ['image/x-raw'],
    category: fileCategories.image,
    icon: FaFileImage,
    description: 'Camera Raw Image Format',
  },
  
  // Audio formats
  mp3: {
    id: 'mp3',
    name: 'MP3 Audio',
    extension: 'mp3',
    mimeTypes: ['audio/mpeg'],
    category: fileCategories.audio,
    icon: FaFileAudio,
    description: 'MPEG Audio Layer III',
  },
  wav: {
    id: 'wav',
    name: 'WAV Audio',
    extension: 'wav',
    mimeTypes: ['audio/wav', 'audio/x-wav'],
    category: fileCategories.audio,
    icon: FaFileAudio,
    description: 'Waveform Audio File Format',
  },
  ogg: {
    id: 'ogg',
    name: 'OGG Audio',
    extension: 'ogg',
    mimeTypes: ['audio/ogg'],
    category: fileCategories.audio,
    icon: FaFileAudio,
    description: 'Ogg Vorbis Audio Format',
  },
  flac: {
    id: 'flac',
    name: 'FLAC Audio',
    extension: 'flac',
    mimeTypes: ['audio/flac'],
    category: fileCategories.audio,
    icon: FaFileAudio,
    description: 'Free Lossless Audio Codec',
  },
  m4a: {
    id: 'm4a',
    name: 'M4A Audio',
    extension: 'm4a',
    mimeTypes: ['audio/mp4', 'audio/x-m4a'],
    category: fileCategories.audio,
    icon: FaFileAudio,
    description: 'MPEG-4 Audio Layer',
  },
  
  // Video formats
  mp4: {
    id: 'mp4',
    name: 'MP4 Video',
    extension: 'mp4',
    mimeTypes: ['video/mp4'],
    category: fileCategories.video,
    icon: FaFileVideo,
    description: 'MPEG-4 Video Format',
  },
  avi: {
    id: 'avi',
    name: 'AVI Video',
    extension: 'avi',
    mimeTypes: ['video/x-msvideo'],
    category: fileCategories.video,
    icon: FaFileVideo,
    description: 'Audio Video Interleave',
  },
  mov: {
    id: 'mov',
    name: 'QuickTime Video',
    extension: 'mov',
    mimeTypes: ['video/quicktime'],
    category: fileCategories.video,
    icon: FaFileVideo,
    description: 'Apple QuickTime Movie',
  },
  webm: {
    id: 'webm',
    name: 'WebM Video',
    extension: 'webm',
    mimeTypes: ['video/webm'],
    category: fileCategories.video,
    icon: FaFileVideo,
    description: 'Web Media Video Format',
  },
  mkv: {
    id: 'mkv',
    name: 'MKV Video',
    extension: 'mkv',
    mimeTypes: ['video/x-matroska'],
    category: fileCategories.video,
    icon: FaFileVideo,
    description: 'Matroska Video Format',
  },
  
  // Archive formats
  zip: {
    id: 'zip',
    name: 'ZIP Archive',
    extension: 'zip',
    mimeTypes: ['application/zip'],
    category: fileCategories.archive,
    icon: FaFileArchive,
    description: 'ZIP Compressed Archive',
  },
  rar: {
    id: 'rar',
    name: 'RAR Archive',
    extension: 'rar',
    mimeTypes: ['application/x-rar-compressed'],
    category: fileCategories.archive,
    icon: FaFileArchive,
    description: 'RAR Compressed Archive',
  },
  
  // Ebook formats
  epub: {
    id: 'epub',
    name: 'EPUB Ebook',
    extension: 'epub',
    mimeTypes: ['application/epub+zip'],
    category: fileCategories.ebook,
    icon: FaBook,
    description: 'Electronic Publication',
  },
  mobi: {
    id: 'mobi',
    name: 'MOBI Ebook',
    extension: 'mobi',
    mimeTypes: ['application/x-mobipocket-ebook'],
    category: fileCategories.ebook,
    icon: FaBook,
    description: 'Mobipocket Ebook Format',
  },
};

// Get file formats by category
export function getFileFormatsByCategory(category: string): FileFormat[] {
  return Object.values(fileFormats).filter(format => format.category.id === category);
}

// Get all file categories
export function getAllFileCategories(): FileCategory[] {
  return Object.values(fileCategories);
}

// Get file format by extension
export function getFileFormatByExtension(extension: string): FileFormat | undefined {
  const normalizedExtension = extension.toLowerCase().replace(/^\./,'');
  return Object.values(fileFormats).find(format => format.extension === normalizedExtension);
}

// Get file format by MIME type
export function getFileFormatByMimetype(mimetype: string): FileFormat | undefined {
  return Object.values(fileFormats).find(format => format.mimeTypes.includes(mimetype));
}

// Get compatible target formats for a source format
export function getCompatibleTargetFormats(sourceFormat: string): FileFormat[] {
  const normalizedSourceFormat = sourceFormat.toLowerCase().replace(/^\./,'');
  const sourceFormatObj = getFileFormatByExtension(normalizedSourceFormat);
  
  if (!sourceFormatObj) {
    return [];
  }
  
  // Define compatibility map
  const compatibilityMap: Record<string, string[]> = {
    // Document formats
    'pdf': ['docx', 'xlsx', 'pptx', 'jpg', 'png'],
    'docx': ['pdf', 'txt'],
    'doc': ['pdf', 'docx', 'txt'],
    'xlsx': ['pdf', 'csv'],
    'xls': ['pdf', 'xlsx', 'csv'],
    'pptx': ['pdf', 'jpg'],
    'ppt': ['pdf', 'pptx', 'jpg'],
    'txt': ['pdf', 'docx'],
    
    // Image formats
    'jpg': ['png', 'webp', 'pdf'],
    'jpeg': ['png', 'webp', 'pdf'],
    'png': ['jpg', 'webp', 'pdf'],
    'webp': ['jpg', 'png'],
    'gif': ['jpg', 'png'],
    'svg': ['png', 'jpg', 'pdf'],
    'heic': ['jpg', 'png'],
    'raw': ['jpg', 'png'],
    
    // Audio formats
    'mp3': ['wav', 'ogg', 'flac'],
    'wav': ['mp3', 'ogg', 'flac'],
    'ogg': ['mp3', 'wav'],
    'flac': ['mp3', 'wav'],
    'm4a': ['mp3', 'wav'],
    
    // Video formats
    'mp4': ['webm', 'gif'],
    'avi': ['mp4', 'webm'],
    'mov': ['mp4', 'webm'],
    'webm': ['mp4'],
    'mkv': ['mp4', 'webm'],
  };
  
  const compatibleExtensions = compatibilityMap[normalizedSourceFormat] || [];
  return compatibleExtensions.map(ext => fileFormats[ext]).filter(Boolean);
}

/**
 * Validate file type
 * @param mimeType MIME type of the file
 * @param extension File extension
 * @returns Promise<void> that resolves if valid, rejects if invalid
 */
export async function validateFileType(mimeType: string, extension: string): Promise<void> {
  // Check if the file format is supported
  const formatByMime = getFileFormatByMimetype(mimeType);
  const formatByExt = getFileFormatByExtension(extension);
  
  if (!formatByMime && !formatByExt) {
    throw new Error(`Unsupported file type: ${mimeType} (${extension})`);
  }
  
  // Check if the MIME type matches the extension
  if (formatByMime && formatByExt && formatByMime.id !== formatByExt.id) {
    throw new Error(`MIME type ${mimeType} does not match extension ${extension}`);
  }
  
  // If we have a format by MIME type or extension, we're good
  return Promise.resolve();
}

/**
 * Validate file size
 * @param fileSize File size in bytes
 * @param isPremium Whether the user is premium
 * @returns Promise<void> that resolves if valid, rejects if invalid
 */
export async function validateFileSize(fileSize: number, isPremium: boolean): Promise<void> {
  // Define size limits
  const FREE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
  const PREMIUM_SIZE_LIMIT = 500 * 1024 * 1024; // 500MB
  
  const sizeLimit = isPremium ? PREMIUM_SIZE_LIMIT : FREE_SIZE_LIMIT;
  
  if (fileSize > sizeLimit) {
    const limitInMB = sizeLimit / (1024 * 1024);
    throw new Error(`File size exceeds the ${limitInMB}MB limit for ${isPremium ? 'premium' : 'free'} users`);
  }
  
  return Promise.resolve();
}

/**
 * Get file size limit based on user type
 * @param isPremium Whether the user is premium
 * @returns Size limit in bytes
 */
export function getFileSizeLimit(isPremium: boolean): number {
  return isPremium ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
}

/**
 * Format file size for display
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get estimated conversion time
 * @param sourceSize Source file size in bytes
 * @param sourceFormat Source file format
 * @param targetFormat Target file format
 * @returns Estimated time in seconds
 */
export function getEstimatedConversionTime(sourceSize: number, sourceFormat: string, targetFormat: string): number {
  // Base time for any conversion
  let baseTime = 2;
  
  // Add time based on file size (1 second per 5MB)
  const sizeMB = sourceSize / (1024 * 1024);
  baseTime += sizeMB / 5;
  
  // Add time based on conversion complexity
  const complexConversions = [
    'pdf-docx', 'docx-pdf', 'pdf-xlsx', 'xlsx-pdf', 'pdf-pptx', 'pptx-pdf',
    'mov-mp4', 'avi-mp4', 'mkv-mp4', 'webm-mp4',
    'flac-mp3', 'wav-mp3',
    'raw-jpg', 'heic-jpg'
  ];
  
  const conversionPair = `${sourceFormat}-${targetFormat}`;
  if (complexConversions.includes(conversionPair)) {
    baseTime *= 1.5;
  }
  
  return Math.ceil(baseTime);
}