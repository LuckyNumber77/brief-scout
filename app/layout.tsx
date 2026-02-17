import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brief Scout - AI-Powered Player Scouting",
  description: "Get AI-powered insights on football players and upcoming matches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen">
        {children}
      </body>
    </html>
  );
}
