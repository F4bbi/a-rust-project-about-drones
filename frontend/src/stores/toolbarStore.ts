import { create } from 'zustand';

export type Tool = 'cursor' | 'plus' | 'delete' | 'message';
export type NodeType = 'drone' | 'client' | 'server';

interface NodeData {
  name: string;
  type: NodeType;
  image: string;
}

interface ToolbarState {
  activeTool: Tool | null;
  selectedNodeType: NodeType | null;
  selectedSpecificNode: NodeData | null;
  availableNodes: NodeData[];
  setActiveTool: (tool: Tool) => void;
  setSelectedNodeType: (nodeType: NodeType | null) => void;
  setSelectedSpecificNode: (node: NodeData | null) => void;
  setAvailableNodes: (nodes: NodeData[]) => void;
  resetToolbar: () => void;
}

export const useToolbarStore = create<ToolbarState>((set) => ({
  activeTool: 'cursor', // Default to cursor tool
  selectedNodeType: null,
  selectedSpecificNode: null,
  availableNodes: [],
  setActiveTool: (tool: Tool) => set((state) => ({
    activeTool: tool,
    // Reset selections when switching away from 'plus' tool
    selectedNodeType: tool === 'plus' ? state.selectedNodeType : null,
    selectedSpecificNode: tool === 'plus' ? state.selectedSpecificNode : null
  })),
  setSelectedNodeType: (nodeType: NodeType | null) => set({
    selectedNodeType: nodeType,
    selectedSpecificNode: null // Reset specific node when changing type
  }),
  setSelectedSpecificNode: (node: NodeData | null) => set({ selectedSpecificNode: node }),
  setAvailableNodes: (nodes: NodeData[]) => set({ availableNodes: nodes }),
  resetToolbar: () => set({ 
    activeTool: 'cursor', 
    selectedNodeType: null, 
    selectedSpecificNode: null 
  }),
}));
