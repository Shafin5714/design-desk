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
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
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

  bringForward: (id) => set((state) => {
    const index = state.nodes.findIndex(n => n.id === id);
    if (index === -1 || index === state.nodes.length - 1) return state;
    const newNodes = [...state.nodes];
    const temp = newNodes[index];
    newNodes[index] = newNodes[index + 1];
    newNodes[index + 1] = temp;
    return { nodes: newNodes };
  }),
  
  sendBackward: (id) => set((state) => {
    const index = state.nodes.findIndex(n => n.id === id);
    if (index <= 0) return state;
    const newNodes = [...state.nodes];
    const temp = newNodes[index];
    newNodes[index] = newNodes[index - 1];
    newNodes[index - 1] = temp;
    return { nodes: newNodes };
  }),
  
  bringToFront: (id) => set((state) => {
    const index = state.nodes.findIndex(n => n.id === id);
    if (index === -1 || index === state.nodes.length - 1) return state;
    const newNodes = [...state.nodes];
    const [node] = newNodes.splice(index, 1);
    newNodes.push(node);
    return { nodes: newNodes };
  }),
  
  sendToBack: (id) => set((state) => {
    const index = state.nodes.findIndex(n => n.id === id);
    if (index <= 0) return state;
    const newNodes = [...state.nodes];
    const [node] = newNodes.splice(index, 1);
    newNodes.unshift(node);
    return { nodes: newNodes };
  }),
}));
