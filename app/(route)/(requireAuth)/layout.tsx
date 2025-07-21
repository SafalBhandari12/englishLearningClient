import AuthGuard from "@/components/AuthGuard";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthGuard requireAuth={true}> {children}</AuthGuard>
    </>
  );
}
