
import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className={`border-r transition-all ${sidebarCollapsed ? "w-14" : "w-64"}`}>
        <div className={`flex items-center h-14 ${sidebarCollapsed ? "justify-center" : "justify-between px-4"} border-b`}>
          {!sidebarCollapsed && (
            <h1 className="font-semibold tracking-tight text-lg">
              ParkingMS
            </h1>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1"
          >
            {sidebarCollapsed ? "→" : "←"}
          </Button>
        </div>
        
        <div className="py-4">
          <nav className="space-y-1 px-2">
            <NavLink 
              to="/dashboard"
              end
              className={({isActive}) => 
                `flex items-center ${isActive ? 'bg-muted' : ''} px-2 py-2 text-base rounded-md`
              }
            >
              <span className="mr-3">📊</span>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </NavLink>
            
            <NavLink 
              to="/dashboard/vehicles"
              className={({isActive}) => 
                `flex items-center ${isActive ? 'bg-muted' : ''} px-2 py-2 text-base rounded-md`
              }
            >
              <span className="mr-3">🚗</span>
              {!sidebarCollapsed && <span>Vehicles</span>}
            </NavLink>
            
            <NavLink 
              to="/dashboard/requests"
              className={({isActive}) => 
                `flex items-center ${isActive ? 'bg-muted' : ''} px-2 py-2 text-base rounded-md`
              }
            >
              <span className="mr-3">📋</span>
              {!sidebarCollapsed && <span>Requests</span>}
            </NavLink>
            
            {user?.role === 'admin' && (
              <>
                <NavLink 
                  to="/dashboard/slots"
                  className={({isActive}) => 
                    `flex items-center ${isActive ? 'bg-muted' : ''} px-2 py-2 text-base rounded-md`
                  }
                >
                  <span className="mr-3">🅿️</span>
                  {!sidebarCollapsed && <span>Parking Slots</span>}
                </NavLink>
                
                <NavLink 
                  to="/dashboard/users"
                  className={({isActive}) => 
                    `flex items-center ${isActive ? 'bg-muted' : ''} px-2 py-2 text-base rounded-md`
                  }
                >
                  <span className="mr-3">👥</span>
                  {!sidebarCollapsed && <span>Users</span>}
                </NavLink>
                
                <NavLink 
                  to="/dashboard/logs"
                  className={({isActive}) => 
                    `flex items-center ${isActive ? 'bg-muted' : ''} px-2 py-2 text-base rounded-md`
                  }
                >
                  <span className="mr-3">📝</span>
                  {!sidebarCollapsed && <span>Logs</span>}
                </NavLink>
              </>
            )}
            
            <NavLink 
              to="/dashboard/profile"
              className={({isActive}) => 
                `flex items-center ${isActive ? 'bg-muted' : ''} px-2 py-2 text-base rounded-md`
              }
            >
              <span className="mr-3">👤</span>
              {!sidebarCollapsed && <span>Profile</span>}
            </NavLink>
            
            <NavLink 
              to="/dashboard/settings"
              className={({isActive}) => 
                `flex items-center ${isActive ? 'bg-muted' : ''} px-2 py-2 text-base rounded-md`
              }
            >
              <span className="mr-3">⚙️</span>
              {!sidebarCollapsed && <span>Settings</span>}
            </NavLink>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-base rounded-md hover:bg-muted"
            >
              <span className="mr-3">🚪</span>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </nav>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="border-b h-14 flex items-center justify-between px-4">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">
              {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user?.name || "User"} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
