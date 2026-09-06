import React from 'react';
import './globals.css';

export const metadata = {
  title: 'TikTok Analytics & AI Coach',
  description: 'Track and analyze TikTok performance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
