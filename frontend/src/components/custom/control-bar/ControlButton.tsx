import React from 'react'

interface ControlButtonProps {
  onClick: () => void
  disabled?: boolean
  variant: 'play' | 'stop'
  children: React.ReactNode
  title?: string
}

const ControlButton: React.FC<ControlButtonProps> = ({ 
  onClick, 
  disabled = false, 
  variant, 
  children, 
  title 
}) => {
  const getButtonStyles = () => {
    const baseStyles = "flex items-center justify-center p-3 rounded-lg font-medium text-sm transition-all duration-200 w-11 h-11"
    
    if (disabled) {
      return `${baseStyles} bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed`
    }
    
    if (variant === 'play') {
      return `${baseStyles} bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl active:scale-95`
    } else {
      return `${baseStyles} bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl active:scale-95`
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonStyles()}
      title={title}
    >
      {children}
    </button>
  )
}

export default ControlButton
