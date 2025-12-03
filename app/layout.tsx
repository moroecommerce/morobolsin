import { Inter } from "next/font/google";
import "./globals.css";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ждёте малыша? Я помогу!",
  description: "Nora — искусственный интеллект помощник для беременных.",
  icons: {
    icon: "/banner.webp", // фавикон из public/banner.webp
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {assistantId ? children : <Warnings />}
        <img className="logo" src="/banner.webp" alt="Nora AI Logo" />
      </body>
    </html>
  );
}