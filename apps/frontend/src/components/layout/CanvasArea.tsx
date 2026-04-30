"use client";

import dynamic from 'next/dynamic';

// Dynamically import the Konva canvas with SSR disabled
const KonvaCanvas = dynamic(() => import('@/components/canvas/KonvaCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-[800px] h-[600px] bg-white shadow-2xl rounded-sm ring-1 ring-black/5 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm font-medium">Loading Canvas Engine...</p>
      </div>
    </div>
  )
});

export function CanvasArea() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden flex items-center justify-center">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-foreground) 1.5px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Interactive Canvas Container */}
      <div className="relative z-0 flex items-center justify-center transition-transform">
        <KonvaCanvas />
      </div>
      
      {/* Zoom controls mockup */}
      <div className="absolute bottom-6 right-6 bg-card border border-border rounded-full px-4 py-2 shadow-lg text-xs font-medium text-foreground/80 flex items-center gap-4 z-10 backdrop-blur-md bg-card/90">
        <button className="hover:text-foreground transition-colors p-1">-</button>
        <span className="w-10 text-center">100%</span>
        <button className="hover:text-foreground transition-colors p-1">+</button>
      </div>
    </main>
  );
}
