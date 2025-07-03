import React, { useState } from 'react'
import { X, Trash2 } from 'lucide-react'

interface NodeDetailsProps {
  node: any
  onClose: () => void
  onRemoveEdge?: (fromNodeId: string, toNodeId: string) => void
}

const NodeDetailsSidebar: React.FC<NodeDetailsProps> = ({ node, onClose, onRemoveEdge }) => {
  if (!node) return null

  // Initial mock data for neighbors - replace with real data from your backend
  const initialNeighbors = [
    { id: '10', label: 'Server 10', type: 'server' },
    { id: '3', label: 'Drone 3', type: 'drone' },
    { id: '4', label: 'Client 4', type: 'client' },
  ]

  // State to manage neighbors list
  const [neighbors, setNeighbors] = useState(initialNeighbors)

  // Mock statistics - replace with real data
  const statistics = {
    packetsSent: 1247,
    packetsDropped: 23
  }

  const handleRemoveNeighbor = (neighborId: string) => {
    console.log(`Remove connection between ${node.id} and ${neighborId}`)
    
    // Remove neighbor from UI immediately
    setNeighbors(prevNeighbors => 
      prevNeighbors.filter(neighbor => neighbor.id !== neighborId)
    )
    
    // Remove edge from Cytoscape graph
    onRemoveEdge?.(node.id, neighborId)
    
    // TODO: Implement actual edge removal logic here
    // Example: await removeEdgeAPI(node.id, neighborId)
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-20 transform transition-transform duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {node.label}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 h-full overflow-y-auto">
        {/* Neighbors Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Connected Neighbors ({neighbors.length})
          </h3>
          <div className="space-y-2">
            {neighbors.length > 0 ? (
              neighbors.map((neighbor) => (
                <div
                  key={neighbor.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      neighbor.type === 'drone' ? 'bg-blue-500' :
                      neighbor.type === 'server' ? 'bg-red-500' :
                      'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {neighbor.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {neighbor.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveNeighbor(neighbor.id)}
                    className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                    title="Remove connection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No connected neighbors
              </p>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Statistics
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Packets Sent
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {statistics.packetsSent.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Packets Dropped
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {statistics.packetsDropped.toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Success Rate */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Success Rate
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {(((statistics.packetsSent - statistics.packetsDropped) / statistics.packetsSent) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((statistics.packetsSent - statistics.packetsDropped) / statistics.packetsSent) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NodeDetailsSidebar
