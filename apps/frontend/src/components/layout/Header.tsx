import { Download, Redo2, Undo2 } from "lucide-react";

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 z-10 relative shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-sm">
          D
        </div>
        <span className="font-semibold text-sm tracking-tight hidden sm:inline-block">Design Desk</span>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-foreground/5 rounded-md transition-colors text-foreground/70 hover:text-foreground" title="Undo">
          <Undo2 size={18} />
        </button>
        <button className="p-2 hover:bg-foreground/5 rounded-md transition-colors text-foreground/70 hover:text-foreground" title="Redo">
          <Redo2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-sm font-medium hover:bg-foreground/5 px-3 py-1.5 rounded-md transition-colors">
          Share
        </button>
        <button className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-md flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
          <Download size={16} />
          Export
        </button>
      </div>
    </header>
  );
}
