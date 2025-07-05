import * as crypto from 'crypto';
import * as fs from 'fs';
import { promisify } from 'util';
import { getRedisClient } from './redis';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { captureException } from './monitoring';
import { createLogger, format, transports } from 'winston';

/**
 * Security logger for tracking security events
 */
export const securityLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.metadata()
  ),
  defaultMeta: { service: 'security-service' },
  transports: [
    // Console transport for development
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, metadata }) => {
          return `${timestamp} [SECURITY] ${level}: ${message} ${JSON.stringify(metadata)}`;
        })
      ),
    }),
    // File transport for production
    new transports.File({ 
      filename: 'logs/security.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * Error types for security operations
 */
export enum SecurityErrorType {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  VIRUS_DETECTED = 'VIRUS_DETECTED',
  FILE_TYPE_MISMATCH = 'FILE_TYPE_MISMATCH',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Security error class for standardized error handling
 */
export class SecurityError extends Error {
  type: SecurityErrorType;
  details: Record<string, any>;
  timestamp: number;
  userId?: string;
  ip?: string;
  
  constructor(type: SecurityErrorType, message: string, details: Record<string, any> = {}) {
    super(message);
    this.name = 'SecurityError';
    this.type = type;
    this.details = details;
    this.timestamp = Date.now();
    
    // Log the security error
    this.logError();
  }
  
  /**
   * Log the security error
   */
  private logError() {
    securityLogger.warn(this.message, {
      errorType: this.type,
      details: this.details,
      timestamp: this.timestamp,
      userId: this.userId,
      ip: this.ip,
      stack: this.stack,
    });
  }
  
  /**
   * Add user context to the error
   */
  withUser(userId: string, ip?: string): this {
    this.userId = userId;
    this.ip = ip;
    return this;
  }
}

const readFile = promisify(fs.readFile);

/**
 * Interface for virus scan result
 */
export interface VirusScanResult {
  isClean: boolean;
  threatName?: string;
  scanTime: number; // in milliseconds
  scanEngine?: string;
}

/**
 * Magic number signatures for file type validation
 */
const FILE_SIGNATURES: Record<string, { signature: number[]; offset: number }[]> = {
  'application/pdf': [{ signature: [0x25, 0x50, 0x44, 0x46], offset: 0 }], // %PDF
  'image/jpeg': [
    { signature: [0xFF, 0xD8, 0xFF], offset: 0 },
    { signature: [0xFF, 0xD8, 0xFF, 0xE0], offset: 0 },
    { signature: [0xFF, 0xD8, 0xFF, 0xE1], offset: 0 }
  ],
  'image/png': [{ signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], offset: 0 }],
  'image/gif': [
    { signature: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], offset: 0 }, // GIF87a
    { signature: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], offset: 0 }  // GIF89a
  ],
  'application/zip': [{ signature: [0x50, 0x4B, 0x03, 0x04], offset: 0 }],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    { signature: [0x50, 0x4B, 0x03, 0x04], offset: 0 } // DOCX is ZIP-based
  ],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    { signature: [0x50, 0x4B, 0x03, 0x04], offset: 0 } // XLSX is ZIP-based
  ],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    { signature: [0x50, 0x4B, 0x03, 0x04], offset: 0 } // PPTX is ZIP-based
  ],
  'application/msword': [{ signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], offset: 0 }],
  'video/mp4': [
    { signature: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // ftyp
    { signature: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], offset: 0 }
  ],
  'audio/mpeg': [{ signature: [0xFF, 0xFB], offset: 0 }, { signature: [0x49, 0x44, 0x33], offset: 0 }] // MP3
};

/**
 * Calculate file hash (SHA-256)
 * @param filePath Path to the file
 * @returns Promise with the file hash
 */
