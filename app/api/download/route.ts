import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCache } from '@/lib/redis';
import { ConversionResult } from '@/lib/conversion';

// Force dynamic rendering to prevent static optimization warnings
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Get conversion result from Redis
    const result = await getCache<ConversionResult>(`result:${jobId}`);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Conversion result not found' },
        { status: 404 }
      );
    }
    
    // Check if conversion was successful
    if (result.status !== 'COMPLETED') {
      return NextResponse.json(
        { 
          error: 'Conversion not completed', 
          status: result.status,
          message: result.error || 'Conversion is still in progress'
        },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would stream the file from storage
    // For now, we'll just return a mock response with the file URL
    
    // Extract filename from URL
    if (!result.resultUrl) {
      return NextResponse.json(
        { error: 'Result URL not found' },
        { status: 404 }
      );
    }
    const url = new URL(result.resultUrl);
    const filename = path.basename(url.pathname);
    
    // Return file information
    return NextResponse.json({
      url: result.resultUrl,
      filename,
      size: result.resultSize,
      downloadExpiry: '24 hours',
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// In a real implementation, we would have a route to serve the actual file
// This would involve setting appropriate headers and streaming the file
// For example:

/*
export async function streamFile(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Length', stats.size.toString());
    
    // Create a readable stream
    const stream = fs.createReadStream(filePath);
    
    // Return the stream as the response
    return new NextResponse(stream as unknown as ReadableStream, {
      headers,
    });
  } catch (error) {
    console.error('Stream file error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
*/