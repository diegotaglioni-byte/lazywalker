import React from 'react'

interface ProgressBarProps {
  progress: number // 0-100
  className?: string
  showPercentage?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  showPercentage = false
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-right text-sm text-gray-600 mt-1">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  )
}
