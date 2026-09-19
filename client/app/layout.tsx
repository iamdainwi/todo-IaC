import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

/* Single typeface. Weight variation does all the hierarchy work. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tasks",
  description: "Capture tasks. Clear them. Repeat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased dark", mono.variable, "font-mono")}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
