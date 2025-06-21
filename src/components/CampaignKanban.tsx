import React, { useState } from 'react';
import { Campaign } from '@/lib/types';
import { useLrgmStore } from '@/store/useLrgmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Plus, Edit, Trash2, Calendar, Users } from 'lucide-react';

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const { contacts, updateCampaign, deleteCampaign } = useLrgmStore();


  const audienceContacts = contacts.filter(c => campaign.audienceIds.includes(c.id));
  
  const handleStatusChange = (newStatus: Campaign['status']) => {
    updateCampaign(campaign.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(campaign.id);
    }
  };

  const statusColors = {
    LIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  };

  const channelColors = {
    BLOG: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    NEWSLETTER: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    WEBINAR: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
    DINNER: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{campaign.title}</CardTitle>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={() => {}}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${channelColors[campaign.channel]}`}>
            {campaign.channel}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
            {campaign.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(campaign.datePlanned).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            {audienceContacts.length} contacts
          </div>
          {campaign.notes && (
            <p className="text-sm text-muted-foreground mt-2">
              {campaign.notes}
            </p>
          )}
        </div>
        
        <div className="mt-4 flex space-x-2">
          {campaign.status === 'LIVE' && (
            <Button size="sm" onClick={() => handleStatusChange('CLOSED')}>
              Close Campaign
            </Button>
          )}
          {campaign.status === 'CLOSED' && (
            <Button size="sm" onClick={() => handleStatusChange('LIVE')}>
              Reopen Campaign
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignForm = ({ 
  campaign, 
  onSave, 
  onCancel 
}: { 
  campaign?: Campaign; 
  onSave: (data: Omit<Campaign, 'id'>) => void;
  onCancel: () => void;
}) => {
  const { contacts } = useLrgmStore();
  const [formData, setFormData] = useState({
    title: campaign?.title || '',
    channel: campaign?.channel || 'NEWSLETTER' as Campaign['channel'],
    datePlanned: campaign?.datePlanned || new Date().toISOString().split('T')[0],
    status: campaign?.status || 'LIVE' as Campaign['status'],
    audienceIds: campaign?.audienceIds || [],
    notes: campaign?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      datePlanned: new Date(formData.datePlanned).toISOString(),
    });
  };

  const toggleContact = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      audienceIds: prev.audienceIds.includes(contactId)
        ? prev.audienceIds.filter(id => id !== contactId)
        : [...prev.audienceIds, contactId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input 
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Channel</label>
          <select 
            className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
            value={formData.channel}
            onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value as Campaign['channel'] }))}
          >
            <option value="BLOG">Blog</option>
            <option value="NEWSLETTER">Newsletter</option>
            <option value="WEBINAR">Webinar</option>
            <option value="DINNER">Dinner</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Planned Date</label>
          <Input 
            type="date"
            required
            value={formData.datePlanned}
            onChange={(e) => setFormData(prev => ({ ...prev, datePlanned: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select 
            className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Campaign['status'] }))}
          >
            <option value="LIVE">Live</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>



      <div>
        <label className="text-sm font-medium">Audience ({formData.audienceIds.length} selected)</label>
        <div className="mt-2 max-h-48 overflow-y-auto border rounded-md p-3 bg-background">
          {contacts.length > 0 ? (
            <div className="space-y-2">
              {contacts.map(contact => (
                <div key={contact.id} className="flex items-center space-x-3 py-1 hover:bg-accent/50 rounded px-2">
                  <input
                    type="checkbox"
                    checked={formData.audienceIds.includes(contact.id)}
                    onChange={() => toggleContact(contact.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm flex-1">
                    {contact.firstName} {contact.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {contact.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              No contacts available. Add contacts first.
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea 
          className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Add campaign details, objectives, or notes..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {campaign ? 'Update' : 'Create'} Campaign
        </Button>
      </div>
    </form>
  );
};

export const CampaignKanban = () => {
  const { campaigns, addCampaign } = useLrgmStore();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const campaignsByStatus = {
    LIVE: campaigns.filter(c => c.status === 'LIVE'),
    CLOSED: campaigns.filter(c => c.status === 'CLOSED'),
  };

  const handleSave = (data: Omit<Campaign, 'id'>) => {
    if (editingCampaign) {
      // Update handled in CampaignCard
    } else {
      addCampaign(data);
    }
    setIsDialogOpen(false);
    setEditingCampaign(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Campaign Pipeline</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCampaign(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" aria-describedby="campaign-dialog-description">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </DialogTitle>
              <div id="campaign-dialog-description" className="sr-only">
                {editingCampaign ? 'Edit the campaign details below' : 'Fill in the form to create a new campaign'}
              </div>
            </DialogHeader>
            <CampaignForm
              campaign={editingCampaign || undefined}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingCampaign(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-4 text-green-700 dark:text-green-300">
            Live ({campaignsByStatus.LIVE.length})
          </h3>
          <div>
            {campaignsByStatus.LIVE.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Closed ({campaignsByStatus.CLOSED.length})
          </h3>
          <div>
            {campaignsByStatus.CLOSED.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 