
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import OverviewStats from '@/components/dashboard/OverviewStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {Link} from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's an overview of your parking management system.
          </p>
        </div>
        
        <OverviewStats />
        
        <div className="grid gap-6 md:grid-cols-2">
          <RecentActivity />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/dashboard/vehicles"
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <div className="p-2 rounded-full bg-primary/10 text-primary mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">My Vehicles</span>
                </Link>
                <Link
                  to="/dashboard/requests"
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <div className="p-2 rounded-full bg-primary/10 text-primary mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M11 12H3" />
                      <path d="m16 6-4 6 4 6" />
                      <path d="M21 12h-4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Request Slot</span>
                </Link>
                
                {isAdmin && (
                  <>
                    <Link
                      to="/dashboard/slots"
                      className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-primary/10 text-primary mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <circle cx="12" cy="12" r="8" />
                          <path d="M12 8v4" />
                          <path d="M9 12h3" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Add Slots</span>
                    </Link>
                    <Link
                      to="/dashboard/requests"
                      className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-primary/10 text-primary mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <path d="m9 11 3 3L22 4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Manage Requests</span>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
