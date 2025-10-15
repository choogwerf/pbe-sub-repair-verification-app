import './globals.css';
import React from 'react';

export const metadata = {
  title: 'PBE Sub Repair & Verification',
  description: 'Track repairs and verifications for CSS092, CSS068, CSS023 at T2D Precast Facility.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}