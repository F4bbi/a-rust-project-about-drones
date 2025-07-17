import { buildApiUrl } from "@/lib/api";

export const getBackendNodeType = (
  nodeType: string,
  nodeName: string | undefined,
) => {
  switch (nodeType) {
    case "drone":
      return {
        node_type: "drone",
        sub_type: nodeName?.toLowerCase().replace(/\s+/g, "") || undefined,
      };
    case "server":
      return {
        node_type: "server",
        sub_type: (nodeName || "communication")
          .toLowerCase()
          .includes("communication")
          ? "communication"
          : "content",
      };
    case "client":
      return {
        node_type: "client",
        sub_type: (nodeName || "web").toLowerCase().includes("web")
          ? "web"
          : "chat",
      };
    default:
      return null;
  }
};

export const createNode = async (
  nodeType: string,
  nodeName: string | undefined,
) => {
  const backendNodeType = getBackendNodeType(nodeType, nodeName);
  if (!backendNodeType) throw new Error("Invalid node type");
  const response = await fetch(buildApiUrl("nodes"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendNodeType),
  });
  if (!response.ok)
    throw new Error(`Failed to create node: ${response.statusText}`);
  const data = await response.json();
  return {
    id: data.id,
    message: data.message,
    nodeType,
    nodeName,
  };
};

export const createEdge = async (fromId: string, toId: string) => {
  const response = await fetch(buildApiUrl("edges"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from_id: parseInt(fromId), to_id: parseInt(toId) }),
  });
  if (!response.ok)
    throw new Error(`Failed to create edge: ${response.statusText}`);
  const data = await response.json();
  return {
    success: true,
    message: data.message || `Edge created from ${fromId} to ${toId}`,
  };
};
