import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import type { Core, ElementDefinition } from 'cytoscape'
import { useToolbarStore } from '../../stores/toolbarStore'

// Map frontend node types to backend NodeType structure
const getBackendNodeType = (nodeType: string, nodeName: string) => {
  switch (nodeType) {
    case 'drone':
      return {
        'node_type': 'drone',
        'sub_type': nodeName.toLowerCase().replace(/\s+/g, '')
      }
    case 'server':
      return {
        'node_type': 'server',
        'sub_type': nodeName.toLowerCase().includes('Communication') ? 'communication' : 'content'
      }
    case 'client':
      return {
        'node_type': 'client',
        'sub_type': nodeName.toLowerCase().includes('Web') ? 'web' : 'chat'
      }
    default:
      return null
  }
}

const createNode = async (nodeType: string, nodeName: string) => {
  const backendNodeType = getBackendNodeType(nodeType, nodeName)
  if (!backendNodeType) {
    throw new Error('Invalid node type')
  }
  console.log(JSON.stringify(backendNodeType))
  const response = await fetch('/api/nodes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendNodeType),
  })

  if (!response.ok) {
    throw new Error(`Failed to create node: ${response.statusText}`)
  }

  const data = await response.json()
  return {
    id: data.id,
    message: data.message,
    nodeType: nodeType,
    nodeName: nodeName
  }
}

interface TopologyVisualizerProps {
  nodes: ElementDefinition[]
  edges: ElementDefinition[]
}

const TopologyVisualizer: React.FC<TopologyVisualizerProps> = ({ nodes, edges }) => {
  const cyRef = useRef<HTMLDivElement>(null)
  const cyInstance = useRef<Core | null>(null)
  const { 
    activeTool, 
    selectedNodeType, 
    selectedSpecificNode,
    addCreatedNode,
    resetToolbar
  } = useToolbarStore()
  const toolRef = useRef(activeTool)
  const nodeTypeRef = useRef(selectedNodeType)
  const specificNodeRef = useRef(selectedSpecificNode)
  
  // State for edge creation
  const selectedNodeForEdge = useRef<string | null>(null)

  // Function to create edge via API
  const createEdge = async (fromId: string, toId: string) => {
    try {
      console.log(fromId)
      const response = await fetch('/api/edges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_id: parseInt(fromId),
          to_id: parseInt(toId)
        }),
      })
      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to create edge: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        message: data.message || `Edge created from ${fromId} to ${toId}`
      }
    } catch (error) {
      throw new Error(`Failed to create edge: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

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
          selector: 'node.selected',
          style: {
            'border-width': 3,
            'border-color': '#ff6b35',
            'border-style': 'solid',
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
    cy.on('tap', async (event) => {
      const currentTool = toolRef.current
      const currentNodeType = nodeTypeRef.current
      const currentSpecificNode = specificNodeRef.current
      
      if (!cyInstance.current) return

      // Handle edge creation when clicking on nodes
      if (currentTool === 'plus' && currentNodeType === 'edge' && event.target !== cyInstance.current) {
        const clickedNode = event.target
        
        if (clickedNode.isNode && clickedNode.isNode()) {
          const nodeId = clickedNode.id()
          
          if (selectedNodeForEdge.current === null) {
            // First node selection
            selectedNodeForEdge.current = nodeId
            // Add visual feedback - highlight the selected node
            cyInstance.current.nodes().removeClass('selected')
            clickedNode.addClass('selected')
            console.log(`Selected first node for edge: ${nodeId}`)
          } else {
            // Second node selection - create the edge
            const fromId = selectedNodeForEdge.current
            const toId = nodeId
            
            if (fromId === toId) {
              alert('Cannot create an edge from a node to itself!')
              // Reset selection
              selectedNodeForEdge.current = null
              cyInstance.current.nodes().removeClass('selected')
              return
            }
            
            try {
              // Create edge via API
              const result = await createEdge(fromId, toId)
              
              if (result.success) {
                // Add edge to Cytoscape
                const edgeId = `edge-${fromId}-${toId}`
                cyInstance.current.add({
                  group: 'edges',
                  data: {
                    id: edgeId,
                    source: fromId,
                    target: toId
                  }
                })
                
                console.log('Edge created successfully:', result.message)
              }
            } catch (error) {
              console.error('Failed to create edge:', error)
              alert(`Failed to create edge: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
            
            // Reset selection regardless of success/failure
            selectedNodeForEdge.current = null
            cyInstance.current.nodes().removeClass('selected')
          }
        }
        return
      }

      // Handle node creation when clicking on empty canvas
      if (currentTool === 'plus' && currentNodeType && currentNodeType !== 'edge' && event.target === cyInstance.current) {
        // Check if we have all required selections for node creation
        if (!currentSpecificNode) {
          alert('Please select a specific node from the toolbar first!')
          return
        }

        const position = event.position
        
        try {
          // Create node via API
          const result = await createNode(currentNodeType, currentSpecificNode.name)
          
          // Add node to Cytoscape with the ID from the backend
          const nodeId = result.id.toString()
          cyInstance.current.add({
            group: 'nodes',
            data: { 
              id: nodeId, 
              label: `${currentSpecificNode.name} ${result.id}`,
              type: currentNodeType
            },
            position,
          })

          // Add to store for tracking
          addCreatedNode({
            id: result.id,
            type: currentNodeType,
            name: currentSpecificNode.name,
            position
          })

          // Reset toolbar selections
          resetToolbar()
          
          console.log('Node created successfully:', result.message)
        } catch (error) {
          console.error('Failed to create node:', error)
          alert(`Failed to create node: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    })
  }, [])

  // 2. Update elementi se cambiano
  useEffect(() => {
    const cy = cyInstance.current
    if (!cy) return
    const layoutConfig = {
      name: "circle",
      radius:150,
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

  // 3. Sync tool state and reset edge selection when tool changes
  useEffect(() => {
    toolRef.current = activeTool
    // Reset edge selection when switching tools
    if (cyInstance.current) {
      selectedNodeForEdge.current = null
      cyInstance.current.nodes().removeClass('selected')
    }
  }, [activeTool])

  // Sync node type state and reset edge selection when node type changes
  useEffect(() => {
    nodeTypeRef.current = selectedNodeType
    // Reset edge selection when switching node types
    if (cyInstance.current) {
      selectedNodeForEdge.current = null
      cyInstance.current.nodes().removeClass('selected')
    }
  }, [selectedNodeType])

  // Sync specific node state
  useEffect(() => {
    specificNodeRef.current = selectedSpecificNode
  }, [selectedSpecificNode])

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
