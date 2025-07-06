import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MessageFormData {
  chatId?: number;
  password?: string;
  message?: string;
  name?: string;
  isPublic?: boolean;
  fileName?: string;
  fileContent?: string;
}

interface MessageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MessageFormData) => void;
  messageType:
    | "join"
    | "leave"
    | "send-message"
    | "create"
    | "delete"
    | "get-chats"
    | "get-messages"
    | "list-public-files"
    | "get-public-file"
    | "write-public-file"
    | "list-private-files"
    | "get-private-file"
    | "write-private-file"
    | "server-type"
    | string;
}

const MessageForm: React.FC<MessageFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  messageType,
}) => {
  const [formData, setFormData] = useState<MessageFormData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (field: keyof MessageFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getFormTitle = () => {
    switch (messageType) {
      case "join":
        return "Join Chat";
      case "leave":
        return "Leave Chat";
      case "send-message":
        return "Send Message";
      case "create":
        return "Create Chat";
      case "delete":
        return "Delete Chat";
      case "get-chats":
        return "Get Chats";
      case "get-messages":
        return "Get Messages";
      case "get-public-file":
        return "Get Public File";
      case "write-public-file":
        return "Write Public File";
      case "list-private-files":
        return "List Private Files";
      case "get-private-file":
        return "Get Private File";
      case "write-private-file":
        return "Write Private File";
      case "server-type":
        return "Server Type Message";
      case "list-public-files":
        return "List Public Files";
      default:
        return "Message Details";
    }
  };

  const getFormDescription = () => {
    switch (messageType) {
      case "join":
        return "Enter the chat ID and password to join the chat.";
      case "leave":
        return "Enter the chat ID to leave the chat.";
      case "send-message":
        return "Enter the chat ID and message content to send.";
      case "create":
        return "Enter the chat details to create a new chat.";
      case "delete":
        return "Enter the chat ID to delete the chat.";
      case "get-chats":
        return "Get chats doesn't require additional parameters.";
      case "get-messages":
        return "Enter the chat ID to get messages from.";
      case "get-public-file":
        return "Enter the file name to retrieve the public file.";
      case "write-public-file":
        return "Enter the file name and content to write a public file.";
      case "list-private-files":
        return "List private files doesn't require additional parameters.";
      case "get-private-file":
        return "Enter the file name to retrieve the private file.";
      case "write-private-file":
        return "Enter the file name and content to write a private file.";
      case "server-type":
        return "Server type messages don't require additional parameters.";
      case "list-public-files":
        return "List public files doesn't require additional parameters.";
      default:
        return "Fill in the required information for this message type.";
    }
  };

  const renderFormFields = () => {
    switch (messageType) {
      case "join":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="chatId"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Chat ID
              </label>
              <input
                id="chatId"
                type="number"
                value={formData.chatId || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("chatId", parseInt(e.target.value) || 0)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter chat ID"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("password", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
        );
      case "leave":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="chatId"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Chat ID
              </label>
              <input
                id="chatId"
                type="number"
                value={formData.chatId || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("chatId", parseInt(e.target.value) || 0)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter chat ID"
                required
              />
            </div>
          </div>
        );
      case "send-message":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="chatId"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Chat ID
              </label>
              <input
                id="chatId"
                type="number"
                value={formData.chatId || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("chatId", parseInt(e.target.value) || 0)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter chat ID"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Message
              </label>
              <textarea
                id="message"
                value={formData.message || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateFormData("message", e.target.value)
                }
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your message"
                rows={3}
                required
              />
            </div>
          </div>
        );
      case "create":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Chat Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("name", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter chat name"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isPublic"
                type="checkbox"
                checked={formData.isPublic || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("isPublic", e.target.checked)
                }
                className="h-4 w-4 rounded border-input bg-transparent"
              />
              <label
                htmlFor="isPublic"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Public Chat
              </label>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="createPassword"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password (optional)
              </label>
              <input
                id="createPassword"
                type="password"
                value={formData.password || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("password", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter password (optional)"
              />
            </div>
          </div>
        );
      case "delete":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="chatId"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Chat ID
              </label>
              <input
                id="chatId"
                type="number"
                value={formData.chatId || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("chatId", parseInt(e.target.value) || 0)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter chat ID"
                required
              />
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive font-medium">⚠️ Warning</p>
              <p className="text-sm text-destructive mt-1">
                This action will permanently delete the chat and cannot be
                undone.
              </p>
            </div>
          </div>
        );
      case "get-messages":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="chatId"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Chat ID
              </label>
              <input
                id="chatId"
                type="number"
                value={formData.chatId || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("chatId", parseInt(e.target.value) || 0)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter chat ID"
                required
              />
            </div>
          </div>
        );
      case "get-public-file":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fileName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                File Name
              </label>
              <input
                id="fileName"
                type="text"
                value={formData.fileName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("fileName", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter file name"
                required
              />
            </div>
          </div>
        );
      case "write-public-file":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fileName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                File Name
              </label>
              <input
                id="fileName"
                type="text"
                value={formData.fileName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("fileName", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter file name"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="fileContent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                File Content
              </label>
              <textarea
                id="fileContent"
                value={formData.fileContent || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateFormData("fileContent", e.target.value)
                }
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter file content"
                rows={5}
                required
              />
            </div>
          </div>
        );
      case "get-private-file":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fileName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                File Name
              </label>
              <input
                id="fileName"
                type="text"
                value={formData.fileName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("fileName", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter file name"
                required
              />
            </div>
          </div>
        );
      case "write-private-file":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fileName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                File Name
              </label>
              <input
                id="fileName"
                type="text"
                value={formData.fileName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("fileName", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter file name"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="fileContent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                File Content
              </label>
              <textarea
                id="fileContent"
                value={formData.fileContent || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateFormData("fileContent", e.target.value)
                }
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter file content"
                rows={5}
                required
              />
            </div>
          </div>
        );
      case "list-private-files":
        return (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              List private files doesn't require additional parameters.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll be able to select the source and destination nodes after
              clicking Continue.
            </p>
          </div>
        );
      case "get-chats":
        return (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Get chats doesn't require additional parameters.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll be able to select the source and destination nodes after
              clicking Continue.
            </p>
          </div>
        );
      case "server-type":
        return (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Server type messages don't require additional parameters.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll be able to select the source and destination nodes after
              clicking Continue.
            </p>
          </div>
        );
      case "list-public-files":
        return (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              List public files doesn't require additional parameters.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll be able to select the source and destination nodes after
              clicking Continue.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getFormTitle()}</DialogTitle>
          <DialogDescription>{getFormDescription()}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageForm;
export type { MessageFormData };
