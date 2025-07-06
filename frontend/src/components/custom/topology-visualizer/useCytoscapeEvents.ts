import { useEffect, useRef } from "react";
import type { Core } from "cytoscape";
import { useToolbarStore } from "@/stores/toolbarStore";
import { createNode, createEdge } from "./api";
import { sendMessage } from "./messageApi";

interface CytoscapeEventsOptions {
  onNodeCreate?: (node: any) => void;
  onEdgeCreate?: (edge: any) => void;
  onNodeSelect?: (nodeData: any) => void;
}

export function useCytoscapeEvents(
  cy: Core,
  options: CytoscapeEventsOptions = {},
) {
  const {
    activeTool,
    selectedNodeType,
    selectedSpecificNode,
    addCreatedNode,
    resetToolbar,

    // Message-related state
    selectedMessageType,
    messageFormData,
    isSelectingNodes,
    selectedFromNode,
    setSelectedFromNode,
    resetMessageState,
  } = useToolbarStore();

  const toolRef = useRef(activeTool);
  const nodeTypeRef = useRef(selectedNodeType);
  const specificNodeRef = useRef(selectedSpecificNode);
  const selectedNodeForEdge = useRef<string | null>(null);

  // Sync toolbar state refs
  useEffect(() => {
    toolRef.current = activeTool;
    // Reset edge selection when switching tools
    if (cy) {
      selectedNodeForEdge.current = null;
      cy.nodes().removeClass("selected");
    }
  }, [activeTool, cy]);

  useEffect(() => {
    nodeTypeRef.current = selectedNodeType;
    // Reset edge selection when switching node types
    if (cy) {
      selectedNodeForEdge.current = null;
      cy.nodes().removeClass("selected");
    }
  }, [selectedNodeType, cy]);

  useEffect(() => {
    specificNodeRef.current = selectedSpecificNode;
  }, [selectedSpecificNode]);

  useEffect(() => {
    if (!cy) return;

    const handleTap = async (event: any) => {
      const currentTool = toolRef.current;
      const currentNodeType = nodeTypeRef.current;
      const currentSpecificNode = specificNodeRef.current;

      if (!cy) return;

      // Handle node selection when clicking on existing nodes (only in cursor/move mode)
      if (event.target !== cy && event.target.isNode && event.target.isNode()) {
        const clickedNode = event.target;

        // Only allow node selection in cursor/move mode
        if (currentTool === "cursor") {
          const nodeData = {
            id: clickedNode.id(),
            type: clickedNode.data("type"),
            label: clickedNode.data("label"),
            position: clickedNode.position(),
          };
          options.onNodeSelect?.(nodeData);
          return;
        }

        // Handle message node selection
        if (currentTool === "message" && isSelectingNodes) {
          const nodeId = clickedNode.id();

          if (!selectedFromNode) {
            // First node selection
            setSelectedFromNode(nodeId);
            // Add visual feedback - highlight the selected node
            cy.nodes().removeClass("selected");
            clickedNode.addClass("selected");
            console.log(`Selected source node for message: ${nodeId}`);
          } else if (selectedFromNode === nodeId) {
            // Click on the same node: deselect it
            setSelectedFromNode(null);
            cy.nodes().removeClass("selected");
            console.log("Source node deselected");
            return;
          } else {
            // Second node selection - send the message
            const fromId = selectedFromNode;
            const toId = nodeId;

            try {
              // Send message via API
              const result = await sendMessage(
                selectedMessageType!,
                fromId,
                toId,
                messageFormData,
              );

              console.log("Message sent successfully:", result);
              alert(
                `Message sent successfully!\nType: ${selectedMessageType}\nFrom: ${fromId}\nTo: ${toId}`,
              );

              // Reset message state
              resetMessageState();
              cy.nodes().removeClass("selected");
            } catch (error) {
              console.error("Failed to send message:", error);
              alert(
                `Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
            }
          }
          return;
        }
      }

      // Handle edge creation when clicking on nodes
      if (
        currentTool === "plus" &&
        currentNodeType === "edge" &&
        event.target !== cy
      ) {
        const clickedNode = event.target;

        if (clickedNode.isNode && clickedNode.isNode()) {
          const nodeId = clickedNode.id();

          if (selectedNodeForEdge.current === null) {
            // First node selection
            selectedNodeForEdge.current = nodeId;
            // Add visual feedback - highlight the selected node
            cy.nodes().removeClass("selected");
            clickedNode.addClass("selected");
            console.log(`Selected first node for edge: ${nodeId}`);
          } else if (selectedNodeForEdge.current === nodeId) {
            // Click on the same node: deselect it
            selectedNodeForEdge.current = null;
            cy.nodes().removeClass("selected");
            console.log("Node deselected");
            return;
          } else {
            // Second node selection - create the edge
            const fromId = selectedNodeForEdge.current;
            const toId = nodeId;

            try {
              // Create edge via API
              const result = await createEdge(fromId, toId);

              if (result.success) {
                // Add edge to Cytoscape
                const edgeId = `edge-${fromId}-${toId}`;
                cy.add({
                  group: "edges",
                  data: {
                    id: edgeId,
                    source: fromId,
                    target: toId,
                  },
                });

                console.log("Edge created successfully:", result.message);
                options.onEdgeCreate?.({ fromId, toId, edgeId });
              }
            } catch (error) {
              console.error("Failed to create edge:", error);
              alert(
                `Failed to create edge: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
            }

            // Reset selection regardless of success/failure
            selectedNodeForEdge.current = null;
            cy.nodes().removeClass("selected");
          }
        }
        return;
      }

      // Handle node creation when clicking on empty canvas
      if (
        currentTool === "plus" &&
        currentNodeType &&
        currentNodeType !== "edge" &&
        event.target === cy
      ) {
        // Check if we have all required selections for node creation
        if (!currentSpecificNode && currentNodeType !== "drone") {
          alert("Please select a specific node from the toolbar first!");
          return;
        }

        const position = event.position;

        try {
          // Create node via API
          const result = await createNode(
            currentNodeType,
            currentSpecificNode?.name || undefined,
          );

          let nodeSubType = "drone";
          if (
            currentSpecificNode?.name
              .toLocaleLowerCase()
              .includes("communication")
          )
            nodeSubType = "communication";
          else if (
            currentSpecificNode?.name.toLocaleLowerCase().includes("content")
          )
            nodeSubType = "content";
          else if (
            currentSpecificNode?.name.toLocaleLowerCase().includes("web")
          )
            nodeSubType = "web";
          else if (
            currentSpecificNode?.name.toLocaleLowerCase().includes("chat")
          )
            nodeSubType = "chat";

          console.log(
            "AAAAAAAAAAAAAAAAaAAAAAAAAAAAA",
            currentSpecificNode?.name,
            nodeSubType,
          );

          // Add node to Cytoscape with the ID from the backend
          const nodeId = result.id.toString();
          const capitalizedType =
            currentNodeType.charAt(0).toUpperCase() + currentNodeType.slice(1);
          cy.add({
            group: "nodes",
            data: {
              id: nodeId,
              label: `${capitalizedType} ${result.id}`,
              type: currentNodeType,
              subtype: nodeSubType,
            },
            position,
          });

          // Add to store for tracking
          addCreatedNode({
            id: result.id,
            type: currentNodeType,
            name: `${capitalizedType}${result.id}`,
            subtype: nodeSubType,
            position,
          });

          // Reset toolbar selections
          resetToolbar();

          console.log("Node created successfully:", result.message);
          options.onNodeCreate?.({
            nodeId,
            nodeType: currentNodeType,
            position,
          });
        } catch (error) {
          console.error("Failed to create node:", error);
          alert(
            `Failed to create node: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }
    };

    cy.on("tap", handleTap);

    return () => {
      cy.removeListener("tap", handleTap);
    };
  }, [cy, addCreatedNode, resetToolbar, options]);
}
