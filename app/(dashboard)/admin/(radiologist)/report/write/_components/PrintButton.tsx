import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintButton() {
  const handlePrint = () => {
    const printableContent = document.getElementById("printable-content");
    if (!printableContent) return;

    // Create a new window to print only the selected content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            ${printableContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <Button variant="outline" className="text-md px-8" onClick={handlePrint}>
      <Printer className="mr-2" /> Print Report
    </Button>
  );
}
