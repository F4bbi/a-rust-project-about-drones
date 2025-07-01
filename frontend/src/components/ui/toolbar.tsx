import { MousePointer, Plus, MailPlus, CircleX, Drone, Laptop, Database } from 'lucide-react'
import React from 'react'
import { useToolbarStore, type Tool } from '../../stores/toolbarStore'

const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: 'cursor', icon: MousePointer, label: 'Move' },
  { id: 'plus', icon: Plus, label: 'Add Node' },
  { id: 'delete', icon: CircleX, label: 'Delete' },
  { id: 'message', icon: MailPlus, label: 'Send Message' },
]

const ToolBar: React.FC = () => {
  const { activeTool, setActiveTool, selectedNodeType, setSelectedNodeType } = useToolbarStore();

  const nodeTypes = [
    { type: 'drone' as const, icon: Drone, label: 'Drone' },
    { type: 'client' as const, icon: Laptop, label: 'Client' },
    { type: 'server' as const, icon: Database, label: 'Server' },
  ];
  return (
    <div className="flex flex-col items-center justify-start pt-5 px-4">
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

      {/* Node Type Selector - appears when 'plus' tool is active */}
      {activeTool === 'plus' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 transition-all duration-300 animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            {nodeTypes.map((nodeType) => (
              <button
                key={nodeType.type}
                onClick={() => setSelectedNodeType(nodeType.type)}
                className={`
                  relative p-3 rounded-xl transition-all duration-200 group
                  ${selectedNodeType === nodeType.type 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                `}
                title={nodeType.label}
              >
                <nodeType.icon className="h-5 w-5" />

                {selectedNodeType === nodeType.type && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}

                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                    {nodeType.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ToolBar