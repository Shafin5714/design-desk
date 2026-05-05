'use client';

import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { CanvasArea } from "@/components/layout/CanvasArea";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useEditorStore } from "@/store/useEditorStore";
import { Loader2 } from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const setProjectId = useEditorStore(state => state.setProjectId);
  const setNodes = useEditorStore(state => state.setNodes);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProjectId(projectId);
        setNodes(response.data.canvasNodes || []);
      } catch (error) {
        console.error("Failed to load project:", error);
        alert("Failed to load project or project not found.");
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();

    // Cleanup when leaving the editor
    return () => {
      setProjectId(null);
      setNodes([]);
    };
  }, [projectId, setProjectId, setNodes, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p className="font-medium">Loading design...</p>
        </div>
      </div>
    );
  }

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
