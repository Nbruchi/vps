
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  userName: string;
}

const mockLogs: ActivityLog[] = [
  {
    id: "1",
    userId: "1",
    action: "Created parking slot A-001",
    timestamp: "2023-01-01T08:00:00Z",
    userName: "Admin User",
  },
  {
    id: "2",
    userId: "2",
    action: "Registered vehicle ABC-123",
    timestamp: "2023-05-15T10:30:00Z",
    userName: "Regular User",
  },
  {
    id: "3",
    userId: "2",
    action: "Requested parking slot for vehicle ABC-123",
    timestamp: "2023-05-15T10:30:00Z",
    userName: "Regular User",
  },
  {
    id: "4",
    userId: "1",
    action: "Approved parking request for vehicle ABC-123",
    timestamp: "2023-05-15T10:35:00Z",
    userName: "Admin User",
  },
  {
    id: "5",
    userId: "2",
    action: "Registered vehicle XYZ-789",
    timestamp: "2023-06-20T14:45:00Z",
    userName: "Regular User",
  },
];

const RecentActivity = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  
  useEffect(() => {
    // In a real application, this would be an API call
    setLogs(mockLogs.slice(0, 5));
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start">
              <div className="mr-4 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{log.action}</p>
                <p className="text-sm text-muted-foreground">
                  By {log.userName} • {formatDate(log.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
