import React from 'react';
import { useLrgmStore } from '@/store/useLrgmStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Mail, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AnalyticsDashboard = () => {
  const { contacts, campaigns, activities } = useLrgmStore();

  // Calculate KPIs
  const contactsByCategory = contacts.reduce((acc, contact) => {
    acc[contact.category] = (acc[contact.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const activitiesThisMonth = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear;
  }).length;

  const campaignsSentYTD = campaigns.filter(campaign => {
    const campaignDate = new Date(campaign.datePlanned);
    return campaignDate.getFullYear() === currentYear && campaign.status === 'SENT';
  }).length;

  // Prepare chart data - last 6 months of activities
  const getMonthlyActivityData = () => {
    const monthlyData: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = 0;
    }

    // Count activities by month
    activities.forEach(activity => {
      const activityDate = new Date(activity.date);
      const monthKey = `${monthNames[activityDate.getMonth()]} ${activityDate.getFullYear()}`;
      if (monthKey in monthlyData) {
        monthlyData[monthKey]++;
      }
    });

    return {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          label: 'Activities',
          data: Object.values(monthlyData),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Activity Count',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your business relationships and activities
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {contactsByCategory.CLIENT || 0} clients, {contactsByCategory.PARTNER || 0} partners, {contactsByCategory.PROSPECT || 0} prospects
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities This Month</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activitiesThisMonth}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Total activities: {activities.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Sent YTD</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignsSentYTD}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Total campaigns: {campaigns.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0 
                ? Math.round((campaigns.filter(c => c.status === 'COMPLETED').length / campaigns.length) * 100)
                : 0
              }%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Campaign completion rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Types */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['EMAIL', 'CALL', 'MEETING', 'EVENT'].map(type => {
              const count = activities.filter(a => a.type === type).length;
              
              return (
                <div key={type} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{type.toLowerCase()}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 