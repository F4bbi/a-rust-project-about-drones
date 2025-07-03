import React, { useState } from 'react'
import { Play, Square } from 'lucide-react'
import ControlButton from './ControlButton'

interface ControlBarProps {
  onPlay?: () => void
  onStop?: () => void
}

const ControlBar: React.FC<ControlBarProps> = ({ onPlay, onStop }) => {
  const [isRunning, setIsRunning] = useState(false)

  const handlePlay = () => {
    if (!isRunning) {
      setIsRunning(true)
      onPlay?.()
      console.log('Simulation started')
    }
  }

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false)
      onStop?.()
      console.log('Simulation stopped')
    }
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10 pb-5">
      <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-6 py-3">
        <ControlButton
          onClick={handlePlay}
          disabled={isRunning}
          variant="play"
          title={isRunning ? "Simulation is running" : "Start simulation"}
        >
          <Play className="w-5 h-5" />
        </ControlButton>
        
        <ControlButton
          onClick={handleStop}
          disabled={!isRunning}
          variant="stop"
          title={!isRunning ? "Simulation is not running" : "Stop simulation"}
        >
          <Square className="w-5 h-5" />
        </ControlButton>
      </div>
    </div>
  )
}

export default ControlBar
