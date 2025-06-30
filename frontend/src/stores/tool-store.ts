import { create } from 'zustand';

type Tool = 'cursor' | 'plus' | null;

interface ToolState {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  toolRef: React.RefObject<Tool>;
  setToolRef: (ref: React.RefObject<Tool>) => void;
}

export const ToolStore = create<ToolState>((set) => {
  const defaultRef = { current: 'cursor' as Tool };

  return {
    activeTool: 'cursor',
    toolRef: defaultRef,
    setActiveTool: (tool) => set(() => ({ activeTool: tool })),
    setToolRef: (ref) => set(() => ({ toolRef: ref })),
  };
});
