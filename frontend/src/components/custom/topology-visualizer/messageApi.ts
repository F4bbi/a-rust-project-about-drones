// API functions for sending messages
export const sendMessage = async (messageType: string, fromId: string, toId: string, formData: any = {}) => {
  const endpoint = getMessageEndpoint(messageType);
  
  const payload = {
    from_id: fromId,
    to_id: toId,
    ...formData
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    case 'server-type':
      return '/api/messages/server-type';
    case 'join':
      return '/api/messages/join';
    case 'leave':
      return '/api/messages/leave';
    case 'send-message':
      return '/api/messages/send-message';
    case 'create':
      return '/api/messages/create';
    case 'delete':
      return '/api/messages/delete';
    case 'get-chats':
      return '/api/messages/get-chats';
    case 'get-messages':
      return '/api/messages/get-messages';
    case 'list-public-files':
      return '/api/messages/list-public-files';
    case 'get-public-file':
      return '/api/messages/get-public-file';
    case 'write-public-file':
      return '/api/messages/write-public-file';
    case 'list-private-files':
      return '/api/messages/list-private-files';
    case 'get-private-file':
      return '/api/messages/get-private-file';
    case 'write-private-file':
      return '/api/messages/write-private-file';
    default:
      throw new Error(`Unknown message type: ${messageType}`);
  }
};

// API functions for drone-specific operations
export const setDronePacketDropRate = async (droneId: string, dropRate: number) => {
  const response = await fetch(`/api/drones/${droneId}/packet-drop-rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ drop_rate: dropRate }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const crashDrone = async (droneId: string) => {
  const response = await fetch(`/api/drones/${droneId}/crash`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
