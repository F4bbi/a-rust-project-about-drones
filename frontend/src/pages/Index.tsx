import { useEffect, useState, useRef } from 'react'
import type { ElementDefinition } from 'cytoscape'
import TopologyVisualizer, { type TopologyVisualizerRef } from '@/components/custom/topology-visualizer/TopologyVisualizer'
import ThemeToggleButton from '@/components/ui/theme-toggle'
import ToolBar from '@/components/custom/toolbar/Toolbar'
import ControlBar from '@/components/custom/control-bar/ControlBar'
import ConfigButton from '@/components/custom/config-button/ConfigButton'
import ConfigPopup from '@/components/custom/config-button/ConfigPopup'
import LogsButton from '@/components/custom/logs/LogsButton'
import LogsSidebar from '@/components/custom/logs/LogsSidebar'
import NodeDetailsSidebar from '@/components/custom/NodeDetailsSidebar'

function Index() {
  const [topology, setTopology] = useState<{nodes: ElementDefinition[], edges: ElementDefinition[]}>({
    nodes: [],
    edges: []
  })
  
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [isConfigPopupOpen, setIsConfigPopupOpen] = useState(false)
  const [isLogsSidebarOpen, setIsLogsSidebarOpen] = useState(false)
  const topologyRef = useRef<TopologyVisualizerRef>(null)

  useEffect(() => {
    // Fetch topology data
    fetch('/api/topology')
      .then(res => res.json())
      .then(data => {
        setTopology({
          nodes: data.nodes,
          edges: data.edges
        })
      })
      .catch(err => console.error('Error fetching topology:', err))
  }, [])

  const handleNodeSelect = (nodeData: any) => {
    setSelectedNode(nodeData)
  }

  const handleCloseSidebar = () => {
    setSelectedNode(null)
  }

  const handleRemoveEdge = (fromNodeId: string, toNodeId: string) => {
    console.log(`Removing edge between ${fromNodeId} and ${toNodeId}`)
    
    // Remove the edge from the Cytoscape graph
    topologyRef.current?.removeEdge(fromNodeId, toNodeId)
    
    // Update the topology state to remove the edge
    setTopology(prevTopology => ({
      ...prevTopology,
      edges: prevTopology.edges.filter(edge => {
        const source = edge.data?.source
        const target = edge.data?.target
        return !((source === fromNodeId && target === toNodeId) || 
                 (source === toNodeId && target === fromNodeId))
      })
    }))
    
    // TODO: Also send removal request to backend API
    // Example: await removeEdgeAPI(fromNodeId, toNodeId)
  }

  const handlePlay = () => {
    console.log('Starting simulation...')
    // TODO: Implement simulation start logic
    // Example: await startSimulationAPI()
  }

  const handleStop = () => {
    console.log('Stopping simulation...')
    // TODO: Implement simulation stop logic
    // Example: await stopSimulationAPI()
  }

  const handleOpenConfig = () => {
    setIsConfigPopupOpen(true)
  }

  const handleCloseConfig = () => {
    setIsConfigPopupOpen(false)
  }

  const handleSelectConfig = (configId: string) => {
    console.log(`Selected configuration: ${configId}`)
    // TODO: Implement configuration change logic
    // Example: await applyConfigurationAPI(configId)
    // This could reload the topology with the new configuration
  }

  const handleOpenLogs = () => {
    setIsLogsSidebarOpen(true)
  }

  const handleCloseLogs = () => {
    setIsLogsSidebarOpen(false)
  }

  return (
    <div className="relative w-screen h-screen m-0 p-0 overflow-hidden">
      {/* Fixed positioned toolbar and theme toggle */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 pt-5">
        <ToolBar />
      </div>
      <ThemeToggleButton />
      
      {/* Full screen topology visualizer - adjust width when sidebars are open */}
      <div className={`w-full h-full transition-all duration-300 ${
        selectedNode && isLogsSidebarOpen ? 'px-80' : // Both sidebars open
        selectedNode ? 'pr-80' : // Only node details sidebar open  
        isLogsSidebarOpen ? 'pr-96' : '' // Only logs sidebar open
      }`}>
        <TopologyVisualizer
          ref={topologyRef}
          nodes={topology.nodes}
          edges={topology.edges}
          onNodeSelect={handleNodeSelect}
        />
      </div>

      {/* Control bar at the bottom */}
      <ControlBar 
        onPlay={handlePlay}
        onStop={handleStop}
      />

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
      <LogsSidebar
        isOpen={isLogsSidebarOpen}
        onClose={handleCloseLogs}
      />

      {/* Node details sidebar */}
      {selectedNode && (
        <NodeDetailsSidebar
          node={selectedNode}
          onClose={handleCloseSidebar}
          onRemoveEdge={handleRemoveEdge}
        />
      )}
    </div>
  )
}

export default Index
