'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  login: (token: string, userData: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Setup axios defaults
axios.defaults.baseURL = API_URL

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('reviewmaster_token')
    if (token) {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Try to refresh token and get user info
      axios.post('/auth/refresh', { token })
        .then(response => {
          const { token: newToken, user: userData } = response.data
          localStorage.setItem('reviewmaster_token', newToken)
          setUser(userData)
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('reviewmaster_token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('reviewmaster_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    toast.success('Successfully signed in!')
  }

  const logout = () => {
    localStorage.removeItem('reviewmaster_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('Successfully signed out')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}