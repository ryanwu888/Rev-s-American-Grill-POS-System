import type { Metadata } from "next";
import "./globals.css";

import {inter} from "./fonts";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Rev's American Grill POS",
  description: 'Created for CSCE 331 Project 3.',
  generator: 'Next.js',
  applicationName: 'RevsGrillPOS',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'Typescript', 'POS', 'restraunt'],
  authors: [{ name: 'Ryan Kabir', url: 'https://ryankbr.me' }, { name: 'Zach Huang' }],
  // colorScheme: 'dark',
  creator: 'Ryan Kabir',
  publisher: 'Ryan Kabir',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Rev's American Grill POS",
    description: 'Created for CSCE 331 Project 3.',
    url: 'https://project-3-full-stack-agile-web-project-3-904-01-delta.vercel.app/',
    siteName: 'RevsGrillPOS',
    images: [
      {
        url: 'https://project-3-full-stack-agile-web-project-3-904-01-delta.vercel.app/favicon-32x32.png',
        width: 800,
        height: 800,
      },
      {
        url: 'https://project-3-full-stack-agile-web-project-3-904-01-delta.vercel.app/icon.png',
        width: 800,
        height: 800,
        alt: 'My custom alt',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.png' }],
    shortcut: ['/shortcut-icon.png'],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
 }: {
  children: React.ReactNode;
 }) {
  return (
     <html lang="en">
       <body>
         <Providers>{children}</Providers>
       </body>
     </html>
  );
 }
