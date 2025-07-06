import React, { useEffect, useState } from "react";
import { X, Trash2, AlertTriangle, Wifi } from "lucide-react";
import {
  setDronePacketDropRate,
  crashDrone as crashNode,
} from "./topology-visualizer/messageApi";

interface NodeDetailsProps {
  node_id_or_undefined: string | undefined;
  onClose: () => void;
  onRemoveEdge?: (fromNodeId: string, toNodeId: string) => void;
  onNodeCrash: (nodeId: string) => void;
}

type Neighbor = {
  id: string;
  label: string;
  type: "drone" | "server" | "client";
};

const NodeDetailsSidebar: React.FC<NodeDetailsProps> = ({
  node_id_or_undefined,
  onClose,
  onRemoveEdge,
  onNodeCrash,
}) => {
  if (!node_id_or_undefined) return null;
  const node_id = node_id_or_undefined || "";

  const messages = [
    {
      id: "1",
      content: "Hello, this is a test message.",
      timestamp: new Date().toISOString(),
      sender: "Drone A",
      receiver: "Drone B",
    },
    {
      id: "2",
      content: "This is another message.",
      timestamp: new Date().toISOString(),
      sender: "Drone B",
      receiver: "Drone A",
    },
  ];

  // State to manage neighbors list
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [label, setLabel] = useState("Unknown Node");
  const [node_type, setNodeType] = useState("Unknown Type");
  const [packet_drop_rate, setPacketDropRate] = useState(0.0);
  const [statistics, setStatistics] = useState({
    packetsSent: 0,
    packetsDropped: 0,
  });

  useEffect(() => {
    // Fetch topology data
    fetch("/api/node/" + node_id)
      .then((res) => res.json())
      .then((data) => {
        setNeighbors(data.neighbours || []);
        setLabel(data.label || "Unknown Node");
        setNodeType(data.type || "Unknown Type");
        if (data.type === "drone") {
          setPacketDropRate(data.packet_drop_rate || 0.0);
          setStatistics({
            packetsSent: data.pkg_sent || 0,
            packetsDropped: data.pkg_drop || 0,
          });
        }
      })
      .catch((err) => console.error("Error fetching topology:", err));
  }, [node_id_or_undefined]);

  // Drone-specific state

  const handleRemoveNeighbor = (neighborId: string) => {
    console.log(`Remove connection between ${node_id} and ${neighborId}`);

    // Remove neighbor from UI immediately
    setNeighbors((prevNeighbors) =>
      prevNeighbors.filter((neighbor) => neighbor.id !== neighborId),
    );

    // Remove edge from Cytoscape graph
    onRemoveEdge?.(node_id, neighborId);
  };

  // Drone-specific handlers
  const handleSetPacketDropRate = async () => {
    try {
      console.log(
        `Setting packet drop rate for drone ${node_id} to ${packet_drop_rate}`,
      );
      await setDronePacketDropRate(node_id, packet_drop_rate);
    } catch (error) {
      console.error("Failed to set packet drop rate:", error);
    }
  };

  const handleCrashNode = async () => {
    try {
      console.log(`Crashing node ${node_id}`);
      await crashNode(node_id);
      onNodeCrash(node_id);
      node_id_or_undefined = undefined;
    } catch (error) {
      console.error("Failed to crash node:", error);
      alert("Failed to crash node");
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-20 transform transition-transform duration-300 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {label}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Neighbors Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Connected Neighbors ({neighbors.length || 0})
          </h3>
          <div className="space-y-2">
            {neighbors.length > 0 ? (
              neighbors.map((neighbor) => (
                <div
                  key={neighbor.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        neighbor.type === "drone"
                          ? "bg-blue-500"
                          : neighbor.type === "server"
                            ? "bg-red-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {neighbor.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {neighbor.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveNeighbor(neighbor.id)}
                    className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                    title="Remove connection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No connected neighbors
              </p>
            )}
          </div>
        </div>

        {/* Drone-specific Controls */}
        {node_type === "drone" && (
          <>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Drone Controls
              </h3>

              <div className="space-y-3">
                {/* Packet Drop Rate Control */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Wifi className="inline h-4 w-4 mr-2" />
                    Set Packet Drop Rate
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={packet_drop_rate.toFixed(2)}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);

                        if (isNaN(v) || v < 0 || v > 1) {
                          alert(
                            "Please enter a valid rate between 0.0 and 1.0",
                          );
                          setPacketDropRate(packet_drop_rate);
                        } else {
                          setPacketDropRate(v);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                    <button
                      onClick={handleSetPacketDropRate}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Set
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Range: 0.0 (0%) to 1.0 (100%)
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Packets Sent
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {statistics.packetsSent.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Packets Dropped
                    </span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {statistics.packetsDropped.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Success Rate */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Success Rate
                    </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {(
                        ((statistics.packetsSent - statistics.packetsDropped) /
                          statistics.packetsSent) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((statistics.packetsSent - statistics.packetsDropped) / statistics.packetsSent) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Crash Drone Button */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <AlertTriangle className="inline h-4 w-4 mr-2" />
                Crash {node_type}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Node is currently online
              </p>
            </div>
            <button
              onClick={handleCrashNode}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
            >
              Crash
            </button>
          </div>
        </div>

        {/* Client Only */}
        {node_type === "client" && (
          <>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Client Controls
            </h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recived Messages
                    </label>
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                      >
                        <p className="text-sm text-gray-900 dark:text-white">
                          <strong>{msg.sender}:</strong> {msg.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No messages received
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NodeDetailsSidebar;
