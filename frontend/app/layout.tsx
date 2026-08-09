import type { Metadata } from "next";
import "./global.css";
export const metadata: Metadata = {
  title: "Webnest",
  description: "Own your space on the web.",
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
