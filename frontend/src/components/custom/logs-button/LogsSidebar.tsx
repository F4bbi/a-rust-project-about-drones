import { FileText, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface LogEntry {
  level: string;
  message: string;
}

interface LogsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogsSidebar: React.FC<LogsSidebarProps> = ({ isOpen, onClose }) => {
  const [width, setWidth] = useState(400); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLogLevel, setSelectedLogLevel] = useState("info"); // Default log level
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  const logLevels = ["trace", "debug", "info", "warn", "error"];

  useEffect(() => {
    if (isOpen) {
      const fetchLogs = () => {
        fetch(`/api/logs?level=${selectedLogLevel}`)
          .then((res) => res.json())
          .then((data) => setLogs(data.reverse().slice(0, 1000)))
          .catch((err) => console.error("Error fetching logs:", err));
      };

      fetchLogs(); // Initial fetch
      const intervalId = setInterval(fetchLogs, 1000); // Fetch every 1 seconds

      return () => clearInterval(intervalId); // Cleanup on component unmount or when isOpen changes
    }
  }, [isOpen, selectedLogLevel]); // Depend on selectedLogLevel

  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      setIsResizing(true);

      const startX = mouseDownEvent.clientX;
      const startWidth = width;

      const doDrag = (mouseMoveEvent: MouseEvent) => {
        const newWidth = startWidth - (mouseMoveEvent.clientX - startX);
        // Minimum width of 300px, maximum width of 80% of screen
        const minWidth = 300;
        const maxWidth = window.innerWidth * 0.8;
        setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
      };

      const stopDrag = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
      };

      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
    },
    [width],
  );

  if (!isOpen) return null;

  return (
    <div
      ref={sidebarRef}
      className="fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-20 transform transition-transform duration-300 flex"
      style={{ width: `${width}px` }}
    >
      {/* Resize handle */}
      <div
        className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors duration-200 flex-shrink-0"
        onMouseDown={startResizing}
        style={{ cursor: isResizing ? "col-resize" : "col-resize" }}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Logs
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Log Level Selection */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Log Level:
          </label>
          <div className="relative">
            <button
              type="button"
              className="flex justify-between items-center w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedLogLevel.charAt(0).toUpperCase() +
                selectedLogLevel.slice(1)}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {logLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setSelectedLogLevel(level);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {logs.length > 0 ? (
            <ul>
              {logs.map((log, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-800 dark:text-gray-300"
                >
                  <span
                    className={`font-bold ${
                      log.level === "DEBUG" ? "text-blue-500" :
                      log.level === "INFO" ? "text-green-500" :
                      log.level === "WARN" ? "text-yellow-500" :
                      log.level === "ERROR" ? "text-red-500" : ""
                    }`}
                  >
                    {log.level}:
                  </span>{" "}
                  {log.message}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-center mt-8">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No logs to display for the selected level.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsSidebar;
