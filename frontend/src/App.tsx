import { useEffect, useState } from 'react'
import './App.css'
import TopologyVisualizer from './TopologyVisualizer'
import type { ElementDefinition } from 'cytoscape'

function App() {
  const [topology, setTopology] = useState<{nodes: ElementDefinition[], edges: ElementDefinition[]}>({
    nodes: [],
    edges: []
  })

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

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <TopologyVisualizer nodes={topology.nodes} edges={topology.edges} />
    </div>
  )
}

export default App
