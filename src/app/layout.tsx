import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { PitchProvider } from '@/context/PitchContext';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${ibmPlexArabic.variable}`}
    >
      <body>
        <PitchProvider>
          {children}
        </PitchProvider>
      </body>
    </html>
  );
}
