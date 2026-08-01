import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-next",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-next",
  display: "swap",
});

const siteUrl = "https://abhishekkumart.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Abhishek Kumar T | Full Stack Developer",
    template: "%s | Abhishek Kumar T",
  },
  description:
    "Full Stack Developer building scalable web applications with Python, React, and modern backend technologies. Open to software engineering opportunities.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Abhishek Kumar T | Full Stack Developer",
    description:
      "Full Stack Developer building scalable web applications with Python, React, and modern backend technologies.",
    url: siteUrl,
    siteName: "Abhishek Kumar T",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek Kumar T | Full Stack Developer",
    description:
      "Full Stack Developer building scalable web applications with Python, React, and modern backend technologies.",
    creator: "@abhisheksharma611",
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/Avatar.webp",
    apple: "/Avatar.webp",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abhishek Kumar T",
  givenName: "Abhishek",
  familyName: "Kumar T",
  jobTitle: "Full Stack Developer",
  url: siteUrl,
  sameAs: [
    "https://github.com/abhisheksharma611",
    "https://www.linkedin.com/in/abhisheksharma611/",
  ],
  knowsAbout: [
    "Python",
    "React",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "SQL",
    "Flask",
    "Next.js",
    "Java",
    "Spring",
    "Git",
    "REST APIs",
    "Data Structures",
    "Algorithms",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${firaCode.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#2d2d2d" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-terminal text-gray-200 font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
