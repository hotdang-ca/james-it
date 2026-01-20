import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://james-it.vercel.app'),
  title: {
    default: "James-It | Your Personal Concierge",
    template: "%s | James-It"
  },
  description: "Professional courier, rides, and administrative services in Winnipeg. Reliable, distinct, and trustworthy.",
  keywords: ["Personal Concierge", "Winnipeg", "Courier", "Rides", "Admin Services", "James-It", "Personal Shopper", "Tech Support"],
  openGraph: {
    title: "James-It | Your Personal Concierge",
    description: "Professional courier, rides, and administrative services in Winnipeg. Reliable, distinct, and trustworthy.",
    url: 'https://james-it.vercel.app',
    siteName: 'James-It',
    locale: 'en_CA',
    type: 'website',
    images: [
      {
        url: '/assets/james.jpg',
        width: 1200,
        height: 630,
        alt: 'James - James-It Personal Concierge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "James-It | Your Personal Concierge",
    description: "Professional courier, rides, and administrative services in Winnipeg.",
    images: ['/assets/james.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
