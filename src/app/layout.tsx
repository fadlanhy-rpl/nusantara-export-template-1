import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PitchProvider } from '@/context/PitchContext';

export const metadata: Metadata = {
  title: 'NusantaraOrigin — Direct Indonesian Commodity & Coconut Charcoal Bulk Export',
  description: 'Direct manufacturer and bulk exporter of premium coconut charcoal briquettes, specialty green coffee, and Indonesian spices. Lab-tested every batch, loaded at Tanjung Perak in 14-21 days.',
  keywords: 'coconut charcoal briquettes, shisha charcoal, hookah coal indonesia, sumatra coffee beans, cloves export indonesia, hs code 44029010',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B0B0C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PitchProvider>
          {children}
        </PitchProvider>
      </body>
    </html>
  );
}