export async function calculateFileHash(filePath: string): Promise<string> {
  try {
    const fileBuffer = await readFile(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error('Error calculating file hash:', error);
    throw new Error('Failed to calculate file hash');
  }
}

/**
 * Check if a file has been previously scanned and is clean
 * @param fileHash SHA-256 hash of the file
 * @returns Promise<boolean> true if file is known to be clean
 */
export async function isKnownCleanFile(fileHash: string): Promise<boolean> {
  try {
    const redis = await getRedisClient();
    const result = await redis.get(`virus:clean:${fileHash}`);
    return result === 'clean';
  } catch (error) {
    console.error('Error checking known clean file:', error);
    return false;
  }
}

/**
 * Mark a file as clean in the cache
 * @param fileHash SHA-256 hash of the file
 * @param ttlInSeconds Time to live in seconds (default: 7 days)
 */
export async function markFileAsClean(fileHash: string, ttlInSeconds = 7 * 24 * 60 * 60): Promise<void> {
  try {
    const redis = await getRedisClient();
    await redis.set(`virus:clean:${fileHash}`, 'clean', { EX: ttlInSeconds });
  } catch (error) {
    console.error('Error marking file as clean:', error);
  }
}

/**
 * CSRF token generation and validation
 */
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
  
  /**
   * Generate a CSRF token
   */
  static generateToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(this.TOKEN_LENGTH).toString('hex');
  }
  
  /**
   * Validate CSRF token
   */
  static validateToken(token: string, sessionToken: string): boolean {
    if (!token || !sessionToken) {
      return false;
    }
    
    // Use constant-time comparison to prevent timing attacks
    const crypto = require('crypto');
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(sessionToken, 'hex')
    );
  }
}

/**
 * XSS prevention utilities
 */
export class XSSProtection {
  /**
   * Sanitize HTML content
   */
  static sanitizeHTML(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  /**
   * Validate and sanitize user input
   */
  static sanitizeInput(input: string, maxLength: number = 1000): string {
    if (!input) return '';
    
    // Trim and limit length
    let sanitized = input.trim().substring(0, maxLength);
    
    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>"'&]/g, '');
    
    // Remove script tags and javascript: protocols
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    
    return sanitized;
  }
  
  /**
   * Validate file name for security
   */
  static sanitizeFileName(fileName: string): string {
    if (!fileName) return 'untitled';
    
    // Remove path traversal attempts
    let sanitized = fileName.replace(/\.\./g, '');
    
    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>:"|?*\\\//]/g, '_');
    
    // Limit length
    sanitized = sanitized.substring(0, 255);
    
    // Ensure it's not empty
    return sanitized || 'untitled';
  }
}

/**
 * Virus scanning service
 * @param filePath Path to the file
 * @returns Virus scan result
 */
export async function scanForViruses(filePath: string): Promise<VirusScanResult> {
  const startTime = Date.now();
  
  try {
    // This is a placeholder for a real virus scanning service
    // In production, this would be replaced with a call to a real service like ClamAV, VirusTotal API, etc.
    
    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate 500ms scan time
    
    // Read file for basic checks (in a real implementation, this would be more sophisticated)
    const fs = require('fs');
    const fileStats = await fs.promises.stat(filePath);
    
    // Log the scan for monitoring
    console.log(`[SECURITY] Virus scan completed for file: ${filePath} (${fileStats.size} bytes)`);
    
    // Random chance of detecting a "virus" for testing (1% chance)
    // Remove this in production and replace with real scanning
    const randomDetection = Math.random() < 0.01;
    
    if (randomDetection) {
      return {
        isClean: false,
        threatName: 'TEST-MALWARE-DETECTION',
        scanTime: Date.now() - startTime,
        scanEngine: 'ConvertViral-SecurityScan-v1'
      };
    }
    
    return {
      isClean: true,
      scanTime: Date.now() - startTime,
      scanEngine: 'ConvertViral-SecurityScan-v1'
    };
  } catch (error) {
    console.error(`[SECURITY] Virus scan failed for file: ${filePath}`, error);
    
    // In case of error, treat as potentially unsafe
    return {
      isClean: false,
      threatName: 'SCAN-ERROR',
      scanTime: Date.now() - startTime,
      scanEngine: 'ConvertViral-SecurityScan-v1'
    };
  }
}

/**
 * User plan types for rate limiting
 */
export type UserPlan = 'free' | 'premium' | 'enterprise';

/**
 * Rate limit configuration for different user plans
 */
interface RateLimitConfig {
  requests: number;
  windowMs: number;
  burstLimit?: number; // Allow short bursts
}

/**
 * Enhanced rate limiting with plan-based limits
 */
export class RateLimiter {
  private static readonly RATE_LIMITS: Record<UserPlan, Record<string, RateLimitConfig>> = {
    free: {
      upload: { requests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
      convert: { requests: 20, windowMs: 60 * 60 * 1000 }, // 20 per hour
      download: { requests: 30, windowMs: 60 * 60 * 1000 }, // 30 per hour
      api: { requests: 100, windowMs: 60 * 60 * 1000 }, // 100 per hour
      'file-size': { requests: 50 * 1024 * 1024, windowMs: 24 * 60 * 60 * 1000 }, // 50MB per day
    },
    premium: {
      upload: { requests: 100, windowMs: 60 * 60 * 1000, burstLimit: 20 }, // 100 per hour, burst 20
      convert: { requests: 200, windowMs: 60 * 60 * 1000, burstLimit: 50 }, // 200 per hour, burst 50
      download: { requests: 300, windowMs: 60 * 60 * 1000, burstLimit: 60 }, // 300 per hour, burst 60
      api: { requests: 1000, windowMs: 60 * 60 * 1000, burstLimit: 200 }, // 1000 per hour, burst 200
      'file-size': { requests: 500 * 1024 * 1024, windowMs: 24 * 60 * 60 * 1000 }, // 500MB per day
    },
    enterprise: {
      upload: { requests: 1000, windowMs: 60 * 60 * 1000, burstLimit: 200 },
      convert: { requests: 2000, windowMs: 60 * 60 * 1000, burstLimit: 500 },
      download: { requests: 3000, windowMs: 60 * 60 * 1000, burstLimit: 600 },
      api: { requests: 10000, windowMs: 60 * 60 * 1000, burstLimit: 2000 },
      'file-size': { requests: 5 * 1024 * 1024 * 1024, windowMs: 24 * 60 * 60 * 1000 }, // 5GB per day
    }
  };

  /**
   * Check if user is within rate limits
   */
  static async checkRateLimit(
    userId: string,
    action: string,
    userPlan: UserPlan,
    amount: number = 1
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number; error?: string }> {
    try {
      const redis = await getRedisClient();
      const config = this.RATE_LIMITS[userPlan][action];
      
      if (!config) {
        return { allowed: false, remaining: 0, resetTime: 0, error: `Unknown action: ${action}` };
      }

      const now = Date.now();
      const windowStart = now - config.windowMs;
      const key = `ratelimit:${userPlan}:${userId}:${action}`;
      const burstKey = `ratelimit:burst:${userPlan}:${userId}:${action}`;

      // Clean up old entries
      await redis.zRemRangeByScore(key, 0, windowStart);
      
      // Get current usage
      const currentUsage = await redis.zCard(key);
      const totalUsed = await redis.zRange(key, 0, -1, { withScores: true });
      const usedAmount = totalUsed.reduce((sum, item) => sum + (item.score || 0), 0);

      // Check burst limit if configured
      if (config.burstLimit) {
        const burstWindowStart = now - (5 * 60 * 1000); // 5-minute burst window
        await redis.zRemRangeByScore(burstKey, 0, burstWindowStart);
        const burstUsage = await redis.zCard(burstKey);
        
        if (burstUsage + amount > config.burstLimit) {
          return {
            allowed: false,
            remaining: Math.max(0, config.burstLimit - burstUsage),
            resetTime: now + (5 * 60 * 1000),
            error: 'Burst limit exceeded'
          };
        }
      }

      // Check main rate limit
      if (usedAmount + amount > config.requests) {
        return {
          allowed: false,
          remaining: Math.max(0, config.requests - usedAmount),
          resetTime: now + config.windowMs,
          error: 'Rate limit exceeded'
        };
      }

      // Record the usage
      const pipeline = redis.multi();
      pipeline.zAdd(key, { score: amount, value: `${now}:${amount}` });
      pipeline.expire(key, Math.ceil(config.windowMs / 1000));
      
      if (config.burstLimit) {
        pipeline.zAdd(burstKey, { score: amount, value: `${now}:${amount}` });
        pipeline.expire(burstKey, 5 * 60); // 5 minutes
      }
      
      await pipeline.exec();

      return {
        allowed: true,
        remaining: Math.max(0, config.requests - usedAmount - amount),
        resetTime: now + config.windowMs
      };
    } catch (error) {
      console.error(`[SECURITY] Rate limit check failed for ${userId}:${action}:`, error);
      // Fail open for better user experience
      return { allowed: true, remaining: 0, resetTime: 0, error: 'Rate limit check failed' };
    }
  }

  /**
   * Get current usage for a user and action
   */
  static async getUsage(
    userId: string,
    action: string,
    userPlan: UserPlan
  ): Promise<{ used: number; limit: number; resetTime: number }> {
    try {
      const redis = await getRedisClient();
      const config = this.RATE_LIMITS[userPlan][action];
      
      if (!config) {
        return { used: 0, limit: 0, resetTime: 0 };
      }

      const now = Date.now();
      const windowStart = now - config.windowMs;
      const key = `ratelimit:${userPlan}:${userId}:${action}`;

      // Clean up old entries
      await redis.zRemRangeByScore(key, 0, windowStart);
      
      // Get current usage
      const totalUsed = await redis.zRange(key, 0, -1, { withScores: true });
      const usedAmount = totalUsed.reduce((sum, item) => sum + (item.score || 0), 0);

      return {
        used: usedAmount,
        limit: config.requests,
        resetTime: now + config.windowMs
      };
    } catch (error) {
      console.error(`[SECURITY] Usage check failed for ${userId}:${action}:`, error);
      return { used: 0, limit: 0, resetTime: 0 };
    }
  }
}

/**
 * Legacy function for backward compatibility
 */
export async function checkRateLimits(
  userId: string,
  action: 'upload' | 'convert' | 'download',
  isPremium: boolean
): Promise<boolean> {
  const userPlan: UserPlan = isPremium ? 'premium' : 'free';
  const result = await RateLimiter.checkRateLimit(userId, action, userPlan);
  return result.allowed;
}

/**
 * Validate file magic number against expected MIME type
 * @param buffer File buffer to check
 * @param expectedMimeType Expected MIME type
 * @returns True if magic number matches
 */
export function validateMagicNumber(buffer: ArrayBuffer, expectedMimeType: string): boolean {
  const signatures = FILE_SIGNATURES[expectedMimeType];
  if (!signatures) {
    return false; // Unknown MIME type
  }

  const bytes = new Uint8Array(buffer);
  
  return signatures.some(({ signature, offset }) => {
    if (bytes.length < offset + signature.length) {
      return false;
    }
    
    return signature.every((byte, index) => bytes[offset + index] === byte);
  });
}

/**
 * Enhanced file validation with magic number checking
 * @param file File to validate
 * @param allowedTypes Allowed MIME types
 * @param maxSize Maximum file size in bytes
 * @returns Validation result
 */
export async function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): Promise<{ isValid: boolean; error?: string }> {
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`
    };
  }

  // Magic number validation
  try {
    const buffer = await file.arrayBuffer();
    const magicNumberValid = validateMagicNumber(buffer, file.type);
    
    if (!magicNumberValid) {
      return {
        isValid: false,
        error: `File content does not match declared MIME type ${file.type}`
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to read file for validation'
    };
  }

  return { isValid: true };
}

/**
 * Validate file extension against allowed list
 * @param extension File extension
 * @param allowedExtensions Array of allowed extensions
 * @returns boolean indicating if extension is allowed
 */
export function validateFileExtension(extension: string, allowedExtensions?: string[]): boolean {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return true; // No restrictions
  }
  
  const normalizedExtension = extension.toLowerCase().replace(/^\./, '');
  return allowedExtensions.includes(normalizedExtension);
}

/**
 * Sanitize filename to prevent path traversal and other security issues
 * @param filename Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal characters and other potentially dangerous characters
  return filename
    .replace(/\.\.+/g, '') // Remove path traversal sequences
    .replace(/[\/\\]/g, '') // Remove slashes
    .replace(/[\x00-\x1f\x7f-\xff]/g, '') // Remove control characters
    .replace(/[<>:"|\?\*]/g, '') // Remove reserved characters
    .trim(); // Remove leading/trailing whitespace
}

/**
 * Rate limiting middleware for API routes
 * @param maxRequests Maximum number of requests allowed in the time window
 * @param windowMs Time window in milliseconds
 * @returns Middleware function
 */
export function apiRateLimit(maxRequests = 100, windowMs = 60000) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Get client IP address
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = `apiratelimit:${ip}:${req.url}`;
    
    try {
      const redis = await getRedisClient();
      
      // Get current count
      const currentCount = await redis.get(key);
      const count = currentCount ? parseInt(currentCount, 10) : 0;
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - count - 1).toString());
      
      if (count >= maxRequests) {
        // Rate limit exceeded
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000).toString());
        return res.status(429).json({ error: 'Too many requests, please try again later' });
      }
      
      // Increment count and set expiry
      await redis.incr(key);
      await redis.expire(key, Math.ceil(windowMs / 1000));
      
      // Continue to the next middleware
      next();
    } catch (error) {
      // If Redis fails, allow the request but log the error
      console.error('Rate limiting error:', error);
      captureException(error as Error, { context: 'rate-limiting' });
      next();
    }
  };
}

/**
 * Validate request body against a Zod schema
 * @param schema Zod schema for validation
 * @returns Middleware function
 */
export function validateBody<T>(schema: z.ZodType<T>) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      // Validate request body
      const validatedData = schema.parse(req.body);
      
      // Replace request body with validated data
      req.body = validatedData;
      
      // Continue to the next middleware
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Return validation errors
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      
      // Handle other errors
      console.error('Validation error:', error);
      captureException(error as Error, { context: 'input-validation' });
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * CORS middleware
 * @param allowedOrigins Array of allowed origins
 * @returns Middleware function
 */
export function cors(allowedOrigins: string[] = ['*']) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const origin = req.headers.origin;
    
    // Set CORS headers
    if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Continue to the next middleware
    next();
  };
}

/**
 * Set security headers middleware
 */
export function securityHeaders(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*; font-src 'self' data:; connect-src 'self' https://* wss://*;"
  );
  
  // Continue to the next middleware
  next();
}

/**
 * Generate a secure random token
 * @param length Length of the token
 * @returns Secure random token
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // This is a placeholder - in a real implementation, you would use bcrypt
  // Example: return await bcrypt.hash(password, 10);
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 * @param password Plain text password
 * @param hashedPassword Hashed password
 * @returns Whether the password matches
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // This is a placeholder - in a real implementation, you would use bcrypt
  // Example: return await bcrypt.compare(password, hashedPassword);
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

/**
 * Combine multiple middleware functions into a single middleware
 * @param middlewares Array of middleware functions
 * @returns Combined middleware function
 */
export function combineMiddleware(middlewares: Array<(req: NextApiRequest, res: NextApiResponse, next: () => void) => void>) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Create a middleware chain
    const runMiddleware = (i: number) => {
      if (i < middlewares.length) {
        middlewares[i](req, res, () => runMiddleware(i + 1));
      } else {
        next();
      }
    };
    
    runMiddleware(0);
  };
}

/**
 * Create a secure API route with common middleware
 * @param handler API route handler
 * @param options Configuration options
 * @returns Next.js API handler
 */
export function createSecureApiRoute(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: {
    rateLimit?: { maxRequests: number; windowMs: number };
    corsOrigins?: string[];
    bodySchema?: z.ZodType<any>;
    methods?: string[];
  } = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Default options
    const {
      rateLimit = { maxRequests: 100, windowMs: 60000 },
      corsOrigins = ['*'],
      bodySchema,
      methods = ['GET', 'POST', 'PUT', 'DELETE']
    } = options;
    
    // Check if method is allowed
    if (!methods.includes(req.method || 'GET')) {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Create middleware stack
    const middlewares = [
      securityHeaders,
      cors(corsOrigins),
      apiRateLimit(rateLimit.maxRequests, rateLimit.windowMs)
    ];
    
    // Add body validation if schema is provided
    if (bodySchema && ['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      middlewares.push(validateBody(bodySchema));
    }
    
    // Execute middleware chain
    const executeMiddleware = () => {
      return new Promise<void>((resolve, reject) => {
        combineMiddleware(middlewares)(req, res, () => resolve());
      });
    };
    
    try {
      // Run middleware
      await executeMiddleware();
      
      // If response is already sent (e.g., by rate limiter), return
      if (res.writableEnded) return;
      
      // Execute handler
      await handler(req, res);
    } catch (error) {
      console.error('API route error:', error);
      captureException(error as Error, { context: 'api-route' });
      
      // If response is already sent, return
      if (res.writableEnded) return;
      
      // Send error response
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}