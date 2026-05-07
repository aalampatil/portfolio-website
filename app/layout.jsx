import "./globals.css";

export const metadata = {
  title: "Aalam Patil API Docs",
  description: "Portfolio and developer profile for Aalam Patil.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
