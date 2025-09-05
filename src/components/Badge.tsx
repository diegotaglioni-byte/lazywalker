import React from 'react'

interface BadgeData {
  type: string
  emoji: string
  name: string
  description: string
}

interface BadgeProps {
  badge: BadgeData
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ badge, className = '' }) => {
  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'FIRST_WALK':
        return 'bg-blue-100 text-blue-800'
      case 'WEEK_STREAK':
        return 'bg-yellow-100 text-yellow-800'
      case 'MONTH_STREAK':
        return 'bg-green-100 text-green-800'
      case 'TOTAL_WALKS_10':
        return 'bg-orange-100 text-orange-800'
      case 'TOTAL_WALKS_50':
        return 'bg-purple-100 text-purple-800'
      case 'TOTAL_WALKS_100':
        return 'bg-pink-100 text-pink-800'
      case 'TOTAL_MINUTES_100':
        return 'bg-indigo-100 text-indigo-800'
      case 'TOTAL_MINUTES_500':
        return 'bg-teal-100 text-teal-800'
      case 'TOTAL_MINUTES_1000':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const color = getBadgeColor(badge.type)

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color} ${className}`}>
      <span className="mr-1">{badge.emoji}</span>
      {badge.name}
    </div>
  )
}
