import React from "react";
import type { Tool } from "@/stores/toolbarStore";

interface ToolButtonProps {
  tool: { id: Tool; icon: React.ElementType; label: string };
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  tool,
  isActive,
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
            relative p-3 rounded-xl transition-all duration-200 group
            ${
              isActive
                ? "bg-blue-500 text-white shadow-md"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            }
          `}
          title={tool.label}
        >
          <tool.icon className="h-6 w-6" />

          {/* Active indicator */}
          {isActive && (
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
  );
};

export default ToolButton;
