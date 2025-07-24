import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

interface HtmlToPdfComponentsProps {
  htmlContent: string;
  history: string;
}

const styles = StyleSheet.create({
  content: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 12,
    paddingHorizontal: 5,
    fontFamily: "Times-Roman",
    color: "#374151",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 15,
  },
  bullet: {
    width: 12,
    fontSize: 10,
    fontFamily: "Times-Roman",
    color: "#6b7280",
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    paddingRight: 5,
    fontFamily: "Times-Roman",
    color: "#374151",
    lineHeight: 1.5,
  },
  numberedPoint: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 15,
  },
  number: {
    width: 20,
    fontSize: 10,
    fontFamily: "Times-Roman",
    color: "#6b7280",
    fontWeight: "bold",
  },
  numberedText: {
    flex: 1,
    fontSize: 11,
    paddingRight: 5,
    fontFamily: "Times-Roman",
    color: "#374151",
    lineHeight: 1.5,
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginVertical: 8,
  },
  contentContainer: {
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  // Study Title styles
  studyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    fontFamily: "Times-Roman",
    color: "#1e3a8a",
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
    fontFamily: "Times-Roman",
    color: "#1e40af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingBottom: 4,
    paddingTop: 4,
    paddingHorizontal: 8,
  },
  // Clinical History Section - with left border
  clinicalHistorySection: {
    marginBottom: 15,
    marginTop: 10,
  },
  clinicalHistoryHeader: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 8,
    backgroundColor: "#f8fafc",
    borderLeft: "3px solid #3b82f6",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
    color: "#1e40af",
    textTransform: "uppercase",
  },
  clinicalHistoryContent: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 10,
    fontSize: 11,
    lineHeight: 1.6,
    fontFamily: "Times-Roman",
    color: "#374151",
  },
  // Technique Section - with border and background
  techniqueSection: {
    marginBottom: 15,
    marginTop: 10,
  },
  techniqueHeader: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f9ff",
    borderLeft: "3px solid #0ea5e9",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
    color: "#1e40af",
    textTransform: "uppercase",
  },
  techniqueContent: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 10,
    backgroundColor: "#f0f9ff",
    borderLeft: "3px solid #0ea5e9",
    fontSize: 11,
    lineHeight: 1.6,
    fontFamily: "Times-Roman",
    color: "#374151",
  },
  // Findings Section - with left border (fixed)
  findingsSection: {
    marginBottom: 15,
    marginTop: 10,
  },
  findingsHeader: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 8,
    backgroundColor: "#f7fee7",
    borderLeft: "3px solid #65a30d",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
    color: "#1e40af",
    textTransform: "uppercase",
  },
  findingsContent: {
    paddingRight: 12,
    paddingVertical: 2,
    fontSize: 11,
    fontFamily: "Times-Roman",
    color: "#374151",
  },
  // Impression Section - with left border (fixed)
  impressionSection: {
    marginBottom: 20,
    marginTop: 10,
  },
  impressionHeader: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 8,
    backgroundColor: "#fef3c7",
    borderLeft: "4px solid #f59e0b",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
    color: "#1e40af",
    textTransform: "uppercase",
  },
  impressionContent: {
    paddingRight: 12,
    paddingVertical: 2,
    fontSize: 11,
    fontFamily: "Times-Roman",
    color: "#374151",
  },
  defaultSection: {
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 1.6,
    fontFamily: "Times-Roman",
    color: "#374151",
    paddingHorizontal: 5,
  },
});

