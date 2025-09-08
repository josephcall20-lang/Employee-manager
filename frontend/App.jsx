import { useState, useEffect } from 'react'
import Navigation from './components/Navigation.jsx'
import Dashboard from './components/Dashboard.jsx'
import CandidateManagement from './components/CandidateManagement.jsx'
import EmployeeManagement from './components/EmployeeManagement.jsx'
import SimpleFileManager from './components/SimpleFileManager.jsx'
import SimpleAdminPanel from './components/SimpleAdminPanel.jsx'
import SimpleLogin from './components/SimpleLogin.jsx'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.log('Not authenticated')
    }
  }

  const handleLogin = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    setActiveTab('dashboard')
  }

  if (!isAuthenticated) {
    return <SimpleLogin onLogin={handleLogin} />
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard token={token} user={user} />
      case 'candidates':
        return <CandidateManagement token={token} user={user} />
      case 'employees':
        return <EmployeeManagement token={token} user={user} />
      case 'files':
        return <SimpleFileManager token={token} user={user} />
      case 'admin':
        return user?.role === 'admin' ? <SimpleAdminPanel token={token} user={user} /> : <Dashboard token={token} user={user} />
      default:
        return <Dashboard token={token} user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Staff Management System</h1>
            <p className="text-gray-600 mb-8">Comprehensive platform for managing candidates and employees</p>
            
            <div className="mb-4">
              <span className="text-sm text-gray-500">Logged in as: </span>
              <span className="font-medium">{user?.username}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {user?.role}
              </span>
            </div>
            
            {renderActiveComponent()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

