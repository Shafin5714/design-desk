'use client';

import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { CanvasArea } from "@/components/layout/CanvasArea";
// import { useParams } from 'next/navigation';

export default function EditorPage() {
  // const params = useParams();
  // const projectId = params.id;
  
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