const HtmlToPdfComponents: React.FC<HtmlToPdfComponentsProps> = ({
  htmlContent,
  history,
}) => {
  // Fixed the logic - should return null if htmlContent is empty or undefined
  if (!htmlContent || htmlContent.trim() === "") {
    return null;
  }

  // This function needs to run in the browser environment
  if (typeof window === "undefined") {
    return <Text>Loading...</Text>;
  }

  // Parse the HTML content
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlContent;

  const isStudyTitle = (textContent: string): boolean => {
    const upperText = textContent.toUpperCase().trim();

    // Only match exact study titles or very specific standalone patterns
    const exactStudyTitlePatterns = [
      /^CT\s+PNS$/i,
      /^CECT\s+[A-Z\s]+$/i,
      /^MRI\s+SCREENING\s+SI\s+JOINT$/i,
      /^X-?RAY\s+[A-Z\s]+$/i, // X-RAY followed by body part (complete line)
      /^ULTRASOUND\s+[A-Z\s]+$/i, // ULTRASOUND followed by body part (complete line)
      /^MAMMOGRAPHY$/i,
      /^BONE\s+SCAN$/i,
      /^PET\s+SCAN$/i,
      /^DEXA\s+SCAN$/i,
    ];

    // Additional check: study titles are typically short (less than 50 characters) and don't contain detailed descriptions
    const isShortAndSimple =
      upperText.length < 50 &&
      !upperText.includes("WITH") &&
      !upperText.includes("OF");

    return (
      exactStudyTitlePatterns.some((pattern) => pattern.test(upperText)) &&
      isShortAndSimple
    );
  };

  // Function to determine section type and extract header/content
  const parseSection = (textContent: string) => {
    const trimmedText = textContent.trim();
    const upperText = trimmedText.toUpperCase();

    // Check if it's a study title first
    if (isStudyTitle(trimmedText)) {
      return {
        type: "studyTitle",
        header: trimmedText,
        content: "",
      };
    }

    // Check for section headers and extract content
    if (
      upperText.startsWith("CLINICAL HISTORY") ||
      upperText.startsWith("CLINICAL DETAILS")
    ) {
      const headerMatch = trimmedText.match(
        /^(CLINICAL (?:HISTORY|DETAILS)[^:]*:?)\s*([\s\S]*)/i
      );
      return {
        type: "clinical",
        header:
          headerMatch?.[1] ||
          (upperText.startsWith("CLINICAL DETAILS")
            ? "CLINICAL DETAILS"
            : "CLINICAL HISTORY"),
        // FIXED: Only use the content from HTML, don't duplicate with history parameter
        content: headerMatch?.[2]?.trim() || "",
      };
    }

    if (upperText.startsWith("TECHNIQUE")) {
      const headerMatch = trimmedText.match(/^(TECHNIQUE[^:]*:?)\s*([\s\S]*)/i);
      return {
        type: "technique",
        header: headerMatch?.[1] || "TECHNIQUE",
        content: headerMatch?.[2]?.trim() || "",
      };
    }

    if (
      upperText.startsWith("FINDINGS") ||
      upperText.startsWith("STUDY REVEALS") ||
      upperText.startsWith("OBSERVATIONS")
    ) {
      const headerMatch = trimmedText.match(
        /^((?:FINDINGS|STUDY REVEALS|OBSERVATIONS)[^:]*:?)\s*([\s\S]*)/i
      );
      return {
        type: "findings",
        header:
          headerMatch?.[1] ||
          (upperText.startsWith("STUDY REVEALS")
            ? "STUDY REVEALS"
            : upperText.startsWith("OBSERVATIONS")
            ? "OBSERVATIONS"
            : "FINDINGS"),
        content: headerMatch?.[2]?.trim() || "",
      };
    }

    if (upperText.startsWith("IMPRESSION")) {
      const headerMatch = trimmedText.match(
        /^(IMPRESSION[^:]*:?)\s*([\s\S]*)/i
      );
      return {
        type: "impression",
        header: headerMatch?.[1] || "IMPRESSION",
        content: headerMatch?.[2]?.trim() || "",
      };
    }

    return {
      type: "default",
      header: null,
      content: trimmedText,
    };
  };

  // Render section with proper header/content separation
  const renderSection = (
    sectionData: ReturnType<typeof parseSection>,
    index: string | number
  ) => {
    const { type, header, content } = sectionData;

    switch (type) {
      case "studyTitle":
        return (
          <Text key={index} style={styles.studyTitle}>
            {header}
          </Text>
        );

      case "clinical":
        return (
          <View key={index} style={styles.clinicalHistorySection}>
            <Text style={styles.clinicalHistoryHeader}>
              {header?.replace(":", "")}
            </Text>
            {content && (
              <Text style={styles.clinicalHistoryContent}>{content}</Text>
            )}
          </View>
        );

      case "technique":
        return (
          <View key={index} style={styles.techniqueSection}>
            <Text style={styles.techniqueHeader}>
              {header?.replace(":", "")}
            </Text>
            {content && <Text style={styles.techniqueContent}>{content}</Text>}
          </View>
        );

      case "findings":
        return (
          <View key={index} style={styles.findingsSection}>
            <Text style={styles.findingsHeader}>
              {header?.replace(":", "")}
            </Text>
            {content && <Text style={styles.findingsContent}>{content}</Text>}
          </View>
        );

      case "impression":
        return (
          <View key={index} style={styles.impressionSection}>
            <Text style={styles.impressionHeader}>
              {header?.replace(":", "")}
            </Text>
            {content && <Text style={styles.impressionContent}>{content}</Text>}
          </View>
        );

      default:
        return content ? (
          <Text key={index} style={styles.defaultSection}>
            {content}
          </Text>
        ) : null;
    }
  };

  // REMOVED: renderClinicalHistoryIfNeeded function since clinical history
  // should already be in the HTML content and we don't want duplicates

  // Function to extract and render study title from HTML content
  const renderStudyTitleIfExists = () => {
    const nodes = Array.from(tempElement.childNodes);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      let textContent = "";

      if (node.nodeType === Node.TEXT_NODE) {
        textContent = node.textContent?.trim() || "";
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        textContent = (node as HTMLElement).textContent?.trim() || "";
      }

      if (textContent && isStudyTitle(textContent)) {
        return (
          <Text key={`study-title-${i}`} style={styles.studyTitle}>
            {textContent}
          </Text>
        );
      }
    }
    return null;
  };

  // Function to render content excluding study titles (since they're rendered separately)
  const renderContentWithoutStudyTitles = () => {
    const nodes = Array.from(tempElement.childNodes);
    return nodes
      .map((node, i) => {
        let textContent = "";

        if (node.nodeType === Node.TEXT_NODE) {
          textContent = node.textContent?.trim() || "";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          textContent = (node as HTMLElement).textContent?.trim() || "";
        }

        // Skip rendering if this is a study title (it's rendered separately)
        if (textContent && isStudyTitle(textContent)) {
          return null;
        }

        return renderNode(node, i);
      })
      .filter(Boolean);
  };

  // Recursively render nodes as PDF components
  const renderNode = (node: Node, index: string | number): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent?.trim();
      if (!textContent) return null;

      const sectionData = parseSection(textContent);
      return renderSection(sectionData, index);
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const children = Array.from(element.childNodes);

      switch (element.tagName.toLowerCase()) {
        case "p": {
          const textContent = element.textContent?.trim() || "";
          if (!textContent) return null;

          const sectionData = parseSection(textContent);
          return renderSection(sectionData, index);
        }

        case "div": {
          // Handle div elements by processing their children
          return (
            <View key={index}>
              {children.map((child, i) => renderNode(child, `${index}-${i}`))}
            </View>
          );
        }

        case "b":
        case "strong":
          const strongText = element.textContent?.trim();
          if (!strongText) return null;

          // Check if the bold text is a study title or section header
          const strongSectionData = parseSection(strongText);
          if (strongSectionData.type !== "default") {
            return renderSection(strongSectionData, index);
          }

          return (
            <Text key={index} style={{ fontWeight: "bold", color: "#1f2937" }}>
              {strongText}
            </Text>
          );

        case "i":
        case "em":
          return (
            <Text key={index} style={{ fontStyle: "italic", color: "#4b5563" }}>
              {element.textContent}
            </Text>
          );

        case "u":
          return (
            <Text key={index} style={{ textDecoration: "underline" }}>
              {element.textContent}
            </Text>
          );

        case "ul":
          return (
            <View key={index} style={{ marginBottom: 12, marginTop: 8 }}>
              {Array.from(element.querySelectorAll("li")).map((li, i) => (
                <View key={`li-${i}`} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{li.textContent}</Text>
                </View>
              ))}
            </View>
          );

        case "ol":
          return (
            <View key={index} style={{ marginBottom: 12, marginTop: 8 }}>
              {Array.from(element.querySelectorAll("li")).map((li, i) => (
                <View key={`li-${i}`} style={styles.numberedPoint}>
                  <Text style={styles.number}>{i + 1}.</Text>
                  <Text style={styles.numberedText}>{li.textContent}</Text>
                </View>
              ))}
            </View>
          );

        case "hr":
          return <View key={index} style={styles.horizontalRule} />;

        case "br":
          return <Text key={index}>{"\n"}</Text>;

        default:
          // For other elements, just process their text content
          const textContent = element.textContent?.trim();
          if (textContent) {
            const sectionData = parseSection(textContent);
            return renderSection(sectionData, index);
          }
          return null;
      }
    }

    return null;
  };

  const nodes = Array.from(tempElement.childNodes);
  return (
    <View style={styles.contentContainer}>
      {/* Render study title first if it exists */}
      {renderStudyTitleIfExists()}
      {/* Render remaining content (including clinical history from HTML) */}
      {renderContentWithoutStudyTitles()}
    </View>
  );
};

export default HtmlToPdfComponents;
