import { useRef, useImperativeHandle, forwardRef } from 'react'
import CytoscapeContainer, { type CytoscapeContainerRef } from './CytoscapeContainer'
import type { TopologyVisualizerProps } from './types'

export interface TopologyVisualizerRef {
  removeEdge: (fromNodeId: string, toNodeId: string) => void
}

const TopologyVisualizer = forwardRef<TopologyVisualizerRef, TopologyVisualizerProps>(
  ({ nodes, edges, onNodeSelect, onRemoveEdge }, ref) => {
    const cytoscapeRef = useRef<CytoscapeContainerRef>(null)

    useImperativeHandle(ref, () => ({
      removeEdge: (fromNodeId: string, toNodeId: string) => {
        cytoscapeRef.current?.removeEdge(fromNodeId, toNodeId)
        onRemoveEdge?.(fromNodeId, toNodeId)
      }
    }))

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
        ref={cytoscapeRef}
        nodes={nodes} 
        edges={edges}
        onNodeCreate={handleNodeCreate}
        onEdgeCreate={handleEdgeCreate}
        onNodeSelect={handleNodeClick}
      />
    )
  }
)

TopologyVisualizer.displayName = 'TopologyVisualizer'

export default TopologyVisualizer
