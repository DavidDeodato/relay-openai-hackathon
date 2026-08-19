import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${protocol}://${host}/og.png`;
  return {
    title: "Relay — contexto que vira ação",
    description: "Conecte o que sua empresa sabe ao que ela precisa fazer.",
    icons: { icon: "/brand/relay-icon.svg", shortcut: "/brand/relay-icon.svg" },
    openGraph: { title: "Relay — contexto que vira ação", description: "Três fontes, um estado operacional e o próximo passo com lastro.", images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: "Relay — contexto que vira ação", description: "Três fontes, um estado operacional e o próximo passo com lastro.", images: [ogImage] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
