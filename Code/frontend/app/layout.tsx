import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather Station Data Dashboard",
  description: "Weather Station Data Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
