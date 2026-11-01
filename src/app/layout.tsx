import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Aalam Patil — Software Developer",
  description: "Aalam Patil turns ideas into working software. Explore web apps, APIs, authentication projects, and technical writing.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="ink" data-mode="dark">
      <body>{children}</body>
    </html>
  );
}
