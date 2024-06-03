import { Roboto } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import Navbar from "./components/Navbar";
import AuthProvider from "./components/AuthProvider";
import "@radix-ui/themes/styles.css";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  icons: {
    icon: '/vision_logo.png',
  },
  title: "Registration System",
  description: "System to register students and manage courses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthProvider>
          <Theme hasBackground={false}>
            <Navbar />
            {children}
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
