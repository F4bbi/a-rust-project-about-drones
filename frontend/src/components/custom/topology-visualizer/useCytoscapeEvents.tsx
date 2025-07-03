import { useEffect, useRef } from 'react'
import type { Core } from 'cytoscape'
import { useToolbarStore } from '../../../stores/toolbarStore'
import { createNode, createEdge } from './api'

interface CytoscapeEventsOptions {
  onNodeCreate?: (node: any) => void
  onEdgeCreate?: (edge: any) => void
}

export function useCytoscapeEvents(cy: Core, options: CytoscapeEventsOptions = {}) {
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
  const selectedNodeForEdge = useRef<string | null>(null)

  // Sync toolbar state refs
  useEffect(() => {
    toolRef.current = activeTool
    // Reset edge selection when switching tools
    if (cy) {
      selectedNodeForEdge.current = null
      cy.nodes().removeClass('selected')
    }
  }, [activeTool, cy])

  useEffect(() => {
    nodeTypeRef.current = selectedNodeType
    // Reset edge selection when switching node types
    if (cy) {
      selectedNodeForEdge.current = null
      cy.nodes().removeClass('selected')
    }
  }, [selectedNodeType, cy])

  useEffect(() => {
    specificNodeRef.current = selectedSpecificNode
  }, [selectedSpecificNode])

  useEffect(() => {
    if (!cy) return

    const handleTap = async (event: any) => {
      const currentTool = toolRef.current
      const currentNodeType = nodeTypeRef.current
      const currentSpecificNode = specificNodeRef.current
      
      if (!cy) return

      // Handle edge creation when clicking on nodes
      if (currentTool === 'plus' && currentNodeType === 'edge' && event.target !== cy) {
        const clickedNode = event.target
        
        if (clickedNode.isNode && clickedNode.isNode()) {
          const nodeId = clickedNode.id()
          
          if (selectedNodeForEdge.current === null) {
            // First node selection
            selectedNodeForEdge.current = nodeId
            // Add visual feedback - highlight the selected node
            cy.nodes().removeClass('selected')
            clickedNode.addClass('selected')
            console.log(`Selected first node for edge: ${nodeId}`)
          } else if (selectedNodeForEdge.current === nodeId) {
            // Click on the same node: deselect it
            selectedNodeForEdge.current = null
            cy.nodes().removeClass('selected')
            console.log('Node deselected')
            return
          } else {
            // Second node selection - create the edge
            const fromId = selectedNodeForEdge.current
            const toId = nodeId
            
            try {
              // Create edge via API
              const result = await createEdge(fromId, toId)
              
              if (result.success) {
                // Add edge to Cytoscape
                const edgeId = `edge-${fromId}-${toId}`
                cy.add({
                  group: 'edges',
                  data: {
                    id: edgeId,
                    source: fromId,
                    target: toId
                  }
                })
                
                console.log('Edge created successfully:', result.message)
                options.onEdgeCreate?.({ fromId, toId, edgeId })
              }
            } catch (error) {
              console.error('Failed to create edge:', error)
              alert(`Failed to create edge: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
            
            // Reset selection regardless of success/failure
            selectedNodeForEdge.current = null
            cy.nodes().removeClass('selected')
          }
        }
        return
      }

      // Handle node creation when clicking on empty canvas
      if (currentTool === 'plus' && currentNodeType && currentNodeType !== 'edge' && event.target === cy) {
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
          cy.add({
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
          options.onNodeCreate?.({ nodeId, nodeType: currentNodeType, position })
        } catch (error) {
          console.error('Failed to create node:', error)
          alert(`Failed to create node: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    cy.on('tap', handleTap)
    
    return () => {
      cy.removeListener('tap', handleTap)
    }
  }, [cy, addCreatedNode, resetToolbar, options])
}
