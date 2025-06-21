import { useLrgmStore } from '@/store/useLrgmStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, Mail, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { contacts, campaigns, activities } = useLrgmStore();

  // Get upcoming activities (next 7 days)
  const upcomingActivities = activities
    .filter(activity => {
      const activityDate = new Date(activity.date);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return activityDate >= today && activityDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Get active campaigns
  const activeCampaigns = campaigns.filter(c => c.status === 'LIVE').slice(0, 3);

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome to BizDev</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Your business relationship management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        {/* Upcoming Activities */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Next 7 days
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
              <Link to="/timeline">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingActivities.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {upcomingActivities.map(activity => (
                  <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-accent/50">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {activity.type === 'EMAIL' && <Mail className="h-4 w-4 text-primary" />}
                          {activity.type === 'CALL' && <Clock className="h-4 w-4 text-primary" />}
                          {activity.type === 'LUNCH' && <Users className="h-4 w-4 text-primary" />}
                          {activity.type === 'EVENT' && <Calendar className="h-4 w-4 text-primary" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm md:text-base">{activity.summary}</div>
                        <div className="text-sm text-muted-foreground">
                          {getContactName(activity.contactId)}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-left sm:text-right">
                      <div className="text-sm font-medium">{formatDate(activity.date)}</div>
                      <div className="text-xs text-muted-foreground">{formatTime(activity.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No upcoming events</p>
                <Button asChild size="sm" className="mt-2">
                  <Link to="/timeline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Mail className="h-5 w-5" />
                Active Campaigns
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Currently running
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
              <Link to="/campaigns">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeCampaigns.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {activeCampaigns.map(campaign => (
                  <div key={campaign.id} className="p-4 rounded-lg bg-accent/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h4 className="font-medium text-sm md:text-base">{campaign.title}</h4>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-100 w-fit">
                        {campaign.channel}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="block sm:inline">{campaign.audienceIds.length} contacts</span>
                      <span className="hidden sm:inline"> • </span>
                      <span className="block sm:inline">Planned: {new Date(campaign.datePlanned).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active campaigns</p>
                <Button asChild size="sm" className="mt-2">
                  <Link to="/campaigns">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get started with common tasks
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-4 md:p-6 flex-col gap-2">
              <Link to="/contacts">
                <Users className="h-6 w-6 md:h-8 md:w-8" />
                <span className="text-sm md:text-base font-medium">Add Contact</span>
                <span className="text-xs opacity-75 text-center">Manage your network</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 md:p-6 flex-col gap-2">
              <Link to="/campaigns">
                <Mail className="h-6 w-6 md:h-8 md:w-8" />
                <span className="text-sm md:text-base font-medium">Create Campaign</span>
                <span className="text-xs opacity-75 text-center">Launch new outreach</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 md:p-6 flex-col gap-2 sm:col-span-2 lg:col-span-1">
              <Link to="/timeline">
                <Calendar className="h-6 w-6 md:h-8 md:w-8" />
                <span className="text-sm md:text-base font-medium">Log Activity</span>
                <span className="text-xs opacity-75 text-center">Track interactions</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 