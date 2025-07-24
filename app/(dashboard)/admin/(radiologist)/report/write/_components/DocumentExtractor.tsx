import React, { useState } from "react";
import mammoth from "mammoth";

interface ExtractedContent {
  text: string;
  html?: string;
  fileName: string;
  fileType: string;
  pageCount?: number;
}

interface DocumentExtractorProps {
  onContentExtracted?: (html: string) => void;
  onContentAppended?: (html: string) => void;
  showCopyButton?: boolean;
}

const DocumentExtractor: React.FC<DocumentExtractorProps> = ({
  onContentExtracted,
  onContentAppended,
  showCopyButton = true,
}) => {
  const [extractedContent, setExtractedContent] =
    useState<ExtractedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    appendMode: boolean = false
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setCopySuccess(false);

    try {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        await extractFromWord(file, appendMode);
      } else {
        throw new Error(
          "Unsupported file type. Please upload a Word document (.doc or .docx)."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const enhanceFormatting = (html: string): string => {
    // Convert multiple consecutive <br> tags to proper paragraph spacing
    let enhanced = html.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p>');
    
    // Ensure proper paragraph wrapping
    if (!enhanced.startsWith('<p>')) {
      enhanced = '<p>' + enhanced;
    }
    if (!enhanced.endsWith('</p>')) {
      enhanced = enhanced + '</p>';
    }
    
    // Handle empty paragraphs and line breaks more carefully
    enhanced = enhanced.replace(/<p>\s*<\/p>/gi, '<p>&nbsp;</p>');
    
    // Convert single <br> tags to line breaks within paragraphs
    enhanced = enhanced.replace(/<br\s*\/?>/gi, '<br>');
    
    // Preserve spacing around bullet points and lists
    enhanced = enhanced.replace(/<li>/gi, '<li style="margin-bottom: 0.5em;">');
    
    // Add spacing after headings
    enhanced = enhanced.replace(/<\/h([1-6])>/gi, '</h$1><br>');
    
    // Preserve spacing around bold text
    enhanced = enhanced.replace(/<strong>/gi, '<strong>');
    enhanced = enhanced.replace(/<\/strong>/gi, '</strong>');
    
    // Handle specific formatting patterns common in medical reports
    enhanced = enhanced.replace(/([A-Z\s]+:)\s*/gi, '<strong>$1</strong><br>');
    
    // Preserve bullet point spacing
    enhanced = enhanced.replace(/•\s*/gi, '• ');
    
    // Add proper spacing between sections
    enhanced = enhanced.replace(/(<\/p>)(\s*)(<p><strong>[^<]+:<\/strong>)/gi, '$1<br>$3');
    
    return enhanced;
  };

  const extractFromWord = async (file: File, appendMode: boolean = false) => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      // Custom style map to preserve more formatting
      const styleMap = [
        "p[style-name='Normal'] => p:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh", 
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='List Paragraph'] => li:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em"
      ];

      // Extract with enhanced options for better formatting
      const options = {
        arrayBuffer,
        styleMap: styleMap,
        includeEmbeddedStyleMap: true,
        includeDefaultStyleMap: true,
        convertImage: mammoth.images.imgElement(function(image) {
          return image.read("base64").then(function(imageBuffer) {
            return {
              src: "data:" + image.contentType + ";base64," + imageBuffer
            };
          });
        })
      };

      const result = await mammoth.convertToHtml(options);
      
      // Also extract plain text for comparison
      const textResult = await mammoth.extractRawText({ arrayBuffer });

      // Enhance the formatting
      const enhancedHtml = enhanceFormatting(result.value);

      const content = {
        text: textResult.value,
        html: enhancedHtml,
        fileName: file.name,
        fileType: "Word Document",
      };

      setExtractedContent(content);

      // Use appropriate callback based on mode
      if (appendMode && onContentAppended && enhancedHtml) {
        onContentAppended(enhancedHtml);
      } else if (!appendMode && onContentExtracted && enhancedHtml) {
        onContentExtracted(enhancedHtml);
      }

      // Log any warnings
      if (result.messages.length > 0) {
        console.warn("Mammoth warnings:", result.messages);
      }
    } catch (error) {
      console.error("Word extraction error:", error);
      throw new Error(
        "Failed to extract text from Word document. The file might be corrupted or password-protected."
      );
    }
  };

  const copyToClipboard = async () => {
    if (!extractedContent?.html) return;
    
    try {
      await navigator.clipboard.writeText(extractedContent.html);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="">
      <div className="bg-stone-50 rounded-md border py-2 px-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Document Upload Options
        </h2>

        {/* Replace Content Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Your Own Format
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload a document to completely replace existing content in the editor
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose File to Replace Content
          </label>
          <input
            type="file"
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => handleFileUpload(e, false)}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
          />
        </div>

        {/* Append Content Section */}
        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Add More Study Templates
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload additional documents to append to existing content without deletion
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose File to Append Content
          </label>
          <input
            type="file"
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => handleFileUpload(e, true)}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50 cursor-pointer"
          />
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Only Word documents (.doc, .docx) are supported. Enhanced formatting preservation enabled.
        </p>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Extracting content with enhanced formatting...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentExtractor;