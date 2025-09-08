import { Building, Users, UserCheck, Settings, LogOut, Files, Shield } from 'lucide-react'

const Navigation = ({ activeTab, setActiveTab, user, onLogout }) => {
  // A simple helper for button styles
  const getButtonClass = (tabName) => {
    return activeTab === tabName 
      ? 'bg-gray-200 text-gray-900' 
      : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">StaffManager</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${getButtonClass('dashboard')}`}
            >
              <Building className="h-4 w-4" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${getButtonClass('candidates')}`}
            >
              <Users className="h-4 w-4" />
              Candidates
            </button>
            
            {user && user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${getButtonClass('admin')}`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}
            
            {user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
                <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                <button 
                  onClick={onLogout}
                  title="Logout"
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
