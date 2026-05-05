'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from "@/store/useAuthStore";
import { LandingPage } from "@/components/landing/LandingPage";
import { Dashboard } from "@/components/dashboard/Dashboard";

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

  // Show the Dashboard if logged in
  return <Dashboard />;
}
