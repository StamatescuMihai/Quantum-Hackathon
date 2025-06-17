import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Server, Activity } from 'lucide-react'
import { checkApiHealth } from '../services/api'

const BackendStatus = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [apiInfo, setApiInfo] = useState(null)
  const [error, setError] = useState('')

  const checkConnection = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Add a small delay to allow backend to start
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const healthData = await checkApiHealth()
      setIsConnected(true)
      setApiInfo(healthData)
    } catch (err) {
      setIsConnected(false)
      setError(err.response?.data?.detail || err.message || 'Connection failed')
      setApiInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2 text-white/60 text-sm"
      >
        <Activity className="w-4 h-4 animate-pulse" />
        <span>Checking backend...</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 text-sm"
    >
      {isConnected ? (
        <>
          <div className="flex items-center space-x-1 text-green-400">
            <Server className="w-4 h-4" />
          </div>
          <span className="text-white/80">
            Backend Connected
          </span>
        </>
      ) : (
        <>
          <div className="flex items-center space-x-1 text-red-400">
            <Server className="w-4 h-4" />
          </div>
          <span className="text-white/80">
            Backend Offline
          </span>
        </>
      )}
    </motion.div>
  )
}

export default BackendStatus
