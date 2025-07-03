import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import PopupArrow from '@/components/custom/toolbar/PopupArrow'
import SpecificNodeButton from '@/components/custom/toolbar/SpecificNodeButton'
import type { NodeType } from '@/stores/toolbarStore'

interface SpecificNodeMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  filteredNodes: Array<{ name: string; type: NodeType; image: string }>
  selectedNodeType: NodeType
  selectedSpecificNode: { name: string; type: NodeType; image: string } | null
  onNodeSelect: (node: { name: string; type: NodeType; image: string }) => void
  children: React.ReactNode
}

const SpecificNodeMenu: React.FC<SpecificNodeMenuProps> = ({
  isOpen,
  onOpenChange,
  filteredNodes,
  selectedNodeType,
  selectedSpecificNode,
  onNodeSelect,
  children
}) => {
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
          {filteredNodes.map((node) => (
            <SpecificNodeButton
              key={node.name}
              node={node}
              nodeType={selectedNodeType}
              isSelected={selectedSpecificNode?.name === node.name}
              onClick={() => onNodeSelect(node)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SpecificNodeMenu
