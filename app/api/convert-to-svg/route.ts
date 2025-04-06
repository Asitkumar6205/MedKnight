// File: /api/convert-to-svg/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import potrace from 'potrace';
import Jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';

// Interfaces
interface ConversionResult {
  success: boolean;
  svgData?: string;
  error?: string;
}

// This function converts an image file to SVG
async function convertImageToSVG(
  imagePath: string,
  options = {
    threshold: 128,
    color: '#000000',
    background: 'transparent',
    turdSize: 2,
    alphaMax: 1,
    optCurve: true,
    optTolerance: 0.2,
  }
): Promise<ConversionResult> {
  try {
    // Read the image file
    const image = await Jimp.read(imagePath);
    
    // Process the image to enhance signature
    image
      .grayscale() // Convert to grayscale
      .contrast(0.3) // Increase contrast
      .threshold({ max: 255, replace: 255, autoGreyscale: false }) // Create a more binary image
      .invert(); // Invert colors for better tracing
    
    // Get buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
    return new Promise((resolve, reject) => {
      // Use potrace for vectorizing the image
      potrace.trace(buffer, options, (err: Error | null, svg: string) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, svgData: svg });
        }
      });
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, imageType = 'signature' } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // For demo purposes, assume you have the file path:
    const signatureFilePath = path.join(process.cwd(), 'public/uploads/signatures', `${userId}.png`);
    
    // Check if file exists
    try {
      await fs.access(signatureFilePath);
    } catch (error) {
      return res.status(404).json({ message: 'Signature file not found' });
    }

    // Convert image to SVG
    const result = await convertImageToSVG(signatureFilePath);
    
    if (!result.success) {
      return res.status(500).json({ message: 'Failed to convert signature', error: result.error });
    }

    // Save SVG data to database or file system
    const svgFileName = `${userId}-${uuidv4()}.svg`;
    const svgFilePath = path.join(process.cwd(), 'public/uploads/signatures', svgFileName);
    
    await fs.writeFile(svgFilePath, result.svgData as string);
    
    // TODO: Update user record with SVG signature path in your database
    // Example: await prisma.radiologist.update({ where: { id: userId }, data: { signatureSvg: `/uploads/signatures/${svgFileName}` } });

    return res.status(200).json({ 
      message: 'Signature converted successfully',
      svgPath: `/uploads/signatures/${svgFileName}`,
      svgData: result.svgData
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error processing signature', error: error.message });
  }
}