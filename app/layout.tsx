import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voxly – AI Sales Call Intelligence",
  description: "Upload your sales calls. Get instant AI coaching, talk ratios, objection tracking, and deal insights. Built for SMB sales teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-950 text-gray-100 antialiased" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
