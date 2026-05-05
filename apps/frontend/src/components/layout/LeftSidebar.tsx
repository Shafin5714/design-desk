"use client";

import { MousePointer2, Type, Image as ImageIcon, Square, Circle, Loader2 } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { ToolType, RectNode, CircleNode, TextNode, ImageNode } from "@/types/canvas";
import { useRef, useState } from "react";
import api from "@/lib/axios";

const tools: { id: ToolType; icon: any; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text", icon: Type, label: "Text" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "image", icon: ImageIcon, label: "Image" },
];

export function LeftSidebar() {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const addNode = useEditorStore((state) => state.addNode);
  const pushHistory = useEditorStore((state) => state.pushHistory);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/assets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = response.data.url;
      
      pushHistory();
      addNode({
        id: crypto.randomUUID(),
        type: 'image',
        x: 350,
        y: 250,
        width: 300,
        height: 300,
        src: imageUrl,
      } as ImageNode);
      
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setActiveTool('select');
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleToolClick = (toolId: ToolType) => {
    if (toolId === 'image') {
      fileInputRef.current?.click();
      return;
    }

    if (toolId === 'select') {
      setActiveTool(toolId);
      return;
    }

    const baseProps = {
      id: crypto.randomUUID(),
      x: 350, // Roughly center of 800x600 canvas
      y: 250,
    };

    pushHistory();

    if (toolId === 'rectangle') {
      addNode({
        ...baseProps,
        type: 'rectangle',
        width: 100,
        height: 100,
        fill: '#cbd5e1', // slate-300
        cornerRadius: 8,
      } as RectNode);
    } else if (toolId === 'circle') {
      addNode({
        ...baseProps,
        type: 'circle',
        radius: 50,
        fill: '#cbd5e1',
      } as CircleNode);
    } else if (toolId === 'text') {
      addNode({
        ...baseProps,
        type: 'text',
        text: 'Add your text',
        fontSize: 32,
        fontFamily: 'Arial',
        fill: '#0f172a',
      } as TextNode);
    }
  };

  return (
    <aside className="w-16 flex-shrink-0 border-r border-border bg-card/80 backdrop-blur-md flex flex-col items-center py-4 gap-4 z-10 shadow-[1px_0_3px_0_rgba(0,0,0,0.02)]">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = tool.id === activeTool;
        const isImageUploading = tool.id === 'image' && isUploading;
        
        return (
          <button
            key={tool.id}
            title={tool.label}
            onClick={() => handleToolClick(tool.id)}
            disabled={isImageUploading}
            className={`p-3 rounded-xl transition-all duration-200 group relative ${
              isActive 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
            } ${isImageUploading ? "opacity-50 cursor-wait" : ""}`}
          >
            {isImageUploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            )}
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
              {isImageUploading ? 'Uploading...' : tool.label}
            </div>
          </button>
        );
      })}
    </aside>
  );
}
