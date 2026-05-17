import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "منصة روشتة - رعايتك الصحية بضغطة زر",
  description: "احجز موعدك الطبي فوراً برقم هاتفك، تابع ملفك الصحي، واستلم روشتاتك الطبية الرقمية من طبيبك مباشرة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-cairo bg-background text-slate-800">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}