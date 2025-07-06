import { FileText } from "lucide-react";
import React from "react";

interface LogsButtonProps {
  onClick: () => void;
}

const LogsButton: React.FC<LogsButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-0 right-0 z-10 pr-5 pb-5">
      <button
        onClick={onClick}
        className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 active:scale-95 w-[60px] h-[60px] flex items-center justify-center"
        title="View Logs"
      >
        <FileText className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LogsButton;
