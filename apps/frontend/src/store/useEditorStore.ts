import { create } from 'zustand';
import { CanvasNode, ToolType } from '@/types/canvas';

interface EditorState {
  // State
  nodes: CanvasNode[];
  selectedNodeId: string | null;
  activeTool: ToolType;
  zoom: number;
  projectId: string | null;
  stageRef: any | null;

  // Actions
  setNodes: (nodes: CanvasNode[]) => void;
  addNode: (node: CanvasNode) => void;
  updateNode: (id: string, updates: Partial<CanvasNode>) => void;
  deleteNode: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setActiveTool: (tool: ToolType) => void;
  setZoom: (zoom: number) => void;
  setProjectId: (id: string | null) => void;
  setStageRef: (ref: any) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  nodes: [],
  selectedNodeId: null,
  activeTool: 'select',
  zoom: 100,
  projectId: null,
  stageRef: null,

  setNodes: (nodes) => set({ nodes }),
  
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node],
    selectedNodeId: node.id, // Automatically select the newly added node
    activeTool: 'select' // Revert to select tool after adding
  })),
  
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.id === id ? { ...node, ...updates } as CanvasNode : node
    )
  })),
  
  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== id),
    selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
  })),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  
  setActiveTool: (tool) => set((state) => ({ 
    activeTool: tool, 
    // Clear selection when switching to drawing tools to avoid moving elements accidentally
    selectedNodeId: tool === 'select' ? state.selectedNodeId : null 
  })),
  
  setZoom: (zoom) => set({ zoom }),
  setProjectId: (id) => set({ projectId: id }),
  setStageRef: (ref) => set({ stageRef: ref }),
}));
