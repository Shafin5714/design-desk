'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from "@/store/useAuthStore";
import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { CanvasArea } from "@/components/layout/CanvasArea";
import { LandingPage } from "@/components/landing/LandingPage";

export default function RootPage() {
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // Show beautiful landing page if not logged in
  if (!user) {
    return <LandingPage />;
  }

  // Show the editor if logged in
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <CanvasArea />
        <RightSidebar />
      </div>
    </div>
  );
}
