import React from 'react'
import CytoscapeContainer from './CytoscapeContainer'
import type { TopologyVisualizerProps } from './types'

const TopologyVisualizer: React.FC<TopologyVisualizerProps> = ({ nodes, edges }) => {
  const handleNodeCreate = (node: any) => {
    console.log('Node created:', node)
  }

  const handleEdgeCreate = (edge: any) => {
    console.log('Edge created:', edge)
  }

  return (
    <CytoscapeContainer 
      nodes={nodes} 
      edges={edges}
      onNodeCreate={handleNodeCreate}
      onEdgeCreate={handleEdgeCreate}
    />
  )
}

export default TopologyVisualizer
