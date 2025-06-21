import React, { useState } from 'react';
import { Activity } from '@/lib/types';
import { useLrgmStore } from '@/store/useLrgmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Clock, User, Mail, Phone, MessageSquare, Users, Calendar, List } from 'lucide-react';

const ActivityCard = ({ activity }: { activity: Activity }) => {
  const { contacts } = useLrgmStore();
  const contact = contacts.find(c => c.id === activity.contactId);
  
  const typeIcons = {
    EMAIL: <Mail className="w-4 h-4" />,
    CALL: <Phone className="w-4 h-4" />,
    MEETING: <MessageSquare className="w-4 h-4" />,
    EVENT: <Users className="w-4 h-4" />,
  };

  const typeColors = {
    EMAIL: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    CALL: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    MEETING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    EVENT: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${typeColors[activity.type]}`}>
              {typeIcons[activity.type]}
              <span>{activity.type}</span>
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <CardTitle className="text-lg">{activity.summary}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-2" />
            {contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact'}
            {contact?.org && ` - ${contact.org}`}
          </div>
          {activity.details && (
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {activity.details}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityForm = ({ 
  activity, 
  onSave, 
  onCancel 
}: { 
  activity?: Activity; 
  onSave: (data: Omit<Activity, 'id'>) => void;
  onCancel: () => void;
}) => {
  const { contacts } = useLrgmStore();
  const [formData, setFormData] = useState({
    contactId: activity?.contactId || '',
    date: activity?.date || new Date().toISOString().slice(0, 16),
    type: activity?.type || 'EMAIL' as Activity['type'],
    summary: activity?.summary || activity?.details || '',
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: new Date(formData.date).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Contact</label>
          <div className="relative">
            <select 
              className="w-full p-3 border rounded-lg bg-background text-foreground appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.contactId}
              onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
              required
            >
              <option value="">Select a contact</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName} ({contact.category})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Type</label>
          <div className="relative">
            <select 
              className="w-full p-3 border rounded-lg bg-background text-foreground appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Activity['type'] }))}
            >
              <option value="EMAIL">📧 Email</option>
              <option value="CALL">📞 Call</option>
              <option value="MEETING">🤝 Meeting</option>
              <option value="EVENT">🎉 Event</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Date & Time</label>
        <Input 
          type="datetime-local"
          required
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea 
          className="w-full mt-1 p-3 border rounded-lg bg-background text-foreground resize-none hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          rows={4}
          required
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          placeholder="Describe what happened during this activity"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {activity ? 'Update' : 'Create'} Activity
        </Button>
      </div>
    </form>
  );
};

export const Timeline = () => {
  const { activities, addActivity } = useLrgmStore();
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Sort activities by date (newest first)
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group activities by date
  const groupedActivities = sortedActivities.reduce((groups, activity) => {
    const date = new Date(activity.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  const handleSave = (data: Omit<Activity, 'id'>) => {
    if (editingActivity) {
      // Update would be handled by the store
    } else {
      addActivity(data);
    }
    setIsDialogOpen(false);
    setEditingActivity(null);
  };

  const isToday = (dateString: string) => {
    return new Date(dateString).toDateString() === new Date().toDateString();
  };

  const isThisWeek = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date >= weekStart && date < weekEnd;
  };

  const formatDateGroup = (dateString: string) => {
    if (isToday(dateString)) return 'Today';
    if (isThisWeek(dateString)) return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

    // Generate calendar data for current month
  const generateCalendarData = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    const activitiesByDate: Record<string, Activity[]> = {};
    
    // Group activities by date for current month
    activities.forEach(activity => {
      const activityDate = new Date(activity.date);
      if (activityDate.getMonth() === month && activityDate.getFullYear() === year) {
        const dateKey = activityDate.getDate().toString();
        if (!activitiesByDate[dateKey]) {
          activitiesByDate[dateKey] = [];
        }
        activitiesByDate[dateKey].push(activity);
      }
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push({
        day,
        activities: activitiesByDate[day.toString()] || [],
        isToday: day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
      });
    }
    
    return { calendar, monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
  };

  const { calendar, monthName } = generateCalendarData();

      return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Activities</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Track your interactions and events</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingActivity(null)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl" aria-describedby="activity-dialog-description">
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </DialogTitle>
              <div id="activity-dialog-description" className="sr-only">
                {editingActivity ? 'Edit the activity details below' : 'Fill in the form to add a new activity'}
              </div>
            </DialogHeader>
            <ActivityForm
              activity={editingActivity || undefined}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingActivity(null);
              }}
            />
                      </DialogContent>
          </Dialog>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-muted rounded-lg p-1 w-full sm:w-auto">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <List className="h-4 w-4" />
              List
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setViewMode('calendar')}
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground border-b pb-2">
                {formatDateGroup(date)}
              </h3>
              <div className="space-y-3">
                {activities.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No activities yet</h3>
              <p className="text-sm text-muted-foreground">
                Start by adding your first activity to track interactions with your contacts.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold text-center">{monthName}</h3>
          
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-1 md:p-2 text-center text-xs md:text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {calendar.map((day, index) => (
              <div
                key={index}
                className={`min-h-16 md:min-h-24 p-1 md:p-2 border rounded-lg ${
                  day?.isToday ? 'bg-primary/10 border-primary' : 'bg-background'
                } ${day ? 'hover:bg-accent/50' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-xs md:text-sm font-medium mb-1 ${day.isToday ? 'text-primary' : ''}`}>
                      {day.day}
                    </div>
                    <div className="space-y-1">
                      {day.activities.slice(0, window.innerWidth < 768 ? 1 : 2).map(activity => (
                        <div
                          key={activity.id}
                          className={`text-xs p-1 rounded truncate ${
                            activity.type === 'EMAIL' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                            activity.type === 'CALL' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                            activity.type === 'MEETING' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                          }`}
                        >
                          {activity.summary}
                        </div>
                      ))}
                      {day.activities.length > (window.innerWidth < 768 ? 1 : 2) && (
                        <div className="text-xs text-muted-foreground">
                          +{day.activities.length - (window.innerWidth < 768 ? 1 : 2)} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 