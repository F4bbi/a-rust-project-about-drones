import { useEffect, useState, useRef } from "react";
import type { ElementDefinition } from "cytoscape";
import TopologyVisualizer, {
  type TopologyVisualizerRef,
} from "@/components/custom/topology-visualizer/TopologyVisualizer";
import ThemeToggleButton from "@/components/ui/theme-toggle";
import ToolBar from "@/components/custom/toolbar/Toolbar";
import ConfigButton from "@/components/custom/config-button/ConfigButton";
import ConfigPopup from "@/components/custom/config-button/ConfigPopup";
import LogsButton from "@/components/custom/logs-button/LogsButton";
import LogsSidebar from "@/components/custom/logs-button/LogsSidebar";
import NodeDetailsSidebar from "@/components/custom/NodeDetailsSidebar";

function Index() {
  const [topology, setTopology] = useState<{
    nodes: ElementDefinition[];
    edges: ElementDefinition[];
  }>({
    nodes: [],
    edges: [],
  });

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isConfigPopupOpen, setIsConfigPopupOpen] = useState(false);
  const [isLogsSidebarOpen, setIsLogsSidebarOpen] = useState(false);
  const topologyRef = useRef<TopologyVisualizerRef>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    // Fetch topology data
    fetch("/api/topology")
      .then((res) => res.json())
      .then((data) => {
        setTopology({
          nodes: data.nodes,
          edges: data.edges,
        });
      })
      .catch((err) => console.error("Error fetching topology:", err));
  }, [trigger]);

  const handleNodeSelect = (nodeData: any) => {
    setSelectedNode(nodeData);
  };

  const handleCloseSidebar = () => {
    setSelectedNode(null);
  };

  const handleRemoveEdge = (fromNodeId: string, toNodeId: string) => {
    console.log(`Removing edge between ${fromNodeId} and ${toNodeId}`);

    // Remove the edge from the Cytoscape graph
    topologyRef.current?.removeEdge(fromNodeId, toNodeId);

    fetch("/api/edges", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_id: parseInt(fromNodeId),
        to_id: parseInt(toNodeId),
      }),
    }).catch((err) => {
      console.error("Error removing edge:", err);
    });
  };

  const handleNodeCrash = (nodeId: string) => {
    console.log(`Node ${nodeId} has crashed`);
    topologyRef.current?.removeNode(nodeId);
    setSelectedNode(null);
  };

  const handleOpenConfig = () => {
    setIsConfigPopupOpen(true);
  };

  const handleCloseConfig = () => {
    setIsConfigPopupOpen(false);
  };

  const handleSelectConfig = (configId: number) => {
    console.log(`Selected configuration: ${configId}`);
    fetch("/api/configurations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: configId }),
    }).then(() => {
      setTrigger((prev) => prev + 1);
    });
  };

  const handleOpenLogs = () => {
    setIsLogsSidebarOpen(true);
  };

  const handleCloseLogs = () => {
    setIsLogsSidebarOpen(false);
  };

  return (
    <div className="relative w-screen h-screen m-0 p-0 overflow-hidden">
      {/* Fixed positioned toolbar and theme toggle */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 pt-5">
        <ToolBar />
      </div>
      <ThemeToggleButton />

      {/* Full screen topology visualizer - adjust width when sidebars are open */}
      <div
        className={`w-full h-full transition-all duration-300 ${
          selectedNode && isLogsSidebarOpen
            ? "px-80" // Both sidebars open
            : selectedNode
              ? "pr-80" // Only node details sidebar open
              : isLogsSidebarOpen
                ? "pr-96"
                : "" // Only logs sidebar open
        }`}
      >
        <TopologyVisualizer
          ref={topologyRef}
          nodes={topology.nodes}
          edges={topology.edges}
          onNodeSelect={handleNodeSelect}
        />
      </div>

      {/* Configuration button at bottom left */}
      <ConfigButton onClick={handleOpenConfig} />

      {/* Logs button at bottom right */}
      <LogsButton onClick={handleOpenLogs} />

      {/* Configuration popup */}
      <ConfigPopup
        isOpen={isConfigPopupOpen}
        onClose={handleCloseConfig}
        onSelectConfig={handleSelectConfig}
      />

      {/* Logs sidebar */}
      <LogsSidebar isOpen={isLogsSidebarOpen} onClose={handleCloseLogs} />

      {/* Node details sidebar */}
      {selectedNode && (
        <NodeDetailsSidebar
          node_id_or_undefined={selectedNode.id}
          onClose={handleCloseSidebar}
          onRemoveEdge={handleRemoveEdge}
          onNodeCrash={handleNodeCrash}
        />
      )}
    </div>
  );
}

export default Index;
