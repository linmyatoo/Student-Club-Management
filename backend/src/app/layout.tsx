import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Club Backend API",
  description: "Backend API for Student Club Management Platform",
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
