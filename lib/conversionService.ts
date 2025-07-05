import { ConversionJob, ConversionResult, ConversionOptions, ConversionStatus } from './conversion';
import { setCache } from './redis';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import * as util from 'util';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';

const execPromise = util.promisify(exec);

// Define a more detailed error structure
interface ConversionError {
  code: string;
  message: string;
  details?: any;
}

class ConversionService {
  private job: ConversionJob;
  private options: ConversionOptions;

  constructor(job: ConversionJob, options: ConversionOptions = {}) {
    this.job = job;
    this.options = options;
  }

  public async run(): Promise<ConversionResult> {
    return this.retry(this.execute, 3, 1000);
  }

  private async execute(): Promise<ConversionResult> {
    try {
      await this.updateStatus('PROCESSING', 'validating');
      await this.validateFile();
    } catch (error) {
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

      const result: ConversionResult = {
        jobId: this.job.jobId,
        status: 'COMPLETED',
        resultUrl: `/api/download?file=${path.basename(outputFile)}`,
        resultSize: stats.size,
        completedAt: Date.now(),
      };

      await this.updateStatus('COMPLETED');
      await setCache(`result:${this.job.jobId}`, result, 60 * 60 * 24);

      return result;
    } catch (error) {
      const conversionError = this.handleError(error);
      await this.updateStatus('FAILED');

      const result: ConversionResult = {
        jobId: this.job.jobId,
        status: 'FAILED',
        error: conversionError.message,
        completedAt: Date.now(),
      };

      await setCache(`result:${this.job.jobId}`, result, 60 * 60 * 24);
      return result;
    }
  }

  private async retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await this.updateStatus('PROCESSING', 'retrying');
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  private async performConversion(sourceFile: string, outputFile: string): Promise<void> {
    const conversionType = this.getConversionType();

    if (conversionType === 'image-to-pdf') {
      await this.convertImageToPdf(sourceFile, outputFile);
    } else {
      // Fallback to exec-based conversion for other types
      const command = `convert "${sourceFile}" "${outputFile}"`;
      await execPromise(command);
    }
  }

  private getConversionType(): string {
    const sourceExt = this.job.sourceFormat.toLowerCase();
    const targetExt = this.job.targetFormat.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'webp'].includes(sourceExt) && targetExt === 'pdf') {
      return 'image-to-pdf';
    }

    return 'other';
  }

  private async convertImageToPdf(sourceFile: string, outputFile: string): Promise<void> {
    try {
      const imageBuffer = await this.processImageWithTimeout(sourceFile, 5000);

      const pdfDoc = await PDFDocument.create();
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
    } catch (error) {
      console.error('Error converting image to PDF with pdf-lib, falling back to exec', error);
      // Fallback to exec-based conversion
      const command = `convert "${sourceFile}" "${outputFile}"`;
      await execPromise(command);
    }
  }

  private async processImageWithTimeout(sourceFile: string, timeout: number): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject({ code: 'E_TIMEOUT', message: 'Image processing timed out' });
      }, timeout);

      try {
        const imageBuffer = await sharp(sourceFile).toBuffer();
        clearTimeout(timer);
        resolve(imageBuffer);
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  private async updateStatus(status: ConversionJob['status'], stage?: ConversionJob['stage']): Promise<void> {
    this.job.status = status;
    if (stage) {
      (this.job as any).stage = stage;
    }
    await setCache(`conversion:${this.job.jobId}`, this.job, 60 * 60 * 24);
  }

  private async updateProgress(progress: number, stage?: ConversionJob['stage']): Promise<void> {
    await setCache(`progress:${this.job.jobId}`, progress, 60 * 60 * 24);
    // Emit progress to client via Socket.IO
    // This requires a Socket.IO instance to be available here
    // For now, this is a placeholder for the actual implementation
    console.log(`Emitting progress for job ${this.job.jobId}: ${progress}%`, stage ? `(stage: ${stage})` : '');
  }

  private async validateFile(): Promise<void> {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(this.job.sourceFile, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);

    const magicNumber = buffer.toString('hex');
    const sourceExt = this.job.sourceFormat.toLowerCase();

    const magicNumbers: { [key: string]: string[] } = {
      'jpg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
      'jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
      'png': ['89504e47'],
      'webp': ['52494646'],
    };

    if (!magicNumbers[sourceExt] || !magicNumbers[sourceExt].includes(magicNumber)) {
      throw { code: 'E_INVALID_FILE', message: 'Invalid file type or corrupted file.' };
    }
  }

  private handleError(error: any): ConversionError {
    console.error(`[ConversionError][${this.job.jobId}]`, error);
    if (error.code) {
      return error;
    }
    return { code: 'E_UNKNOWN', message: 'An unknown error occurred during conversion.' };
  }
}

export default ConversionService;