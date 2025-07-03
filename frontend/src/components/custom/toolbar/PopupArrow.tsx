import React from 'react'

interface PopupArrowProps {
  className?: string
}

const PopupArrow: React.FC<PopupArrowProps> = ({ className }) => {
  return (
    <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45 ${className || ''}`} />
  )
}

export default PopupArrow
