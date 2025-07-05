"use strict";
/**
 * Storage Service for ConvertViral
 * Handles file uploads, downloads, and management using AWS S3
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileKey = generateFileKey;
exports.uploadFile = uploadFile;
exports.getSignedDownloadUrl = getSignedDownloadUrl;
exports.getSignedUploadUrl = getSignedUploadUrl;
exports.deleteFile = deleteFile;
exports.scheduleFileDeletion = scheduleFileDeletion;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
// Initialize S3 client
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN || '';
// Default expiration time for signed URLs (24 hours)
const DEFAULT_EXPIRATION = 60 * 60 * 24;
/**
 * Generate a unique file key for S3
 * @param fileName Original file name
 * @param userId Optional user ID to associate with the file
 * @returns Unique file key
 */
function generateFileKey(fileName, userId) {
    const timestamp = Date.now();
    const uuid = (0, uuid_1.v4)();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return userId
        ? `uploads/${userId}/${timestamp}-${uuid}-${sanitizedFileName}`
        : `uploads/anonymous/${timestamp}-${uuid}-${sanitizedFileName}`;
}
/**
 * Upload a file to S3
 * @param fileBuffer File buffer to upload
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param userId Optional user ID to associate with the file
 * @returns Object containing the file key and public URL
 */
async function uploadFile(fileBuffer, fileName, contentType, userId) {
    const fileKey = generateFileKey(fileName, userId);
    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: contentType,
        Metadata: {
            originalName: fileName,
            uploadedBy: userId || 'anonymous',
            uploadedAt: new Date().toISOString()
        }
    };
    try {
        await s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
        // Generate public URL
        const publicUrl = CLOUDFRONT_DOMAIN
            ? `https://${CLOUDFRONT_DOMAIN}/${fileKey}`
            : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        return {
            key: fileKey,
            url: publicUrl
        };
    }
    catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('Failed to upload file');
    }
}
/**
 * Generate a signed URL for downloading a file
 * @param fileKey S3 file key
 * @param expiresIn Expiration time in seconds (default: 24 hours)
 * @returns Signed URL for downloading the file
 */
async function getSignedDownloadUrl(fileKey, expiresIn = DEFAULT_EXPIRATION) {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey
    });
    try {
        return await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn });
    }
    catch (error) {
        console.error('Error generating signed URL:', error);
        throw new Error('Failed to generate download URL');
    }
}
/**
 * Generate a signed URL for uploading a file directly to S3
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param userId Optional user ID to associate with the file
 * @param expiresIn Expiration time in seconds (default: 1 hour)
 * @returns Object containing the file key and signed upload URL
 */
async function getSignedUploadUrl(fileName, contentType, userId, expiresIn = 3600) {
    const fileKey = generateFileKey(fileName, userId);
    const command = new client_s3_1.PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        ContentType: contentType,
        Metadata: {
            originalName: fileName,
            uploadedBy: userId || 'anonymous',
            uploadedAt: new Date().toISOString()
        }
    });
    try {
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn });
        return {
            key: fileKey,
            url: signedUrl
        };
    }
    catch (error) {
        console.error('Error generating signed upload URL:', error);
        throw new Error('Failed to generate upload URL');
    }
}
/**
 * Delete a file from S3
 * @param fileKey S3 file key
 * @returns True if deletion was successful
 */
async function deleteFile(fileKey) {
    const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: fileKey
    };
    try {
        await s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        return true;
    }
    catch (error) {
        console.error('Error deleting file from S3:', error);
        throw new Error('Failed to delete file');
    }
}
/**
 * Schedule a file for deletion after a specified time
 * @param fileKey S3 file key
 * @param delayHours Number of hours before deletion (default: 24)
 */
function scheduleFileDeletion(fileKey, delayHours = 24) {
    const delayMs = delayHours * 60 * 60 * 1000;
    setTimeout(async () => {
        try {
            await deleteFile(fileKey);
            console.log(`File ${fileKey} deleted after ${delayHours} hours`);
        }
        catch (error) {
            console.error(`Failed to delete file ${fileKey}:`, error);
        }
    }, delayMs);
}
