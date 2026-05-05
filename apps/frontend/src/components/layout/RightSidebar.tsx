"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { CanvasNode } from "@/types/canvas";
import { Trash2, BringToFront, SendToBack, ArrowUp, ArrowDown } from "lucide-react";

export function RightSidebar() {
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const nodes = useEditorStore((state) => state.nodes);
  const updateNode = useEditorStore((state) => state.updateNode);
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const bringForward = useEditorStore((state) => state.bringForward);
  const sendBackward = useEditorStore((state) => state.sendBackward);
  const bringToFront = useEditorStore((state) => state.bringToFront);
  const sendToBack = useEditorStore((state) => state.sendToBack);
  const pushHistory = useEditorStore((state) => state.pushHistory);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleChange = (key: keyof CanvasNode | string, value: any) => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, { [key]: value });
    }
  };

  const handleDelete = () => {
    if (selectedNodeId) {
      pushHistory();
      deleteNode(selectedNodeId);
    }
  };

  if (!selectedNode) {
    return (
      <aside className="w-72 flex-shrink-0 border-l border-border bg-card/80 backdrop-blur-md flex flex-col z-10 shadow-[-1px_0_3px_0_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold tracking-tight">Properties</h3>
        </div>
        <div className="p-4 flex-1 flex flex-col items-center justify-center text-foreground/40 text-sm gap-3">
          <p>Select an element to edit</p>
          <div className="w-12 h-1 bg-border rounded-full" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 flex-shrink-0 border-l border-border bg-card/80 backdrop-blur-md flex flex-col z-10 shadow-[-1px_0_3px_0_rgba(0,0,0,0.02)] h-[calc(100vh-56px)] overflow-y-auto">
      <div className="p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur z-20 flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-tight capitalize">{selectedNode.type}</h3>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
          title="Delete Element"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col gap-6">
        
        {/* COMMON PROPERTIES */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Position & Size</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground/70">X</label>
              <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                type="number" 
                value={Math.round(selectedNode.x)} 
                onChange={(e) => handleChange('x', parseFloat(e.target.value) || 0)}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground/70">Y</label>
              <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                type="number" 
                value={Math.round(selectedNode.y)} 
                onChange={(e) => handleChange('y', parseFloat(e.target.value) || 0)}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {('width' in selectedNode) && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/70">Width</label>
                <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                  type="number" 
                  value={Math.round((selectedNode as any).width)} 
                  onChange={(e) => handleChange('width', Math.max(5, parseFloat(e.target.value) || 5))}
                  className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
            {('height' in selectedNode) && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/70">Height</label>
                <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                  type="number" 
                  value={Math.round((selectedNode as any).height)} 
                  onChange={(e) => handleChange('height', Math.max(5, parseFloat(e.target.value) || 5))}
                  className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
            {('radius' in selectedNode) && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/70">Radius</label>
                <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                  type="number" 
                  value={Math.round((selectedNode as any).radius)} 
                  onChange={(e) => handleChange('radius', Math.max(5, parseFloat(e.target.value) || 5))}
                  className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-foreground/70">Rotation (°)</label>
            <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
              type="number" 
              value={Math.round(selectedNode.rotation || 0)} 
              onChange={(e) => handleChange('rotation', parseFloat(e.target.value) || 0)}
              className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            <label className="text-xs text-foreground/70">Layer Order</label>
            <div className="flex items-center gap-2">
              <button onClick={() => { pushHistory(); bringToFront(selectedNode.id); }} className="p-1.5 bg-background border border-border rounded hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground" title="Bring to Front"><BringToFront size={16} /></button>
              <button onClick={() => { pushHistory(); bringForward(selectedNode.id); }} className="p-1.5 bg-background border border-border rounded hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground" title="Bring Forward"><ArrowUp size={16} /></button>
              <button onClick={() => { pushHistory(); sendBackward(selectedNode.id); }} className="p-1.5 bg-background border border-border rounded hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground" title="Send Backward"><ArrowDown size={16} /></button>
              <button onClick={() => { pushHistory(); sendToBack(selectedNode.id); }} className="p-1.5 bg-background border border-border rounded hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground" title="Send to Back"><SendToBack size={16} /></button>
            </div>
          </div>
        </div>

        {/* TEXT PROPERTIES */}
        {selectedNode.type === 'text' && (
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Typography</h4>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground/70">Content</label>
              <textarea onFocus={() => pushHistory()} 
                value={(selectedNode as any).text} 
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/70">Font Size</label>
                <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                  type="number" 
                  value={Math.round((selectedNode as any).fontSize)} 
                  onChange={(e) => handleChange('fontSize', Math.max(8, parseFloat(e.target.value) || 8))}
                  className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/70">Color</label>
                <div className="flex h-8 w-full overflow-hidden rounded-md border border-border">
                  <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                    type="color" 
                    value={(selectedNode as any).fill} 
                    onChange={(e) => handleChange('fill', e.target.value)}
                    className="h-10 w-full cursor-pointer border-0 p-0 -mt-1 -ml-1 scale-150"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SHAPE PROPERTIES */}
        {(selectedNode.type === 'rectangle' || selectedNode.type === 'circle') && (
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Appearance</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/70">Fill Color</label>
                <div className="flex h-8 w-full overflow-hidden rounded-md border border-border">
                  <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                    type="color" 
                    value={(selectedNode as any).fill} 
                    onChange={(e) => handleChange('fill', e.target.value)}
                    className="h-10 w-full cursor-pointer border-0 p-0 -mt-1 -ml-1 scale-150"
                  />
                </div>
              </div>
            </div>

            {selectedNode.type === 'rectangle' && (
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-foreground/70">Corner Radius</label>
                  <span className="text-xs text-foreground/50">{(selectedNode as any).cornerRadius || 0}px</span>
                </div>
                <input onFocus={() => pushHistory()} onPointerDown={() => pushHistory()} 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={(selectedNode as any).cornerRadius || 0} 
                  onChange={(e) => handleChange('cornerRadius', parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
