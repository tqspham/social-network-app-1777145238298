import type { Metadata } from "next";
import "@/app/globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Social Feed",
  description: "A simple social media feed application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <div className="min-h-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
