import React, { useState } from 'react';
import { Activity } from '@/lib/types';
import { useLrgmStore } from '@/store/useLrgmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, Clock, User, Mail, Phone, MessageSquare, Users } from 'lucide-react';

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
          <label className="text-sm font-medium">Contact</label>
          <select 
            className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
            value={formData.contactId}
            onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
            required
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.firstName} {contact.lastName} - {contact.category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Type</label>
          <select 
            className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Activity['type'] }))}
          >
            <option value="EMAIL">Email</option>
            <option value="CALL">Call</option>
            <option value="MEETING">Meeting</option>
            <option value="EVENT">Event</option>
          </select>
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
          className="w-full mt-1 p-2 border rounded-md bg-blue-50 text-blue-900 placeholder-blue-600"
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Activity Timeline</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingActivity(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </DialogTitle>
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
    </div>
  );
}; 