import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "VK Old App",
  description: "VK приложение в стиле 2013",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Script src="https://unpkg.com/@vkontakte/vk-id-sdk/dist/index.js" />
        {children}
      </body>
    </html>
  );
}