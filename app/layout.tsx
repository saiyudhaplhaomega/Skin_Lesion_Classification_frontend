import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Skin Lesion XAI",
  description: "Explainable skin lesion classification frontend",
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
