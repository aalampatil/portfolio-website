import "./globals.css";

export const metadata = {
  title: "Aalam Patil — The Way of the Craft",
  description: "Backend developer Aalam Patil’s Japanese-inspired portfolio. Explore projects and technical writing in Sakura, Samurai, or Moonlight themes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="sakura">
      <body>{children}</body>
    </html>
  );
}
