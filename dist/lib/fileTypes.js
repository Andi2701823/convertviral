"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFormats = exports.fileCategories = void 0;
exports.getFileFormatsByCategory = getFileFormatsByCategory;
exports.getAllFileCategories = getAllFileCategories;
exports.getFileFormatByExtension = getFileFormatByExtension;
exports.getFileFormatByMimetype = getFileFormatByMimetype;
exports.getCompatibleTargetFormats = getCompatibleTargetFormats;
exports.validateFileType = validateFileType;
exports.validateFileSize = validateFileSize;
exports.getFileSizeLimit = getFileSizeLimit;
exports.formatFileSize = formatFileSize;
exports.getEstimatedConversionTime = getEstimatedConversionTime;
var fa_1 = require("react-icons/fa");
// Define file categories
exports.fileCategories = {
    document: {
        id: 'document',
        name: 'Documents',
        icon: fa_1.FaFileAlt,
        description: 'Document files like PDF, Word, Excel, etc.',
    },
    image: {
        id: 'image',
        name: 'Images',
        icon: fa_1.FaFileImage,
        description: 'Image files like JPG, PNG, GIF, etc.',
    },
    audio: {
        id: 'audio',
        name: 'Audio',
        icon: fa_1.FaFileAudio,
        description: 'Audio files like MP3, WAV, FLAC, etc.',
    },
    video: {
        id: 'video',
        name: 'Video',
        icon: fa_1.FaFileVideo,
        description: 'Video files like MP4, AVI, MOV, etc.',
    },
    archive: {
        id: 'archive',
        name: 'Archives',
        icon: fa_1.FaFileArchive,
        description: 'Archive files like ZIP, RAR, etc.',
    },
    ebook: {
        id: 'ebook',
        name: 'Ebooks',
        icon: fa_1.FaBook,
        description: 'Ebook files like EPUB, MOBI, etc.',
    },
};
// Define file formats
exports.fileFormats = {
    // Document formats
    pdf: {
        id: 'pdf',
        name: 'PDF',
        extension: 'pdf',
        mimeTypes: ['application/pdf'],
        category: exports.fileCategories.document,
        icon: fa_1.FaFilePdf,
        description: 'Portable Document Format',
    },
    docx: {
        id: 'docx',
        name: 'Word Document',
        extension: 'docx',
        mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        category: exports.fileCategories.document,
        icon: fa_1.FaFileWord,
        description: 'Microsoft Word Document',
    },
    doc: {
        id: 'doc',
        name: 'Word Document (Legacy)',
        extension: 'doc',
        mimeTypes: ['application/msword'],
        category: exports.fileCategories.document,
        icon: fa_1.FaFileWord,
        description: 'Microsoft Word Document (Legacy)',
    },
    xlsx: {
        id: 'xlsx',
        name: 'Excel Spreadsheet',
        extension: 'xlsx',
        mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        category: exports.fileCategories.document,
        icon: fa_1.FaFileExcel,
        description: 'Microsoft Excel Spreadsheet',
    },
    xls: {
        id: 'xls',
        name: 'Excel Spreadsheet (Legacy)',
        extension: 'xls',
        mimeTypes: ['application/vnd.ms-excel'],
        category: exports.fileCategories.document,
        icon: fa_1.FaFileExcel,
        description: 'Microsoft Excel Spreadsheet (Legacy)',
    },
    pptx: {
        id: 'pptx',
        name: 'PowerPoint Presentation',
        extension: 'pptx',
        mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        category: exports.fileCategories.document,
        icon: fa_1.FaFilePowerpoint,
        description: 'Microsoft PowerPoint Presentation',
    },
    ppt: {
        id: 'ppt',
        name: 'PowerPoint Presentation (Legacy)',
        extension: 'ppt',
        mimeTypes: ['application/vnd.ms-powerpoint'],
        category: exports.fileCategories.document,
        icon: fa_1.FaFilePowerpoint,
        description: 'Microsoft PowerPoint Presentation (Legacy)',
    },
    txt: {
        id: 'txt',
        name: 'Text File',
        extension: 'txt',
        mimeTypes: ['text/plain'],
        category: exports.fileCategories.document,
        icon: fa_1.FaFileAlt,
        description: 'Plain Text File',
    },
    // Image formats
    jpg: {
        id: 'jpg',
        name: 'JPEG Image',
        extension: 'jpg',
        mimeTypes: ['image/jpeg'],
        category: exports.fileCategories.image,
        icon: fa_1.FaFileImage,
        description: 'JPEG Image Format',
    },
    png: {
        id: 'png',
        name: 'PNG Image',
        extension: 'png',
        mimeTypes: ['image/png'],
        category: exports.fileCategories.image,
        icon: fa_1.FaFileImage,
        description: 'Portable Network Graphics',
    },
    gif: {
        id: 'gif',
        name: 'GIF Image',
        extension: 'gif',
        mimeTypes: ['image/gif'],
        category: exports.fileCategories.image,
        icon: fa_1.FaFileImage,
        description: 'Graphics Interchange Format',
    },
    webp: {
        id: 'webp',
        name: 'WebP Image',
        extension: 'webp',
        mimeTypes: ['image/webp'],
        category: exports.fileCategories.image,
        icon: fa_1.FaFileImage,
        description: 'Web Picture Format',
    },
    svg: {
        id: 'svg',
        name: 'SVG Image',
        extension: 'svg',
        mimeTypes: ['image/svg+xml'],
        category: exports.fileCategories.image,
        icon: fa_1.FaFileImage,
        description: 'Scalable Vector Graphics',
    },
    heic: {
        id: 'heic',
        name: 'HEIC Image',
        extension: 'heic',
        mimeTypes: ['image/heic', 'image/heif'],
        category: exports.fileCategories.image,
        icon: fa_1.FaFileImage,
        description: 'High Efficiency Image Format',
    },
    raw: {
        id: 'raw',
        name: 'RAW Image',
        extension: 'raw',
        mimeTypes: ['image/x-raw'],
        category: exports.fileCategories.image,
        icon: fa_1.FaFileImage,
        description: 'Camera Raw Image Format',
    },
    // Audio formats
    mp3: {
        id: 'mp3',
        name: 'MP3 Audio',
        extension: 'mp3',
        mimeTypes: ['audio/mpeg'],
        category: exports.fileCategories.audio,
        icon: fa_1.FaFileAudio,
        description: 'MPEG Audio Layer III',
    },
    wav: {
        id: 'wav',
        name: 'WAV Audio',
        extension: 'wav',
        mimeTypes: ['audio/wav', 'audio/x-wav'],
        category: exports.fileCategories.audio,
        icon: fa_1.FaFileAudio,
        description: 'Waveform Audio File Format',
    },
    ogg: {
        id: 'ogg',
        name: 'OGG Audio',
        extension: 'ogg',
        mimeTypes: ['audio/ogg'],
        category: exports.fileCategories.audio,
        icon: fa_1.FaFileAudio,
        description: 'Ogg Vorbis Audio Format',
    },
    flac: {
        id: 'flac',
        name: 'FLAC Audio',
        extension: 'flac',
        mimeTypes: ['audio/flac'],
        category: exports.fileCategories.audio,
        icon: fa_1.FaFileAudio,
        description: 'Free Lossless Audio Codec',
    },
    m4a: {
        id: 'm4a',
        name: 'M4A Audio',
        extension: 'm4a',
        mimeTypes: ['audio/mp4', 'audio/x-m4a'],
        category: exports.fileCategories.audio,
        icon: fa_1.FaFileAudio,
        description: 'MPEG-4 Audio Layer',
    },
    // Video formats
    mp4: {
        id: 'mp4',
        name: 'MP4 Video',
        extension: 'mp4',
        mimeTypes: ['video/mp4'],
        category: exports.fileCategories.video,
        icon: fa_1.FaFileVideo,
        description: 'MPEG-4 Video Format',
    },
    avi: {
        id: 'avi',
        name: 'AVI Video',
        extension: 'avi',
        mimeTypes: ['video/x-msvideo'],
        category: exports.fileCategories.video,
        icon: fa_1.FaFileVideo,
        description: 'Audio Video Interleave',
    },
    mov: {
        id: 'mov',
        name: 'QuickTime Video',
        extension: 'mov',
        mimeTypes: ['video/quicktime'],
        category: exports.fileCategories.video,
        icon: fa_1.FaFileVideo,
        description: 'Apple QuickTime Movie',
    },
    webm: {
        id: 'webm',
        name: 'WebM Video',
        extension: 'webm',
        mimeTypes: ['video/webm'],
        category: exports.fileCategories.video,
        icon: fa_1.FaFileVideo,
        description: 'Web Media Video Format',
    },
    mkv: {
        id: 'mkv',
        name: 'MKV Video',
        extension: 'mkv',
        mimeTypes: ['video/x-matroska'],
        category: exports.fileCategories.video,
        icon: fa_1.FaFileVideo,
        description: 'Matroska Video Format',
    },
    // Archive formats
    zip: {
        id: 'zip',
        name: 'ZIP Archive',
        extension: 'zip',
        mimeTypes: ['application/zip'],
        category: exports.fileCategories.archive,
        icon: fa_1.FaFileArchive,
        description: 'ZIP Compressed Archive',
    },
    rar: {
        id: 'rar',
        name: 'RAR Archive',
        extension: 'rar',
        mimeTypes: ['application/x-rar-compressed'],
        category: exports.fileCategories.archive,
        icon: fa_1.FaFileArchive,
        description: 'RAR Compressed Archive',
    },
    // Ebook formats
    epub: {
        id: 'epub',
        name: 'EPUB Ebook',
        extension: 'epub',
        mimeTypes: ['application/epub+zip'],
        category: exports.fileCategories.ebook,
        icon: fa_1.FaBook,
        description: 'Electronic Publication',
    },
    mobi: {
        id: 'mobi',
        name: 'MOBI Ebook',
        extension: 'mobi',
        mimeTypes: ['application/x-mobipocket-ebook'],
        category: exports.fileCategories.ebook,
        icon: fa_1.FaBook,
        description: 'Mobipocket Ebook Format',
    },
};
// Get file formats by category
function getFileFormatsByCategory(category) {
    return Object.values(exports.fileFormats).filter(function (format) { return format.category.id === category; });
}
// Get all file categories
function getAllFileCategories() {
    return Object.values(exports.fileCategories);
}
// Get file format by extension
function getFileFormatByExtension(extension) {
    var normalizedExtension = extension.toLowerCase().replace(/^\./, '');
    return Object.values(exports.fileFormats).find(function (format) { return format.extension === normalizedExtension; });
}
// Get file format by MIME type
function getFileFormatByMimetype(mimetype) {
    return Object.values(exports.fileFormats).find(function (format) { return format.mimeTypes.includes(mimetype); });
}
// Get compatible target formats for a source format
function getCompatibleTargetFormats(sourceFormat) {
    var normalizedSourceFormat = sourceFormat.toLowerCase().replace(/^\./, '');
    var sourceFormatObj = getFileFormatByExtension(normalizedSourceFormat);
    if (!sourceFormatObj) {
        return [];
    }
    // Define compatibility map
    var compatibilityMap = {
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
    var compatibleExtensions = compatibilityMap[normalizedSourceFormat] || [];
    return compatibleExtensions.map(function (ext) { return exports.fileFormats[ext]; }).filter(Boolean);
}
/**
 * Validate file type
 * @param mimeType MIME type of the file
 * @param extension File extension
 * @returns Promise<void> that resolves if valid, rejects if invalid
 */
function validateFileType(mimeType, extension) {
    return __awaiter(this, void 0, void 0, function () {
        var formatByMime, formatByExt;
        return __generator(this, function (_a) {
            formatByMime = getFileFormatByMimetype(mimeType);
            formatByExt = getFileFormatByExtension(extension);
            if (!formatByMime && !formatByExt) {
                throw new Error("Unsupported file type: ".concat(mimeType, " (").concat(extension, ")"));
            }
            // Check if the MIME type matches the extension
            if (formatByMime && formatByExt && formatByMime.id !== formatByExt.id) {
                throw new Error("MIME type ".concat(mimeType, " does not match extension ").concat(extension));
            }
            // If we have a format by MIME type or extension, we're good
            return [2 /*return*/, Promise.resolve()];
        });
    });
}
/**
 * Validate file size
 * @param fileSize File size in bytes
 * @param isPremium Whether the user is premium
 * @returns Promise<void> that resolves if valid, rejects if invalid
 */
function validateFileSize(fileSize, isPremium) {
    return __awaiter(this, void 0, void 0, function () {
        var FREE_SIZE_LIMIT, PREMIUM_SIZE_LIMIT, sizeLimit, limitInMB;
        return __generator(this, function (_a) {
            FREE_SIZE_LIMIT = 50 * 1024 * 1024;
            PREMIUM_SIZE_LIMIT = 500 * 1024 * 1024;
            sizeLimit = isPremium ? PREMIUM_SIZE_LIMIT : FREE_SIZE_LIMIT;
            if (fileSize > sizeLimit) {
                limitInMB = sizeLimit / (1024 * 1024);
                throw new Error("File size exceeds the ".concat(limitInMB, "MB limit for ").concat(isPremium ? 'premium' : 'free', " users"));
            }
            return [2 /*return*/, Promise.resolve()];
        });
    });
}
/**
 * Get file size limit based on user type
 * @param isPremium Whether the user is premium
 * @returns Size limit in bytes
 */
function getFileSizeLimit(isPremium) {
    return isPremium ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
}
/**
 * Format file size for display
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * Get estimated conversion time
 * @param sourceSize Source file size in bytes
 * @param sourceFormat Source file format
 * @param targetFormat Target file format
 * @returns Estimated time in seconds
 */
function getEstimatedConversionTime(sourceSize, sourceFormat, targetFormat) {
    // Base time for any conversion
    var baseTime = 2;
    // Add time based on file size (1 second per 5MB)
    var sizeMB = sourceSize / (1024 * 1024);
    baseTime += sizeMB / 5;
    // Add time based on conversion complexity
    var complexConversions = [
        'pdf-docx', 'docx-pdf', 'pdf-xlsx', 'xlsx-pdf', 'pdf-pptx', 'pptx-pdf',
        'mov-mp4', 'avi-mp4', 'mkv-mp4', 'webm-mp4',
        'flac-mp3', 'wav-mp3',
        'raw-jpg', 'heic-jpg'
    ];
    var conversionPair = "".concat(sourceFormat, "-").concat(targetFormat);
    if (complexConversions.includes(conversionPair)) {
        baseTime *= 1.5;
    }
    return Math.ceil(baseTime);
}
