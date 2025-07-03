import type { ElementDefinition } from 'cytoscape'

export interface TopologyVisualizerProps {
  nodes: ElementDefinition[]
  edges: ElementDefinition[]
  onNodeSelect?: (nodeData: any) => void
}
