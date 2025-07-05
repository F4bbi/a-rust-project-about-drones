import React, { useState, useRef, useCallback } from 'react'
import { X, FileText } from 'lucide-react'

interface LogsSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const LogsSidebar: React.FC<LogsSidebarProps> = ({ isOpen, onClose }) => {
  const [width, setWidth] = useState(400) // Default width
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true)
    
    const startX = mouseDownEvent.clientX
    const startWidth = width

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const newWidth = startWidth - (mouseMoveEvent.clientX - startX)
      // Minimum width of 300px, maximum width of 80% of screen
      const minWidth = 300
      const maxWidth = window.innerWidth * 0.8
      setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth))
    }

    const stopDrag = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', doDrag)
      document.removeEventListener('mouseup', stopDrag)
    }

    document.addEventListener('mousemove', doDrag)
    document.addEventListener('mouseup', stopDrag)
  }, [width])

  if (!isOpen) return null

  return (
    <div 
      ref={sidebarRef}
      className="fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-20 transform transition-transform duration-300 flex"
      style={{ width: `${width}px` }}
    >
      {/* Resize handle */}
      <div
        className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors duration-200 flex-shrink-0"
        onMouseDown={startResizing}
        style={{ cursor: isResizing ? 'col-resize' : 'col-resize' }}
      />
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Logs
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content area - currently blank */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-gray-500 dark:text-gray-400 text-center mt-8">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Logs will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogsSidebar
