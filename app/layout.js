import { Inter } from "next/font/google";
import { Theme } from '@radix-ui/themes';
import Navbar from "./components/Navbar";
import '@radix-ui/themes/styles.css';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Registration System",
  description: "System to register students and manage courses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme hasBackground={false}>
        <Navbar />
        {children}
        </Theme>
      </body>
    </html>
  );
}
