import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

interface Configuration {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

interface ConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConfig: (configId: number) => void;
}

const ConfigPopup: React.FC<ConfigPopupProps> = ({
  isOpen,
  onClose,
  onSelectConfig,
}) => {
  if (!isOpen) return null;

  const [configurations, setConfigurations] = useState<Configuration[]>([]);

  useEffect(() => {
    fetch(buildApiUrl("configurations"))
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched configurations:", data);
        setConfigurations(data || []);
      })
      .catch((err) => console.error("Error fetching topology:", err));
  }, [isOpen]);

  const handleConfigSelect = (configId: number) => {
    onSelectConfig(configId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Network Configurations
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {configurations.map((config) => (
              <div
                key={config.id}
                className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  config.is_active
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleConfigSelect(config.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {config.name}
                      </h3>
                      {config.is_active && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select a configuration to apply it to your network topology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigPopup;
