import type { Metadata } from "next";
import "../globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "IRCTC Clone",
  description: "Basic scaffold for an IRCTC-like app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto flex-1 p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
