import React from 'react'
import { MessageCircle, FileText, Server, MailOpen } from 'lucide-react'
import PopupArrow from './PopupArrow'

interface SendMessageMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isSubMenuOpen: boolean
  onSubMenuOpenChange: (open: boolean) => void
  selectedRequestType: 'server' | 'chat' | 'content' | null
  onRequestTypeSelect: (type: 'server' | 'chat' | 'content') => void
  children: React.ReactNode
}

const requestTypes = [
  { id: 'server', label: 'Server Type', icon: Server },
  { id: 'chat', label: 'Chat Request', icon: MessageCircle },
  { id: 'content', label: 'Content Request', icon: FileText },
]

const chatRequests = [
  { id: 'join', label: 'Join' },
  { id: 'leave', label: 'Leave' },
  { id: 'send-message', label: 'Send Message' },
  { id: 'create', label: 'Create' },
  { id: 'delete', label: 'Delete' },
  { id: 'get-chats', label: 'Get Chats' },
  { id: 'get-messages', label: 'Get Messages' },
]

const contentRequests = [
  { id: 'list-public-files', label: 'List Public Files' },
  { id: 'get-public-file', label: 'Get Public File' },
  { id: 'write-public-file', label: 'Write Public File' },
  { id: 'list-private-files', label: 'List Private Files' },
  { id: 'get-private-file', label: 'Get Private File' },
  { id: 'write-private-file', label: 'Write Private File' },
]

const SendMessageMenu: React.FC<SendMessageMenuProps> = ({ 
  isOpen, 
  onOpenChange,
  isSubMenuOpen,
  onSubMenuOpenChange,
  selectedRequestType,
  onRequestTypeSelect,
  children 
}) => {
  const handleRequestTypeClick = (requestType: 'server' | 'chat' | 'content') => {
    if (requestType === 'server') {
      // ServerType doesn't have sub-options, so handle it directly
      console.log('Selected: Server Type')
      onOpenChange(false)
      // TODO: Implement server type request logic
    } else {
      // Chat and Content requests have sub-menus
      onRequestTypeSelect(requestType)
      onSubMenuOpenChange(true)
    }
  }

  const handleSpecificRequestClick = (request: any) => {
    const requestTypeLabel = selectedRequestType === 'chat' ? 'Chat Request' : 'Content Request'
    console.log(`Selected: ${requestTypeLabel} - ${request.label}`)
    onOpenChange(false)
    onSubMenuOpenChange(false)
    // TODO: Implement specific request logic
  }

  const getCurrentRequests = () => {
    return selectedRequestType === 'chat' ? chatRequests : contentRequests
  }

  return (
    <div className="relative">
      <div onClick={() => onOpenChange(!isOpen)}>
        {children}
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <PopupArrow />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-max">
            <div className="flex items-center space-x-2">
              {requestTypes.map((requestType) => (
                <button
                  key={requestType.id}
                  onClick={() => handleRequestTypeClick(requestType.id as 'server' | 'chat' | 'content')}
                  className={`
                    group relative p-3 rounded-lg transition-all duration-200
                    ${selectedRequestType === requestType.id 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                  title={requestType.label}
                >
                  <requestType.icon className="h-5 w-5" />
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                      {requestType.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-menu for specific requests */}
      {isSubMenuOpen && selectedRequestType && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-16 z-50">
          <PopupArrow />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-max">
            <div className="flex items-center space-x-1">
              {getCurrentRequests().map((request) => (
                <button
                  key={request.id}
                  onClick={() => handleSpecificRequestClick(request)}
                  className="group relative p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  title={request.label}
                >
                  <MailOpen className="h-5 w-5" />
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                      {request.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SendMessageMenu
