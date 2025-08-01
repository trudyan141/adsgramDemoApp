import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import MainLayout from "@/components/mainLayout/mainLayout.component";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Apps Network",
  description: "Apps Network",
  viewport: {
    width: "device-width",
    height: "device-height",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <ReactQueryClientProvider >
    <html lang={locale}>
        <body className={inter.className} suppressHydrationWarning={true}>
          <NextIntlClientProvider messages={messages}>
            <AntdRegistry> 
              <MainLayout>{children}</MainLayout>
            </AntdRegistry>
          </NextIntlClientProvider>
      </body>
      </html>
      </ReactQueryClientProvider>
  );
}
