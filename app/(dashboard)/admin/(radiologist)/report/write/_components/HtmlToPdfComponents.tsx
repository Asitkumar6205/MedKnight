import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

interface HtmlToPdfComponentsProps {
  htmlContent: string;
}

const styles = StyleSheet.create({
  content: {
    fontSize: 8,
    lineHeight: 1.5,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 5,
  },
  bullet: {
    width: 10,
    fontSize: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    paddingRight: 5,
  },
  numberedPoint: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 5,
  },
  number: {
    width: 15,
    fontSize: 8,
  },
  numberedText: {
    flex: 1,
    fontSize: 8,
    paddingRight: 5,
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 5,
  },
  contentContainer: {
    marginHorizontal: 10,
  },
});

const HtmlToPdfComponents: React.FC<HtmlToPdfComponentsProps> = ({
  htmlContent,
}) => {
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

  // Recursively render nodes as PDF components
  const renderNode = (node: Node, index: string | number): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent ? (
        <Text key={index}>{node.textContent}</Text>
      ) : null;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const children = Array.from(element.childNodes).map((child, i) =>
        renderNode(child, `${index}-${i}`)
      );

      switch (element.tagName.toLowerCase()) {
        case "p":
          return (
            <Text key={index} style={styles.content}>
              {children}
            </Text>
          );
        case "b":
        case "strong":
          return (
            <Text key={index} style={{ fontWeight: "bold" }}>
              {children}
            </Text>
          );
        case "i":
        case "em":
          return (
            <Text key={index} style={{ fontStyle: "italic" }}>
              {children}
            </Text>
          );
        case "u":
          return (
            <Text key={index} style={{ textDecoration: "underline" }}>
              {children}
            </Text>
          );
        case "ul":
          return (
            <View key={index} style={{ marginBottom: 10, marginTop: 5 }}>
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
            <View key={index} style={{ marginBottom: 10, marginTop: 5 }}>
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
        default:
          return <View key={index}>{children}</View>;
      }
    }

    return null;
  };

  const nodes = Array.from(tempElement.childNodes);
  return (
    <View style={styles.contentContainer}>
      {nodes.map((node, i) => renderNode(node, i))}
    </View>
  );
};

export default HtmlToPdfComponents;