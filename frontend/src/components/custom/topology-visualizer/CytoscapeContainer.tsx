import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import cytoscape, { type Core } from 'cytoscape'
import { useCytoscapeEvents } from './useCytoscapeEvents'
import type { TopologyVisualizerProps } from './types'

interface CytoscapeContainerProps extends TopologyVisualizerProps {
  onNodeCreate?: (node: any) => void
  onEdgeCreate?: (edge: any) => void
}

export interface CytoscapeContainerRef {
  removeEdge: (fromNodeId: string, toNodeId: string) => void
}

const cytoscapeStyles = [
  {
    selector: 'node',
    style: {
      'background-color': '#666',
      'label': 'data(label)',
      'text-valign': 'center' as const,
      'text-halign': 'center' as const,
      'font-size': '12px',
      'color': 'white',
      'text-outline-color': '#666',
      'text-outline-width': 2,
      'width': '40px',
      'height': '40px',
    },
  },
  {
    selector: 'node[type="drone"]',
    style: {
      'background-color': '#3498db',
      'shape': 'triangle',
    },
  },
  {
    selector: 'node[type="server"]',
    style: {
      'background-color': '#ffd700', // Yellow for communication server
      'shape': 'rectangle' as const,
    },
  },
  {
    selector: 'node[type="content-server"]',
    style: {
      'background-color': '#ff8c00', // Orange for content server
      'shape': 'rectangle' as const,
    },
  },
  {
    selector: 'node[type="communication-server"]',
    style: {
      'background-color': '#ffd700', // Yellow for communication server
      'shape': 'rectangle' as const,
    },
  },
  {
    selector: 'node[type="client"]',
    style: {
       'background-color': '#90ee90', // Dark green for chat client
      'shape': 'ellipse' as const,
    },
  },
  {
    selector: 'node[type="chat-client"]',
    style: {
      'background-color': '#90ee90', // Dark green for chat client
      'shape': 'ellipse' as const,
    },
  },
  {
    selector: 'node[type="web-client"]',
    style: {
      'background-color': '#009e1a', // Light green for web client
      'shape': 'ellipse' as const,
    },
  },
  {
    selector: 'node.selected',
    style: {
      'border-width': 3,
      'border-color': '#ff6b35',
      'border-style': 'solid' as const,
    },
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#ccc',
      'curve-style': 'bezier' as const,
    },
  },
]

const CytoscapeContainer = forwardRef<CytoscapeContainerRef, CytoscapeContainerProps>(
  ({ nodes, edges, onNodeCreate, onEdgeCreate, onNodeSelect }, ref) => {
    const cyRef = useRef<HTMLDivElement>(null)
    const cyInstance = useRef<Core | null>(null)

    // Function to remove edge from Cytoscape
    const removeEdgeFromGraph = (fromNodeId: string, toNodeId: string) => {
      const cy = cyInstance.current
      if (!cy) return

      // Find and remove edges between the two nodes (bidirectional)
      const edgesToRemove = cy.edges().filter((edge) => {
        const source = edge.source().id()
        const target = edge.target().id()
        return (source === fromNodeId && target === toNodeId) || 
               (source === toNodeId && target === fromNodeId)
      })

      edgesToRemove.remove()
      console.log(`Removed ${edgesToRemove.length} edge(s) between ${fromNodeId} and ${toNodeId}`)
    }

    // Expose the edge removal function via ref
    useImperativeHandle(ref, () => ({
      removeEdge: removeEdgeFromGraph
    }))

    // Initialize Cytoscape once
  useEffect(() => {
    if (!cyRef.current || cyInstance.current) return
    
    const cy = cytoscape({
      container: cyRef.current,
      elements: [],
      style: cytoscapeStyles,
    })
    
    cyInstance.current = cy
  }, [])

  // Register events
  useCytoscapeEvents(cyInstance.current!, { onNodeCreate, onEdgeCreate, onNodeSelect })

  // Update elements when props change
  useEffect(() => {
    const cy = cyInstance.current
    if (!cy) return
    
    const layoutConfig = {
      name: 'circle',
      radius: 150,
      handleDisconnected: true,
      animate: true,
      avoidOverlap: true,
      infinite: false,
      ready: (e: { cy: { fit: () => void; center: () => void; zoom: (level: number) => void } }) => {
        e.cy.fit()
        e.cy.center()
      }
    }
    
    cy.elements().remove()
    cy.add([...nodes, ...edges])
    cy.layout(layoutConfig).run()
  }, [nodes, edges])

    return <div ref={cyRef} style={{ width: '100%', height: '100%' }} />
  }
)

CytoscapeContainer.displayName = 'CytoscapeContainer'

export default CytoscapeContainer
