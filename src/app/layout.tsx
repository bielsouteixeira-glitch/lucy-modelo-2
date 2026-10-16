import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { enhanceScript } from "@/lib/enhance";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucorrea-animalcare.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lu Corrêa Animal Care | Clínica Veterinária e Estética Animal",
    template: "%s | Lu Corrêa Animal Care",
  },
  description:
    "Atendimento veterinário e estética animal com carinho e atenção. Consultas presenciais e online, vacinas, exames, procedimentos, cirurgias, banho e tosa com Lucy Corrêa.",
  applicationName: "Lu Corrêa Animal Care",
  authors: [{ name: "Lu Corrêa Animal Care" }],
  creator: "Lu Corrêa Animal Care",
  keywords: [
    "clínica veterinária",
    "consultas veterinárias",
    "consulta veterinária online",
    "vacinação de cães e gatos",
    "exames veterinários",
    "cirurgia veterinária",
    "banho e tosa",
    "estética animal",
    "tosa da raça",
    "tosa higiênica",
    "Lu Corrêa Animal Care",
    "Lucy Corrêa",
  ],
  category: "Veterinary care",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Lu Corrêa Animal Care",
    title: "Lu Corrêa Animal Care | Clínica Veterinária e Estética Animal",
    description:
      "Cuidado que faz bem para quem faz parte da família. Atendimento veterinário e estética animal com Lucy Corrêa.",
    images: [
      {
        url: "/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lucy Corrêa cuidando de um cachorro na Lu Corrêa Animal Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lu Corrêa Animal Care | Clínica Veterinária e Estética Animal",
    description:
      "Atendimento veterinário e estética animal com carinho, atenção e cuidado em cada detalhe.",
    images: ["/assets/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#D81B60",
  width: "device-width",
  initialScale: 1,
};

/** Dados estruturados: apenas informações confirmadas pela profissional. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "VeterinaryCare",
  name: "Lu Corrêa Animal Care",
  description:
    "Clínica veterinária e estética animal. Consultas presenciais e online, vacinas, exames, procedimentos, cirurgias, banho e tosa.",
  url: siteUrl,
  image: `${siteUrl}/assets/images/og-image.jpg`,
  logo: `${siteUrl}/assets/logo/lu-correa-animal-care-logo.png`,
  telephone: "+5511911879750",
  priceRange: "$$",
  sameAs: ["https://www.instagram.com/lucorrea_animalcare"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "15:00",
    },
  ],
  employee: {
    "@type": "Person",
    name: "Lucy Corrêa",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Realce progressivo independente do bundle: ver src/lib/enhance.ts */}
        <script dangerouslySetInnerHTML={{ __html: enhanceScript }} />
      </head>
      <body className="bg-brand-bg text-brand-text antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Ir para o conteúdo
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
