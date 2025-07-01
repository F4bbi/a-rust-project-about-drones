import { create } from 'zustand';

export type Tool = 'cursor' | 'plus' | 'delete' | 'message';
export type NodeType = 'drone' | 'client' | 'server';

interface ToolbarState {
  activeTool: Tool | null;
  selectedNodeType: NodeType | null;
  setActiveTool: (tool: Tool) => void;
  setSelectedNodeType: (nodeType: NodeType | null) => void;
  resetToolbar: () => void;
}

export const useToolbarStore = create<ToolbarState>((set) => ({
  activeTool: 'cursor', // Default to cursor tool
  selectedNodeType: null,
  setActiveTool: (tool: Tool) => set((state) => ({
    activeTool: tool,
    // Reset selectedNodeType when switching away from 'plus' tool
    selectedNodeType: tool === 'plus' ? state.selectedNodeType : null
  })),
  setSelectedNodeType: (nodeType: NodeType | null) => set({ selectedNodeType: nodeType }),
  resetToolbar: () => set({ activeTool: 'cursor', selectedNodeType: null }),
}));
