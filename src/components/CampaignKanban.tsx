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
          <label className="text-sm font-medium mb-2 block">Channel</label>
          <div className="relative">
            <select 
              className="w-full p-3 border rounded-lg bg-background text-foreground appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.channel}
              onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value as Campaign['channel'] }))}
            >
              <option value="BLOG">📝 Blog</option>
              <option value="NEWSLETTER">📧 Newsletter</option>
              <option value="WEBINAR">🎥 Webinar</option>
              <option value="DINNER">🍽️ Dinner</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Planned Date</label>
          <Input 
            type="date"
            required
            className="p-3 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            value={formData.datePlanned}
            onChange={(e) => setFormData(prev => ({ ...prev, datePlanned: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <div className="relative">
            <select 
              className="w-full p-3 border rounded-lg bg-background text-foreground appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Campaign['status'] }))}
            >
              <option value="LIVE">🟢 Live</option>
              <option value="CLOSED">⚫ Closed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Audience Selection
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {formData.audienceIds.length} selected
            </span>
          </label>
          <div className="border rounded-lg p-4 bg-accent/20">
            {contacts.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {contacts.map(contact => (
                  <div 
                    key={contact.id} 
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                      formData.audienceIds.includes(contact.id) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent/30'
                    }`}
                    onClick={() => toggleContact(contact.id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.audienceIds.includes(contact.id)}
                      onChange={() => toggleContact(contact.id)}
                      className="w-4 h-4 text-primary"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {contact.firstName} {contact.lastName}
                      </div>
                      {contact.org && (
                        <div className="text-xs text-muted-foreground truncate">
                          {contact.org}
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      contact.category === 'CLIENT' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                      contact.category === 'PARTNER' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                    }`}>
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

        {/* Campaign Details */}
        <div>
          <label className="text-sm font-medium mb-2 block">Campaign Details</label>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Objectives & Goals</label>
              <textarea 
                className="w-full p-3 border rounded-lg bg-background text-foreground resize-none hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Describe campaign objectives, target metrics, or key messages..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-accent/30 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Target Reach</div>
                <div className="text-lg font-semibold">{formData.audienceIds.length}</div>
                <div className="text-xs text-muted-foreground">contacts</div>
              </div>
              <div className="p-3 bg-accent/30 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Channel</div>
                <div className="text-lg font-semibold">
                  {formData.channel === 'BLOG' && '📝'}
                  {formData.channel === 'NEWSLETTER' && '📧'}
                  {formData.channel === 'WEBINAR' && '🎥'}
                  {formData.channel === 'DINNER' && '🍽️'}
                </div>
                <div className="text-xs text-muted-foreground">{formData.channel.toLowerCase()}</div>
              </div>
            </div>
          </div>
        </div>
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage your marketing campaigns and track their progress</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCampaign(null)} className="w-full sm:w-auto">
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

      <div>
        <h2 className="text-xl font-semibold mb-4">Campaign Pipeline</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-4 text-green-700 dark:text-green-300 text-lg">
            Live ({campaignsByStatus.LIVE.length})
          </h3>
          <div className="space-y-4">
            {campaignsByStatus.LIVE.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
            {campaignsByStatus.LIVE.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No live campaigns</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 text-lg">
            Closed ({campaignsByStatus.CLOSED.length})
          </h3>
          <div className="space-y-4">
            {campaignsByStatus.CLOSED.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
            {campaignsByStatus.CLOSED.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No closed campaigns</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 