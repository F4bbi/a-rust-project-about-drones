import { MousePointer, Plus } from 'lucide-react'
import React from 'react'

type Tool = 'cursor' | 'plus';

interface ToolBarProps {
  activeTool: Tool | null;
  setActiveTool: (tool: Tool) => void;
}

const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: 'cursor', icon: MousePointer, label: 'Move' },
  { id: 'plus', icon: Plus, label: 'Add Node' },
]

const ToolBar: React.FC<ToolBarProps> = ({ activeTool, setActiveTool }) => {
  return (
    <div className="flex flex-col items-center justify-start pt-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 mb-8 transition-all duration-300">
        <div className="flex items-center space-x-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`
                relative p-3 rounded-xl transition-all duration-200 group
                ${activeTool === tool.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }
              `}
              title={tool.label}
            >
              <tool.icon className="h-5 w-5" />

              {activeTool === tool.id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}

              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                  {tool.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ToolBar