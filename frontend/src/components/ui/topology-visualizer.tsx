import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import type { Core, ElementDefinition } from 'cytoscape'
import { useToolbarStore } from '../../stores/toolbarStore'

interface TopologyVisualizerProps {
  nodes: ElementDefinition[]
  edges: ElementDefinition[]
}

const TopologyVisualizer: React.FC<TopologyVisualizerProps> = ({ nodes, edges }) => {
  const cyRef = useRef<HTMLDivElement>(null)
  const cyInstance = useRef<Core | null>(null)
  const { activeTool } = useToolbarStore()
  const toolRef = useRef(activeTool)

  // 1. Init cytoscape solo UNA volta
  useEffect(() => {
    if (!cyRef.current || cyInstance.current) return

    const cy = cytoscape({
      container: cyRef.current,
      elements: [], // vuoto all'inizio
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            color: 'white',
            'text-outline-color': '#666',
            'text-outline-width': 2,
            width: '40px',
            height: '40px',
          },
        },
        {
          selector: 'node[type="drone"]',
          style: {
            'background-color': '#3498db',
            shape: 'triangle',
          },
        },
        {
          selector: 'node[type="server"]',
          style: {
            'background-color': '#e74c3c',
            shape: 'rectangle',
          },
        },
        {
          selector: 'node[type="client"]',
          style: {
            'background-color': '#2ecc71',
            shape: 'ellipse',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#ccc',
            'curve-style': 'bezier',
          },
        },
      ],
    })

    cyInstance.current = cy

    // Register tap event
    cy.on('tap', (event) => {
      const currentTool = toolRef.current
      if (!cyInstance.current) return

      if (currentTool === 'plus' && event.target === cyInstance.current) {
        const position = event.position
        const id = `node-${Date.now()}`
        cyInstance.current.add({
          group: 'nodes',
          data: { id, label: id, type: 'client' },
          position,
        })
      }
    })
  }, [])

  // 2. Update elementi se cambiano
  useEffect(() => {
    const cy = cyInstance.current
    if (!cy) return

    cy.elements().remove()
    cy.add([...nodes, ...edges])
    cy.layout({ name: 'circle', radius: 150 }).run()
  }, [nodes, edges])

  // 3. Sync tool state
  useEffect(() => {
    toolRef.current = activeTool
  }, [activeTool])

  return (
    <div
      ref={cyRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export default TopologyVisualizer
