import Jimp from 'jimp/browser/lib/jimp';
import potrace from 'potrace';

/**
 * Converts an image file to SVG format on the client side
 * Ensures the signature is black with transparent background
 */
export const convertSignatureToSVG = async (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    // Create a FileReader to read the file
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          resolve(null);
          return;
        }

        // Convert ArrayBuffer to Buffer for Jimp to process
        const buffer = Buffer.from(event.target.result as ArrayBuffer);
        
        // Load the image with Jimp using the buffer
        const image = await Jimp.read(buffer);
        
        // Process the image to enhance signature quality
        // IMPORTANT: We don't invert the image here since we want the signature to be black
        image
          .grayscale()
          .contrast(0.5)
          .threshold({ max: 200, replace: 255, autoGreyscale: false });
        
        // Get the processed image as buffer
        const processedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
        
        // Configure potrace options for black signature on transparent background
        const potraceOptions = {
          threshold: 128,
          color: '#000000',       // Black signature
          background: 'transparent', // Transparent background
          turdSize: 2,           // Removes small dots/noise
          alphaMax: 1,
          optCurve: true,
          optTolerance: 0.2,
          blackOnWhite: true     // Important: This tells potrace that dark pixels are the foreground
        };
        
        // Trace the image to SVG
        potrace.trace(processedBuffer, potraceOptions, (err, svg) => {
          if (err || !svg) {
            console.error('Error tracing image:', err);
            resolve(null);
          } else {
            resolve(svg);
          }
        });
      } catch (error) {
        console.error('Error processing image:', error);
        resolve(null);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      resolve(null);
    };
    
    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
};

// Add this to your form submission logic
export const handleFileConversion = async (
  signatureFile: File,
  setConversionStatus?: (status: string) => void
): Promise<{ originalFile: File; svgBlob: Blob | null; svgFileName: string | null }> => {
  if (setConversionStatus) setConversionStatus('Converting signature to SVG...');
  
  try {
    const svgData = await convertSignatureToSVG(signatureFile);
    
    if (!svgData) {
      if (setConversionStatus) setConversionStatus('Conversion failed');
      return { originalFile: signatureFile, svgBlob: null, svgFileName: null };
    }
    
    // Create SVG blob and filename
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const svgFileName = signatureFile.name.replace(/\.[^/.]+$/, "") + ".svg";
    
    if (setConversionStatus) setConversionStatus('Conversion successful');
    
    return {
      originalFile: signatureFile,
      svgBlob,
      svgFileName
    };
  } catch (error) {
    console.error('Error during conversion:', error);
    if (setConversionStatus) setConversionStatus('Conversion error');
    return { originalFile: signatureFile, svgBlob: null, svgFileName: null };
  }
};