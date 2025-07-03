import { MousePointer, Plus, MailPlus, Drone, Laptop, Database, LineSquiggle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useToolbarStore, type Tool } from '../../stores/toolbarStore'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: 'cursor', icon: MousePointer, label: 'Move' },
  { id: 'plus', icon: Plus, label: 'Add' },
  { id: 'message', icon: MailPlus, label: 'Send Message' },
]

const ToolBar: React.FC = () => {
  const { 
    activeTool, 
    setActiveTool,
    selectedNodeType, 
    setSelectedNodeType,
    selectedSpecificNode,
    setSelectedSpecificNode,
    availableNodes,
    setAvailableNodes
  } = useToolbarStore();

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isNodeMenuOpen, setIsNodeMenuOpen] = useState(false);

  const nodeTypes = [
    { type: 'drone' as const, icon: Drone, label: 'Drone' },
    { type: 'client' as const, icon: Laptop, label: 'Client' },
    { type: 'server' as const, icon: Database, label: 'Server' },
    { type: 'edge' as const, icon: LineSquiggle, label: 'Edge' },
  ];

  // Fetch available nodes when component mounts
  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        setAvailableNodes(data.nodes);
      })
      .catch(err => console.error('Error fetching nodes:', err));
  }, [setAvailableNodes]);

  // Handle node type selection from the popup
  const handleNodeTypeClick = (nodeType: typeof nodeTypes[0]['type']) => {
    setSelectedNodeType(nodeType);
    // For edge type, we don't need the popover to stay open
    if (nodeType === 'edge') {
      setIsAddMenuOpen(false);
    } else {
      // For other node types, open the specific node menu
      setIsNodeMenuOpen(true);
    }
  };

  // Handle specific node selection
  const handleSpecificNodeClick = (node: typeof availableNodes[0]) => {
    setSelectedSpecificNode(node);
    setIsNodeMenuOpen(false);
  };

  // Filter nodes by selected type (only for node types, not edge)
  const filteredNodes = selectedNodeType && selectedNodeType !== 'edge'
    ? availableNodes.filter(node => node.type === selectedNodeType)
    : [];

  return (
    <div className="flex flex-col items-center justify-start pt-5 px-4">
      {/* Main Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 mb-8 transition-all duration-300">
        <div className="flex items-center space-x-2">
          {tools.map((tool) => (
            <div key={tool.id} className="relative">
              {tool.id === 'plus' ? (
                <Popover open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
                  <PopoverTrigger asChild>
                    <button
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
                      <tool.icon className="h-6 w-6" />
                      
                      {/* Active indicator */}
                      {activeTool === tool.id && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                      )}
                      
                      {/* Tooltip */}
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                          {tool.label}
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg relative"
                    side="bottom"
                    align="center"
                    sideOffset={10}
                  >
                    {/* Arrow pointing to the Add button */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45"></div>
                    
                    <div className="flex items-center space-x-3 relative z-10">
                      {nodeTypes.map((nodeType) => (
                        <div key={nodeType.type} className="relative">
                          {nodeType.type !== 'edge' ? (
                            <Popover open={isNodeMenuOpen && selectedNodeType === nodeType.type} onOpenChange={setIsNodeMenuOpen}>
                              <PopoverTrigger asChild>
                                <button
                                  onClick={() => handleNodeTypeClick(nodeType.type)}
                                  className={`
                                    p-3 rounded-lg transition-colors duration-200 group
                                    ${selectedNodeType === nodeType.type 
                                      ? 'bg-blue-500 text-white shadow-md' 
                                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }
                                  `}
                                  title={nodeType.label}
                                >
                                  <nodeType.icon className="h-5 w-5" />
                                  
                                  {/* Tooltip for sub-tools */}
                                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                                      {nodeType.label}
                                    </div>
                                  </div>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent 
                                className="w-auto p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg relative"
                                side="bottom"
                                align="center"
                                sideOffset={10}
                              >
                                {/* Arrow pointing to the node type button */}
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45"></div>
                                
                                <div className="flex items-center space-x-3 relative z-10">
                                  {filteredNodes.map((node) => {
                                    const IconComponent = selectedNodeType === 'drone' ? Drone : 
                                                        selectedNodeType === 'client' ? Laptop : Database;
                                    
                                    return (
                                      <button
                                        key={node.name}
                                        onClick={() => handleSpecificNodeClick(node)}
                                        className={`
                                          relative p-3 rounded-lg transition-all duration-200 group
                                          ${selectedSpecificNode?.name === node.name 
                                            ? 'bg-green-500 text-white shadow-md' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                          }
                                        `}
                                        title={node.name}
                                      >
                                        <IconComponent className="h-4 w-4" />

                                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                                          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                                            {node.name}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <button
                              onClick={() => handleNodeTypeClick(nodeType.type)}
                              className={`
                                p-2 rounded-lg transition-colors duration-200 group
                                ${selectedNodeType === nodeType.type 
                                  ? 'bg-blue-500 text-white shadow-md' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }
                              `}
                              title={nodeType.label}
                            >
                              <nodeType.icon className="h-5 w-5" />
                              
                              {/* Tooltip for sub-tools */}
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                                  {nodeType.label}
                                </div>
                              </div>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <button
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
                  <tool.icon className="h-6 w-6" />
                  
                  {/* Active indicator */}
                  {activeTool === tool.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                      {tool.label}
                    </div>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ToolBar
