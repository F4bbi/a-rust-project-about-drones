import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import cytoscape, { type Core, type StylesheetJson } from "cytoscape";
import { useCytoscapeEvents } from "./useCytoscapeEvents";
import type { TopologyVisualizerProps } from "./types";

interface CytoscapeContainerProps extends TopologyVisualizerProps {
  onNodeCreate?: (node: any) => void;
  onEdgeCreate?: (edge: any) => void;
}

export interface CytoscapeContainerRef {
  removeEdge: (fromNodeId: string, toNodeId: string) => void;
  removeNode: (nodeId: string) => void;
}

const cytoscapeStyles: StylesheetJson | Promise<StylesheetJson> = [
  {
    selector: "node",
    style: {
      "background-color": "#666",
      label: "data(label)",
      "text-valign": "center" as const,
      "text-halign": "center" as const,
      "font-size": "12px",
      color: "white",
      "text-outline-color": "#3d3c3c",
      "text-outline-width": 2,
      width: "40px",
      height: "40px",
    },
  },
  {
    selector: 'node[type="drone"]',
    style: {
      "background-image": "url(/drone.png)",
      "background-width": "40px",
      "background-height": "40px",
      "background-clip": "none",
      "border-width": 0,
      "background-opacity": 0,
    },
  },
  {
    selector: 'node[subtype="content"]',
    style: {
      "background-image": "url(/content_server.png)",
      "background-width": "40px",
      "background-height": "40px",
      "background-clip": "none",
      "border-width": 0,
      "background-opacity": 0,
    },
  },
  {
    selector: 'node[subtype="communication"]',
    style: {
      "background-image": "url(/communication_server.png)",
      "background-width": "40px",
      "background-height": "40px",
      "background-clip": "none",
      "border-width": 0,
      "background-opacity": 0,
    },
  },
  {
    selector: 'node[subtype="chat"]',
    style: {
      "background-image": "url(/chat_client.png)",
      "background-width": "40px",
      "background-height": "40px",
      "background-clip": "none",
      "border-width": 0,
      "background-opacity": 0,
    },
  },
  {
    selector: 'node[subtype="web"]',
    style: {
      "background-image": "url(/web_client.png)",
      "background-width": "40px",
      "background-height": "40px",
      "background-clip": "none",
      "border-width": 0,
      "background-opacity": 0,
    },
  },
  {
    selector: "node.selected",
    style: {
      "border-width": 3,
      "border-color": "#ff6b35",
      "border-style": "solid" as const,
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#ccc",
      "curve-style": "bezier" as const,
    },
  },
];

const CytoscapeContainer = forwardRef<
  CytoscapeContainerRef,
  CytoscapeContainerProps
>(({ nodes, edges, onNodeCreate, onEdgeCreate, onNodeSelect }, ref) => {
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<Core | null>(null);

  // Function to remove edge from Cytoscape
  const removeEdgeFromGraph = (fromNodeId: string, toNodeId: string) => {
    const cy = cyInstance.current;
    if (!cy) return;

    // Find and remove edges between the two nodes (bidirectional)
    const edgesToRemove = cy.edges().filter((edge) => {
      const source = edge.source().id();
      const target = edge.target().id();

      return (
        (source == fromNodeId && target == toNodeId) ||
        (source == toNodeId && target == fromNodeId)
      );
    });

    for (const edge of edgesToRemove) {
      edge.remove();
    }

    console.log(
      `Removed ${edgesToRemove.length} edge(s) between ${fromNodeId} and ${toNodeId}`,
    );
  };

  const removeNodeFromGraph = (nodeId: string) => {
    const cy = cyInstance.current;
    if (!cy) return;

    // Find and remove the node
    const node = cy.getElementById(nodeId);
    if (node.length > 0) {
      node.remove();
      console.log(`Node ${nodeId} removed`);
    } else {
      console.warn(`Node ${nodeId} not found`);
    }
  };

  // Expose the edge removal function via ref
  useImperativeHandle(ref, () => ({
    removeEdge: removeEdgeFromGraph,
    removeNode: removeNodeFromGraph,
  }));

  // Initialize Cytoscape once
  useEffect(() => {
    if (!cyRef.current || cyInstance.current) return;

    const cy = cytoscape({
      container: cyRef.current,
      elements: [],
      style: cytoscapeStyles,
    });

    cyInstance.current = cy;
  }, []);

  // Register events
  useCytoscapeEvents(cyInstance.current!, {
    onNodeCreate,
    onEdgeCreate,
    onNodeSelect,
  });

  // Update elements when props change
  useEffect(() => {
    const cy = cyInstance.current;
    if (!cy) return;

    const layoutConfig = {
      name: "circle",
      radius: 150,
      handleDisconnected: true,
      animate: true,
      avoidOverlap: true,
      infinite: false,
      ready: (e: {
        cy: {
          fit: () => void;
          center: () => void;
          zoom: (level: number) => void;
        };
      }) => {
        e.cy.fit();
        e.cy.center();
      },
    };

    cy.elements().remove();
    cy.add([...nodes, ...edges]);
    cy.layout(layoutConfig).run();
  }, [nodes, edges]);

  return <div ref={cyRef} style={{ width: "100%", height: "100%" }} />;
});

CytoscapeContainer.displayName = "CytoscapeContainer";

export default CytoscapeContainer;
