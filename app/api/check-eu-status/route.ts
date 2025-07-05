import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the EU status from the header set by middleware
  const isEU = request.headers.get('x-is-eu') === 'true';
  
  // Return the EU status as JSON
  return NextResponse.json({ isEU });
}