import { MousePointer2, Type, Image as ImageIcon, Square, Circle } from "lucide-react";

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text", icon: Type, label: "Text" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "image", icon: ImageIcon, label: "Image" },
];

export function LeftSidebar() {
  return (
    <aside className="w-16 flex-shrink-0 border-r border-border bg-card/80 backdrop-blur-md flex flex-col items-center py-4 gap-4 z-10 shadow-[1px_0_3px_0_rgba(0,0,0,0.02)]">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = tool.id === "select"; // Mock active state
        return (
          <button
            key={tool.id}
            title={tool.label}
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
