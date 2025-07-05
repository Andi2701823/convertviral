import { NextRequest, NextResponse } from 'next/server';
import { fileFormats, getFileFormatsByCategory, getAllFileCategories, getCompatibleTargetFormats } from '@/lib/fileTypes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sourceFormat = searchParams.get('sourceFormat');
    
    // If sourceFormat is provided, return compatible target formats
    if (sourceFormat) {
      const compatibleFormats = getCompatibleTargetFormats(sourceFormat);
      return NextResponse.json({
        sourceFormat,
        compatibleFormats,
      });
    }
    
    // If category is provided, return formats for that category
    if (category) {
      const formats = getFileFormatsByCategory(category as any);
      return NextResponse.json({
        category,
        formats,
      });
    }
    
    // Otherwise, return all formats grouped by category
    const categories = getAllFileCategories();
    const formatsByCategory = categories.reduce((acc, category) => {
      acc[category.id] = getFileFormatsByCategory(category.id);
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json({
      categories,
      formatsByCategory,
    });
  } catch (error) {
    console.error('Get formats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Return conversion matrix - which formats can be converted to which
export async function POST(request: NextRequest) {
  try {
    // Get the list of formats the client is interested in
    const body = await request.json();
    const { formats } = body;
    
    // If no formats provided, return all conversion possibilities
    if (!formats || !Array.isArray(formats) || formats.length === 0) {
      // Create a conversion matrix for all formats
      const allFormats = Object.keys(fileFormats);
      const conversionMatrix = allFormats.reduce((acc, format) => {
        acc[format] = getCompatibleTargetFormats(format).map(f => f.extension);
        return acc;
      }, {} as Record<string, string[]>);
      
      return NextResponse.json({
        conversionMatrix,
      });
    }
    
    // Otherwise, return conversion possibilities for the specified formats
    const conversionMatrix = formats.reduce((acc, format) => {
      acc[format] = getCompatibleTargetFormats(format).map(f => f.extension);
      return acc;
    }, {} as Record<string, string[]>);
    
    return NextResponse.json({
      conversionMatrix,
    });
  } catch (error) {
    console.error('Get conversion matrix error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}