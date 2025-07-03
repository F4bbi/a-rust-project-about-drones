import React, { useEffect, useRef } from 'react'
import cytoscape, { type Core } from 'cytoscape'
import { useCytoscapeEvents } from './useCytoscapeEvents'
import type { TopologyVisualizerProps } from './types'

interface CytoscapeContainerProps extends TopologyVisualizerProps {
  onNodeCreate?: (node: any) => void
  onEdgeCreate?: (edge: any) => void
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
      'shape': 'triangle' as const,
    },
  },
  {
    selector: 'node[type="server"]',
    style: {
      'background-color': '#e74c3c',
      'shape': 'rectangle' as const,
    },
  },
  {
    selector: 'node[type="client"]',
    style: {
      'background-color': '#2ecc71',
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

const CytoscapeContainer: React.FC<CytoscapeContainerProps> = ({ 
  nodes, 
  edges, 
  onNodeCreate, 
  onEdgeCreate 
}) => {
  const cyRef = useRef<HTMLDivElement>(null)
  const cyInstance = useRef<Core | null>(null)

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
  useCytoscapeEvents(cyInstance.current!, { onNodeCreate, onEdgeCreate })

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
      ready: (e: { cy: { fit: () => void; center: () => void } }) => {
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

export default CytoscapeContainer
