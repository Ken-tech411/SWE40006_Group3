import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "sonner"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Coffee Management System",
  description: "Complete Trung Nguyên Legend coffee management solution",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ScrollToTop /> {/* ✅ Client logic tách riêng */}
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-white">{children}</main>
          </div>
        </AuthProvider>

        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
