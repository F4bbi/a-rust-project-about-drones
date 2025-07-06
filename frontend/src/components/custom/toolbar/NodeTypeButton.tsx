import React from "react";
import type { NodeType } from "@/stores/toolbarStore";

interface NodeTypeButtonProps {
  nodeType: { type: NodeType; icon: React.ElementType; label: string };
  isSelected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const NodeTypeButton: React.FC<NodeTypeButtonProps> = ({
  nodeType,
  isSelected,
  onClick,
  children,
}) => {
  return (
    <div className="relative">
      {children ? (
        children
      ) : (
        <button
          onClick={onClick}
          className={`
            p-3 rounded-lg transition-colors duration-200 group
            ${
              isSelected
                ? "bg-blue-500 text-white shadow-md"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
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
      )}
    </div>
  );
};

export default NodeTypeButton;
