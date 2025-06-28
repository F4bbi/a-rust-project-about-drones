import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import type { Core, ElementDefinition } from 'cytoscape';

interface TopologyVisualizerProps {
  nodes: ElementDefinition[];
  edges: ElementDefinition[];
}

const TopologyVisualizer: React.FC<TopologyVisualizerProps> = ({ nodes, edges }) => {
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<Core | null>(null);

  useEffect(() => {
    if (!cyRef.current) return;

    // Initialize Cytoscape
    cyInstance.current = cytoscape({
      container: cyRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'color': 'white',
            'text-outline-color': '#666',
            'text-outline-width': 2,
            'width': '40px',
            'height': '40px'
          }
        },
        {
          selector: 'node[type="drone"]',
          style: {
            'background-color': '#3498db',
            'shape': 'triangle'
          }
        },
        {
          selector: 'node[type="server"]',
          style: {
            'background-color': '#e74c3c',
            'shape': 'rectangle'
          }
        },
        {
          selector: 'node[type="client"]',
          style: {
            'background-color': '#2ecc71',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'circle',
        radius: 100
      }
    });

    // Cleanup function
    return () => {
      if (cyInstance.current) {
        cyInstance.current.destroy();
      }
    };
  }, [nodes, edges]);

  return (
    <div 
      ref={cyRef} 
      style={{ 
        width: '100%', 
        height: '100%'
      }} 
    />
  );
};

export default TopologyVisualizer;
