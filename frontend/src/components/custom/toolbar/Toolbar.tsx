import { MousePointer, Plus, MailPlus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useToolbarStore, type Tool } from '@/stores/toolbarStore'
import ToolButton from '@/components/custom/toolbar/ToolButton'
import NodeTypeMenu from '@/components/custom/toolbar/NodeTypeMenu'
import SendMessageMenu from '@/components/custom/toolbar/SendMessageMenu'
import MessageForm, { type MessageFormData } from '@/components/custom/message/MessageForm'

const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: 'cursor', icon: MousePointer, label: 'Move' },
  { id: 'plus', icon: Plus, label: 'Add' },
  { id: 'message', icon: MailPlus, label: 'Send Message' },
]

const Toolbar: React.FC = () => {
  const { 
    activeTool, 
    setActiveTool,
    selectedNodeType, 
    setSelectedNodeType,
    selectedSpecificNode,
    setSelectedSpecificNode,
    availableNodes,
    setAvailableNodes,
    
    // Message-related state
    selectedMessageType,
    setSelectedMessageType,
    setMessageFormData,
    setIsSelectingNodes
  } = useToolbarStore()

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isNodeMenuOpen, setIsNodeMenuOpen] = useState(false)
  const [isSendMessageMenuOpen, setIsSendMessageMenuOpen] = useState(false)
  const [isRequestSubMenuOpen, setIsRequestSubMenuOpen] = useState(false)
  const [selectedRequestType, setSelectedRequestType] = useState<'server' | 'chat' | 'content' | null>(null)
  const [isMessageFormOpen, setIsMessageFormOpen] = useState(false)

  // Fetch available nodes when component mounts
  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        setAvailableNodes(data.nodes)
      })
      .catch(err => console.error('Error fetching nodes:', err))
  }, [setAvailableNodes])

  // Handle tool changes and cleanup menu states
  const handleToolChange = (toolId: Tool) => {
    setActiveTool(toolId)
    
    // Close all menus when switching tools
    if (toolId !== 'plus') {
      setIsAddMenuOpen(false)
      setIsNodeMenuOpen(false)
    }
    if (toolId !== 'message') {
      setIsSendMessageMenuOpen(false)
      setIsRequestSubMenuOpen(false)
      setSelectedRequestType(null)
    }
  }

  // Handle node type selection from the popup
  const handleNodeTypeClick = (nodeType: typeof selectedNodeType) => {
    setSelectedNodeType(nodeType)
    // For edge type, we don't need the popover to stay open
    if (nodeType === 'edge') {
      setIsAddMenuOpen(false)
    } else {
      // For other node types, open the specific node menu
      setIsNodeMenuOpen(true)
    }
  }

  // Handle add menu changes
  const handleAddMenuChange = (isOpen: boolean) => {
    setIsAddMenuOpen(isOpen)
    if (!isOpen) {
      // Close sub-menu when main menu closes
      setIsNodeMenuOpen(false)
    }
  }

  // Handle specific node selection
  const handleSpecificNodeClick = (node: typeof availableNodes[0]) => {
    setSelectedSpecificNode(node)
    setIsNodeMenuOpen(false)
  }

  // Handle request type selection from the send message menu
  const handleRequestTypeClick = (requestType: 'server' | 'chat' | 'content') => {
    setSelectedRequestType(requestType)
    if (requestType !== 'server') {
      // Only set sub-menu open for chat and content (server doesn't have sub-options)
      setIsRequestSubMenuOpen(true)
    }
  }

  // Handle send message menu changes
  const handleSendMessageMenuChange = (isOpen: boolean) => {
    setIsSendMessageMenuOpen(isOpen)
    if (!isOpen) {
      // Close sub-menu when main menu closes
      setIsRequestSubMenuOpen(false)
      setSelectedRequestType(null)
    }
  }

  // Handle message type selection
  const handleMessageTypeSelect = (messageType: string) => {
    setSelectedMessageType(messageType)
    
    // For server-type, get-chats, list-public-files, and list-private-files messages, we can skip the form and go straight to node selection
    if (messageType === 'server-type' || messageType === 'get-chats' || messageType === 'list-public-files' || messageType === 'list-private-files') {
      setActiveTool('message')
      setIsSelectingNodes(true)
      setMessageFormData({})
    } else {
      // For other messages, open the form
      setIsMessageFormOpen(true)
    }
  }

  // Handle message form submission
  const handleMessageFormSubmit = (formData: MessageFormData) => {
    setMessageFormData(formData)
    setIsMessageFormOpen(false)
    setActiveTool('message')
    setIsSelectingNodes(true)
  }

  // Handle message form close
  const handleMessageFormClose = () => {
    setIsMessageFormOpen(false)
    setSelectedMessageType(null)
    setSelectedRequestType(null)
  }

  return (
    <div className="flex flex-col items-center justify-start">
      {/* Main Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 mb-8 transition-all duration-300">
        <div className="flex items-center space-x-2">
          {tools.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={activeTool === tool.id}
              onClick={() => handleToolChange(tool.id)}
            >
              {tool.id === 'plus' ? (
                <NodeTypeMenu
                  isOpen={isAddMenuOpen}
                  onOpenChange={handleAddMenuChange}
                  selectedNodeType={selectedNodeType}
                  selectedSpecificNode={selectedSpecificNode}
                  availableNodes={availableNodes}
                  isNodeMenuOpen={isNodeMenuOpen}
                  onNodeMenuOpenChange={setIsNodeMenuOpen}
                  onNodeTypeSelect={handleNodeTypeClick}
                  onSpecificNodeSelect={handleSpecificNodeClick}
                >
                  <button
                    onClick={() => handleToolChange(tool.id)}
                    className={`
                      relative p-3 rounded-xl transition-all duration-200 group
                      ${activeTool === tool.id 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }
                    `}
                    title={tool.label}
                  >
                    <tool.icon className="h-6 w-6" />
                    
                    {/* Active indicator */}
                    {activeTool === tool.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                        {tool.label}
                      </div>
                    </div>
                  </button>
                </NodeTypeMenu>
              ) : tool.id === 'message' ? (
                <SendMessageMenu
                  isOpen={isSendMessageMenuOpen}
                  onOpenChange={handleSendMessageMenuChange}
                  isSubMenuOpen={isRequestSubMenuOpen}
                  onSubMenuOpenChange={setIsRequestSubMenuOpen}
                  selectedRequestType={selectedRequestType}
                  onRequestTypeSelect={handleRequestTypeClick}
                  onMessageTypeSelect={handleMessageTypeSelect}
                >
                  <button
                    onClick={() => handleToolChange(tool.id)}
                    className={`
                      relative p-3 rounded-xl transition-all duration-200 group
                      ${activeTool === tool.id 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }
                    `}
                    title={tool.label}
                  >
                    <tool.icon className="h-6 w-6" />
                    
                    {/* Active indicator */}
                    {activeTool === tool.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                        {tool.label}
                      </div>
                    </div>
                  </button>
                </SendMessageMenu>
              ) : null}
            </ToolButton>
          ))}
        </div>
      </div>

      {/* Message Form */}
      <MessageForm
        isOpen={isMessageFormOpen}
        onClose={handleMessageFormClose}
        onSubmit={handleMessageFormSubmit}
        messageType={selectedMessageType || ''}
      />
    </div>
  )
}

export default Toolbar