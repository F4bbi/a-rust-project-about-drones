import { buildApiUrl } from "@/lib/api";

// API functions for sending messages
export const sendMessage = async (
  messageType: string,
  fromId: string,
  toId: string,
  formData: any = {},
) => {
  const payload = {
    from_id: fromId,
    to_id: toId,
    ...formData,
  };

  const response = await fetch(buildApiUrl(getMessageEndpoint(messageType)), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const getMessageEndpoint = (messageType: string): string => {
  switch (messageType) {
    case "server-type":
      return "messages/server-type";
    case "join":
      return "messages/join";
    case "leave":
      return "messages/leave";
    case "send-message":
      return "messages/send-message";
    case "create":
      return "messages/create";
    case "delete":
      return "messages/delete";
    case "get-chats":
      return "messages/get-chats";
    case "get-messages":
      return "messages/get-messages";
    case "list-public-files":
      return "messages/list-public-files";
    case "get-public-file":
      return "messages/get-public-file";
    case "write-public-file":
      return "messages/write-public-file";
    case "list-private-files":
      return "messages/list-private-files";
    case "get-private-file":
      return "messages/get-private-file";
    case "write-private-file":
      return "messages/write-private-file";
    default:
      throw new Error(`Unknown message type: ${messageType}`);
  }
};

// API functions for drone-specific operations
export const setDronePacketDropRate = async (
  droneId: string,
  dropRate: number,
) => {
  const response = await fetch(buildApiUrl(`drone/${droneId}/pdr`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pdr: dropRate }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const crashDrone = async (droneId: string) => {
  const response = await fetch(buildApiUrl(`node/${droneId}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
