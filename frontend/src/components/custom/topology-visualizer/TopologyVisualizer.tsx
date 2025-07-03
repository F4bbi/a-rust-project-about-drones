import React from 'react'
import CytoscapeContainer from './CytoscapeContainer'
import type { TopologyVisualizerProps } from './types'

const TopologyVisualizer: React.FC<TopologyVisualizerProps> = ({ nodes, edges, onNodeSelect }) => {
  const handleNodeCreate = (node: any) => {
    console.log('Node created:', node)
  }

  const handleEdgeCreate = (edge: any) => {
    console.log('Edge created:', edge)
  }

  const handleNodeClick = (nodeData: any) => {
    console.log('Node clicked:', nodeData)
    onNodeSelect?.(nodeData)
  }

  return (
    <CytoscapeContainer 
      nodes={nodes} 
      edges={edges}
      onNodeCreate={handleNodeCreate}
      onEdgeCreate={handleEdgeCreate}
      onNodeSelect={handleNodeClick}
    />
  )
}

export default TopologyVisualizer
