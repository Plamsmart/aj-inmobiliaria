import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://aj-inmobiliaria.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AJ Inmobiliaria · Pisos en venta en Irun y Hondarribia",
    template: "%s · AJ Inmobiliaria",
  },
  description:
    "Especialistas en compraventa de viviendas en Irun, Hondarribia y la comarca del Bidasoa. Encuentra tu próximo hogar con Jon y Aroa.",
  keywords: [
    "inmobiliaria Irun",
    "pisos en venta Irun",
    "comprar piso Irun",
    "inmobiliaria Hondarribia",
    "vivienda Bidasoa",
    "AJ Inmobiliaria",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AJ Inmobiliaria · Pisos en venta en Irun y Hondarribia",
    description:
      "Especialistas en compraventa de viviendas en Irun, Hondarribia y la comarca del Bidasoa. Encuentra tu próximo hogar con Jon y Aroa.",
    url: BASE_URL,
    siteName: "AJ Inmobiliaria",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "AJ Inmobiliaria — Pisos en venta en Irun y Hondarribia",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AJ Inmobiliaria · Pisos en venta en Irun y Hondarribia",
    description:
      "Especialistas en compraventa de viviendas en Irun, Hondarribia y la comarca del Bidasoa.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSerifDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
