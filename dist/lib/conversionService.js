"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("./redis");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const util = __importStar(require("util"));
const pdf_lib_1 = require("pdf-lib");
const sharp_1 = __importDefault(require("sharp"));
const execPromise = util.promisify(child_process_1.exec);
class ConversionService {
    constructor(job, options = {}) {
        this.job = job;
        this.options = options;
    }
    async run() {
        return this.retry(this.execute, 3, 1000);
    }
    async execute() {
        try {
            await this.updateStatus('PROCESSING', 'validating');
            await this.validateFile();
        }
        catch (error) {
            const conversionError = this.handleError(error);
            return {
                jobId: this.job.jobId,
                status: 'FAILED',
                error: conversionError.message,
                completedAt: Date.now(),
            };
        }
        try {
            await this.updateStatus('PROCESSING', 'converting');
            await this.updateProgress(0, 'converting');
            const outputDir = path.join(process.cwd(), 'uploads', 'output');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            const sourceExt = path.extname(this.job.sourceFile);
            const baseName = path.basename(this.job.sourceFile, sourceExt);
            const targetExt = `.${this.job.targetFormat.toLowerCase()}`;
            const outputFile = path.join(outputDir, `${baseName}_${Date.now()}${targetExt}`);
            await this.performConversion(this.job.sourceFile, outputFile);
            if (!fs.existsSync(outputFile)) {
                throw { code: 'E_NO_OUTPUT', message: 'Conversion failed: Output file not created' };
            }
            const stats = fs.statSync(outputFile);
            await this.updateProgress(100);
            const result = {
                jobId: this.job.jobId,
                status: 'COMPLETED',
                resultUrl: `/api/download?file=${path.basename(outputFile)}`,
                resultSize: stats.size,
                completedAt: Date.now(),
            };
            await this.updateStatus('COMPLETED');
            await (0, redis_1.setCache)(`result:${this.job.jobId}`, result, 60 * 60 * 24);
            return result;
        }
        catch (error) {
            const conversionError = this.handleError(error);
            await this.updateStatus('FAILED');
            const result = {
                jobId: this.job.jobId,
                status: 'FAILED',
                error: conversionError.message,
                completedAt: Date.now(),
            };
            await (0, redis_1.setCache)(`result:${this.job.jobId}`, result, 60 * 60 * 24);
            return result;
        }
    }
    async retry(fn, retries, delay) {
        try {
            return await fn();
        }
        catch (error) {
            if (retries > 0) {
                await this.updateStatus('PROCESSING', 'retrying');
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.retry(fn, retries - 1, delay * 2);
            }
            throw error;
        }
    }
    async performConversion(sourceFile, outputFile) {
        const conversionType = this.getConversionType();
        if (conversionType === 'image-to-pdf') {
            await this.convertImageToPdf(sourceFile, outputFile);
        }
        else {
            // Fallback to exec-based conversion for other types
            const command = `convert "${sourceFile}" "${outputFile}"`;
            await execPromise(command);
        }
    }
    getConversionType() {
        const sourceExt = this.job.sourceFormat.toLowerCase();
        const targetExt = this.job.targetFormat.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp'].includes(sourceExt) && targetExt === 'pdf') {
            return 'image-to-pdf';
        }
        return 'other';
    }
    async convertImageToPdf(sourceFile, outputFile) {
        try {
            const imageBuffer = await this.processImageWithTimeout(sourceFile, 5000);
            const pdfDoc = await pdf_lib_1.PDFDocument.create();
            const image = await pdfDoc.embedJpg(imageBuffer);
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(outputFile, pdfBytes);
        }
        catch (error) {
            console.error('Error converting image to PDF with pdf-lib, falling back to exec', error);
            // Fallback to exec-based conversion
            const command = `convert "${sourceFile}" "${outputFile}"`;
            await execPromise(command);
        }
    }
    async processImageWithTimeout(sourceFile, timeout) {
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject({ code: 'E_TIMEOUT', message: 'Image processing timed out' });
            }, timeout);
            try {
                const imageBuffer = await (0, sharp_1.default)(sourceFile).toBuffer();
                clearTimeout(timer);
                resolve(imageBuffer);
            }
            catch (error) {
                clearTimeout(timer);
                reject(error);
            }
        });
    }
    async updateStatus(status, stage) {
        this.job.status = status;
        if (stage) {
            this.job.stage = stage;
        }
        await (0, redis_1.setCache)(`conversion:${this.job.jobId}`, this.job, 60 * 60 * 24);
    }
    async updateProgress(progress, stage) {
        await (0, redis_1.setCache)(`progress:${this.job.jobId}`, progress, 60 * 60 * 24);
        // Emit progress to client via Socket.IO
        // This requires a Socket.IO instance to be available here
        // For now, this is a placeholder for the actual implementation
        console.log(`Emitting progress for job ${this.job.jobId}: ${progress}%`, stage ? `(stage: ${stage})` : '');
    }
    async validateFile() {
        const buffer = Buffer.alloc(4);
        const fd = fs.openSync(this.job.sourceFile, 'r');
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);
        const magicNumber = buffer.toString('hex');
        const sourceExt = this.job.sourceFormat.toLowerCase();
        const magicNumbers = {
            'jpg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
            'jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
            'png': ['89504e47'],
            'webp': ['52494646'],
        };
        if (!magicNumbers[sourceExt] || !magicNumbers[sourceExt].includes(magicNumber)) {
            throw { code: 'E_INVALID_FILE', message: 'Invalid file type or corrupted file.' };
        }
    }
    handleError(error) {
        console.error(`[ConversionError][${this.job.jobId}]`, error);
        if (error.code) {
            return error;
        }
        return { code: 'E_UNKNOWN', message: 'An unknown error occurred during conversion.' };
    }
}
exports.default = ConversionService;
