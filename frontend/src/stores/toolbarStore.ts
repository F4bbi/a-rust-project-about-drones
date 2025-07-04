import { create } from 'zustand';

export type Tool = 'cursor' | 'plus' | 'message';
export type NodeType = 'drone' | 'client' | 'server' | 'edge';

interface NodeData {
  name: string;
  type: NodeType;
  image: string;
}

interface CreatedNode {
  id: number;
  type: NodeType;
  name: string;
  position?: { x: number; y: number };
}

interface ToolbarState {
  activeTool: Tool | null;
  selectedNodeType: NodeType | null;
  selectedSpecificNode: NodeData | null;
  availableNodes: NodeData[];
  createdNodes: CreatedNode[];
  
  // Message-related state
  selectedMessageType: string | null;
  messageFormData: any;
  isSelectingNodes: boolean;
  selectedFromNode: string | null;
  
  setActiveTool: (tool: Tool) => void;
  setSelectedNodeType: (nodeType: NodeType | null) => void;
  setSelectedSpecificNode: (node: NodeData | null) => void;
  setAvailableNodes: (nodes: NodeData[]) => void;
  addCreatedNode: (node: CreatedNode) => void;
  resetToolbar: () => void;
  
  // Message-related actions
  setSelectedMessageType: (messageType: string | null) => void;
  setMessageFormData: (data: any) => void;
  setIsSelectingNodes: (selecting: boolean) => void;
  setSelectedFromNode: (nodeId: string | null) => void;
  resetMessageState: () => void;
}

export const useToolbarStore = create<ToolbarState>((set) => ({
  activeTool: 'cursor', // Default to cursor tool
  selectedNodeType: null,
  selectedSpecificNode: null,
  availableNodes: [],
  createdNodes: [],
  
  // Message-related state
  selectedMessageType: null,
  messageFormData: {},
  isSelectingNodes: false,
  selectedFromNode: null,
  
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
  addCreatedNode: (node: CreatedNode) => set((state) => ({ createdNodes: [...state.createdNodes, node] })),
  resetToolbar: () => set({ 
    activeTool: 'cursor',
    selectedNodeType: null, 
    selectedSpecificNode: null 
  }),
  
  // Message-related actions
  setSelectedMessageType: (messageType: string | null) => set({ selectedMessageType: messageType }),
  setMessageFormData: (data: any) => set({ messageFormData: data }),
  setIsSelectingNodes: (selecting: boolean) => set({ isSelectingNodes: selecting }),
  setSelectedFromNode: (nodeId: string | null) => set({ selectedFromNode: nodeId }),
  resetMessageState: () => set({
    selectedMessageType: null,
    messageFormData: {},
    isSelectingNodes: false,
    selectedFromNode: null
  })
}));
