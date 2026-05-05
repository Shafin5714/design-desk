import { Download, Redo2, Undo2, Save, Loader2, Home } from "lucide-react";
import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import api from "@/lib/axios";
import Link from "next/link";

export function Header() {
  const [isSaving, setIsSaving] = useState(false);
  const projectId = useEditorStore(state => state.projectId);
  const nodes = useEditorStore(state => state.nodes);

  const handleSave = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      await api.put(`/projects/${projectId}`, { canvasNodes: nodes });
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 z-10 relative shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-foreground/5 rounded-md transition-colors text-foreground/70 hover:text-foreground" title="Back to Dashboard">
          <Home size={18} />
        </Link>
        <div className="w-px h-6 bg-border mx-1"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5e21d9] to-[#01b4e4] flex items-center justify-center text-white font-bold shadow-sm">
            D
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:inline-block">Design Desk</span>
        </div>
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
        <button 
          onClick={handleSave}
          disabled={isSaving || !projectId}
          className="text-sm font-medium hover:bg-foreground/5 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save
        </button>
        <button className="bg-gradient-to-r from-[#5e21d9] to-[#01b4e4] hover:opacity-90 text-white text-sm font-medium px-4 py-1.5 rounded-md flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
          <Download size={16} />
          Export
        </button>
      </div>
    </header>
  );
}
