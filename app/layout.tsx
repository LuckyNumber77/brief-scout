import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brief Scout - AI-Powered Football Scouting",
  description: "Get AI-powered player recommendations and match insights for your favorite teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
