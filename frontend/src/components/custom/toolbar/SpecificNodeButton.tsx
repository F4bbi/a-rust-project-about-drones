import React from "react";
import { Drone, Laptop, Database } from "lucide-react";
import type { NodeType } from "@/stores/toolbarStore";

interface SpecificNodeButtonProps {
  node: { name: string; type: NodeType; image: string };
  nodeType: NodeType;
  isSelected: boolean;
  onClick: () => void;
}

const SpecificNodeButton: React.FC<SpecificNodeButtonProps> = ({
  node,
  nodeType,
  isSelected,
  onClick,
}) => {
  // Get the appropriate icon based on node type
  const IconComponent =
    nodeType === "drone" ? Drone : nodeType === "client" ? Laptop : Database;

  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 rounded-lg transition-all duration-200 group
        ${
          isSelected
            ? "bg-green-500 text-white shadow-md"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
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
};

export default SpecificNodeButton;
