import React, { useState } from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import Image from 'next/image';
import { AuthModal } from '@/components/auth/AuthModal';

export function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  const openAuthModal = (type: 'login' | 'register') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-gradient-to-br from-[#5e21d9] via-[#8d2de2] to-[#01b4e4] text-white overflow-x-hidden relative">
      
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 md:px-12 z-10 relative">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <Layers className="w-8 h-8 text-white" />
            <span className="font-bold text-2xl tracking-tight text-white">
              Design Desk
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-white/90">
            <Link href="#" className="hover:text-white transition-colors">Design</Link>
            <Link href="#" className="hover:text-white transition-colors">Product</Link>
            <Link href="#" className="hover:text-white transition-colors">Plans</Link>
            <Link href="#" className="hover:text-white transition-colors">Business</Link>
            <Link href="#" className="hover:text-white transition-colors">Education</Link>
            <Link href="#" className="hover:text-white transition-colors">Help</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => openAuthModal('login')}
            className="hidden md:inline-block font-medium text-sm text-white hover:text-white/80 transition-colors"
          >
            Log in
          </button>
          <button 
            onClick={() => openAuthModal('register')}
            className="bg-white text-indigo-900 font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-16 md:pt-24 px-4 text-center z-10 relative">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto drop-shadow-sm mb-6">
          What will you design today?
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-medium drop-shadow-sm">
          Make AI-powered social posts, videos, presentations, and more with Design Desk.
        </p>
        
        <button 
          onClick={() => openAuthModal('register')}
          className="bg-white text-indigo-900 font-bold text-base px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95 mb-16"
        >
          Start designing for free
        </button>

        {/* Hero Mockup Image */}
        <div className="w-full max-w-5xl px-4 mx-auto pb-20">
          <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-white/20 transform transition-transform hover:-translate-y-2 duration-500 bg-white/5 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 mix-blend-overlay"></div>
            <Image 
              src="/images/hero-mockup.png" 
              alt="Design Desk Editor Interface" 
              width={1200} 
              height={800}
              className="w-full h-auto object-cover border border-white/10 rounded-2xl md:rounded-[32px]"
              priority
            />
          </div>
        </div>
      </main>
      
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[120px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-300/20 blur-[150px]"></div>
      </div>

      <AuthModal 
        initialType={authType} 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
