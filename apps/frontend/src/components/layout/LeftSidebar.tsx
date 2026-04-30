"use client";

import { MousePointer2, Type, Image as ImageIcon, Square, Circle } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { ToolType, RectNode, CircleNode, TextNode } from "@/types/canvas";

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

  const handleToolClick = (toolId: ToolType) => {
    if (toolId === 'select' || toolId === 'image') {
      setActiveTool(toolId);
      return;
    }

    const baseProps = {
      id: crypto.randomUUID(),
      x: 350, // Roughly center of 800x600 canvas
      y: 250,
    };

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
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = tool.id === activeTool;
        return (
          <button
            key={tool.id}
            title={tool.label}
            onClick={() => handleToolClick(tool.id)}
            className={`p-3 rounded-xl transition-all duration-200 group relative ${
              isActive 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
              {tool.label}
            </div>
          </button>
        );
      })}
    </aside>
  );
}
