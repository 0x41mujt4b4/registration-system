import { Roboto } from "next/font/google";
import { Theme } from '@radix-ui/themes';
import Navbar from "./components/Navbar";
import '@radix-ui/themes/styles.css';
import "./globals.css";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata = {
  title: "Registration System",
  description: "System to register students and manage courses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Theme hasBackground={false}>
        <Navbar />
        {children}
        </Theme>
      </body>
    </html>
  );
}
