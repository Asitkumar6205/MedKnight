import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
// import { ActiveCaseProvider } from "./context/ActiveCaseContext";
// import { CompletedCaseProvider } from "./context/CompletedCaseContext";

const mulish = Mulish({
  variable: "--font-muli",
  weight: ["400", "500", "700", "900", "1000"], // Choose the weights you need
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedKnight",
  icons: {
    icon: {
      url: "/favicon.ico",
      sizes: "64x64", // Current size (example)
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        {/* <CompletedCaseProvider>
          <ActiveCaseProvider> */}
          <body
            className={`${mulish.variable} ${mulish.variable} antialiased bg-stone-900`}
          >
            {children}
          </body>
        {/* </ActiveCaseProvider>
        </CompletedCaseProvider> */}
      </Provider>
    </html>
  );
}
