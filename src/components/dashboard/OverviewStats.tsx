
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      {trend && (
        <CardFooter className="p-2">
          <span className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value} {trend.positive ? '↑' : '↓'}
          </span>
        </CardFooter>
      )}
    </Card>
  );
};

const OverviewStats = () => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Vehicles"
        value="14"
        description="Registered in the system"
        icon="🚗"
        trend={{ value: "10%", positive: true }}
      />
      <StatCard
        title="Available Slots"
        value="42"
        description="Ready for assignment"
        icon="🅿️"
      />
      <StatCard
        title="Pending Requests"
        value="7"
        description="Awaiting approval"
        icon="📋"
        trend={{ value: "5%", positive: false }}
      />
      <StatCard
        title="Active Users"
        value="28"
        description="Using the system"
        icon="👥"
      />
    </div>
  );
};

export default OverviewStats;
