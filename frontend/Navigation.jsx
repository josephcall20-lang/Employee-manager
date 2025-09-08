import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Building, Users, UserCheck, Settings, LogOut, Files, Shield } from 'lucide-react'

const Navigation = ({ activeTab, setActiveTab, user, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">StaffManager</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2"
            >
              <Building className="h-4 w-4" />
              Dashboard
            </Button>
            
            <Button
              variant={activeTab === 'candidates' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('candidates')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Candidates
            </Button>
            
            <Button
              variant={activeTab === 'employees' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('employees')}
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Employees
            </Button>

            <Button
              variant={activeTab === 'files' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('files')}
              className="flex items-center gap-2"
            >
              <Files className="h-4 w-4" />
              Files
            </Button>

            {user && user.role === 'admin' && (
              <Button
                variant={activeTab === 'admin' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            
            {user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
                <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

