import { useLrgmStore } from '@/store/useLrgmStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Mail, TrendingUp } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { contacts, campaigns, activities } = useLrgmStore();

  // Calculate KPIs

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const activitiesThisMonth = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear;
  }).length;

  const campaignsSentYTD = campaigns.filter(campaign => {
    const campaignDate = new Date(campaign.datePlanned);
    return campaignDate.getFullYear() === currentYear && campaign.status === 'CLOSED';
  }).length;



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
              All contacts
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
                ? Math.round((campaigns.filter(c => c.status === 'CLOSED').length / campaigns.length) * 100)
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
            {['EMAIL', 'CALL', 'LUNCH', 'EVENT'].map(type => {
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