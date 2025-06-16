import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Zap, ArrowRight } from 'lucide-react'

const AlgorithmCard = ({ 
  title, 
  description, 
  complexity, 
  difficulty, 
  estimatedTime, 
  link, 
  color = "from-quantum-500 to-quantum-700" 
}) => {
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner': return 'text-green-400'
      case 'Intermediate': return 'text-yellow-400'
      case 'Advanced': return 'text-red-400'
      default: return 'text-white'
    }
  }

  return (
    <Link to={link} className="group">
      <div className="quantum-card h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-quantum-500/20">
        {/* Header with gradient */}
        <div className={`h-2 w-[120] bg-gradient-to-r ${color} rounded-t-xl -mt-6 -mx-6 mb-4`} />
        
        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-quantum-300 transition-colors">
              {title}
            </h3>
            <p className="text-white/70 mt-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Complexity</span>
              <span className="complexity-badge">{complexity}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <Users className="w-4 h-4" />
                <span>Difficulty</span>
              </div>
              <span className={`text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <Clock className="w-4 h-4" />
                <span>Est. Time</span>
              </div>
              <span className="text-sm text-white/80">
                {estimatedTime}
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-quantum-300 group-hover:text-quantum-200 transition-colors">
              <span className="font-medium">Explore Algorithm</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AlgorithmCard
