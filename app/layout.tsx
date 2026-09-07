import { Navbar } from "@/components/shared/Navbar";
import AppProvider from "@/providers/AppProvider";
import { CustomJwtPayload, getCurrentUser } from "@/service/auth.service";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixItNow",
  description: "Book the best home service technicians in your area.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getCurrentUser()) as CustomJwtPayload | null;

  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <AppProvider>
          <Navbar user={user} />
          <main className="min-h-screen">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
