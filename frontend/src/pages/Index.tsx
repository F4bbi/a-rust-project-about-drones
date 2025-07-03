import { useEffect, useState } from 'react'
import type { ElementDefinition } from 'cytoscape'
import TopologyVisualizer from '@/components/custom/topology-visualizer/TopologyVisualizer'
import ThemeToggleButton from '@/components/ui/theme-toggle'
import ToolBar from '@/components/custom/toolbar/Toolbar'
import NodeDetailsSidebar from '@/components/custom/NodeDetailsSidebar'

function Index() {
  const [topology, setTopology] = useState<{nodes: ElementDefinition[], edges: ElementDefinition[]}>({
    nodes: [],
    edges: []
  })
  
  const [selectedNode, setSelectedNode] = useState<any>(null)

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

  return (
    <div className="relative w-screen h-screen m-0 p-0 overflow-hidden">
      {/* Fixed positioned toolbar and theme toggle */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 pt-5">
        <ToolBar />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggleButton />
      </div>
      
      {/* Full screen topology visualizer - adjust width when sidebar is open */}
      <div className={`w-full h-full transition-all duration-300 ${selectedNode ? 'pr-80' : ''}`}>
        <TopologyVisualizer
          nodes={topology.nodes}
          edges={topology.edges}
          onNodeSelect={handleNodeSelect}
        />
      </div>

      {/* Node details sidebar */}
      {selectedNode && (
        <NodeDetailsSidebar
          node={selectedNode}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  )
}

export default Index
