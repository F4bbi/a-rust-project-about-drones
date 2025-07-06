import React from "react";
import { Settings } from "lucide-react";

interface ConfigButtonProps {
  onClick: () => void;
}

const ConfigButton: React.FC<ConfigButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-0 left-0 z-10 pl-5 pb-5">
      <button
        onClick={onClick}
        className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 active:scale-95 w-[60px] h-[60px] flex items-center justify-center"
        title="Configuration Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ConfigButton;
