import React from 'react'
import { Drone, Laptop, Database, LineSquiggle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import PopupArrow from './PopupArrow'
import NodeTypeButton from './NodeTypeButton'
import SpecificNodeMenu from './SpecificNodeMenu'
import type { NodeType } from '@/stores/toolbarStore'

interface NodeTypeMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedNodeType: NodeType | null
  selectedSpecificNode: { name: string; type: NodeType; image: string } | null
  availableNodes: Array<{ name: string; type: NodeType; image: string }>
  isNodeMenuOpen: boolean
  onNodeMenuOpenChange: (open: boolean) => void
  onNodeTypeSelect: (nodeType: NodeType) => void
  onSpecificNodeSelect: (node: { name: string; type: NodeType; image: string }) => void
  children: React.ReactNode
}

const NodeTypeMenu: React.FC<NodeTypeMenuProps> = ({
  isOpen,
  onOpenChange,
  selectedNodeType,
  selectedSpecificNode,
  availableNodes,
  isNodeMenuOpen,
  onNodeMenuOpenChange,
  onNodeTypeSelect,
  onSpecificNodeSelect,
  children
}) => {
  const nodeTypes = [
    { type: 'drone' as const, icon: Drone, label: 'Drone' },
    { type: 'client' as const, icon: Laptop, label: 'Client' },
    { type: 'server' as const, icon: Database, label: 'Server' },
    { type: 'edge' as const, icon: LineSquiggle, label: 'Edge' },
  ]

  // Filter nodes by selected type (only for node types, not edge)
  const filteredNodes = selectedNodeType && selectedNodeType !== 'edge'
    ? availableNodes.filter(node => node.type === selectedNodeType)
    : []

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg relative"
        side="bottom"
        align="center"
        sideOffset={10}
      >
        <PopupArrow />
        
        <div className="flex items-center space-x-3 relative z-10">
          {nodeTypes.map((nodeType) => (
            <NodeTypeButton
              key={nodeType.type}
              nodeType={nodeType}
              isSelected={selectedNodeType === nodeType.type}
              onClick={() => onNodeTypeSelect(nodeType.type)}
            >
              {nodeType.type !== 'edge' ? (
                <SpecificNodeMenu
                  isOpen={isNodeMenuOpen && selectedNodeType === nodeType.type}
                  onOpenChange={onNodeMenuOpenChange}
                  filteredNodes={filteredNodes}
                  selectedNodeType={selectedNodeType!}
                  selectedSpecificNode={selectedSpecificNode}
                  onNodeSelect={onSpecificNodeSelect}
                >
                  <button
                    onClick={() => onNodeTypeSelect(nodeType.type)}
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
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                        {nodeType.label}
                      </div>
                    </div>
                  </button>
                </SpecificNodeMenu>
              ) : null}
            </NodeTypeButton>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NodeTypeMenu
