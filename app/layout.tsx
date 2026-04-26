import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restauranty - Reservation Recovery",
  description:
    "Restaurant-controlled no-show prevention, verified waitlist refill, and deterministic recovery agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
