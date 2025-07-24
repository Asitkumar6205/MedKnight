// app/api/extract-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    
    // Import pdf-parse dynamically to avoid SSR issues
    const pdf = (await import('pdf-parse')).default;
    const buffer = Buffer.from(bytes);

    const data = await pdf(buffer);

    return NextResponse.json({
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    });
  } catch (error) {
    console.error('PDF extraction error:', error);
    
    // Return more detailed error information for debugging
    return NextResponse.json(
      { 
        error: 'Failed to extract PDF content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}