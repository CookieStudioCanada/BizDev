import React, { useState } from 'react';
import { Campaign } from '@/lib/types';
import { useLrgmStore } from '@/store/useLrgmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Plus, Edit, Trash2, Calendar, Users, Presentation, UtensilsCrossed, PartyPopper, ChevronRight, Target, CheckCircle } from 'lucide-react';

const CampaignCard = ({ campaign, onEdit }: { campaign: Campaign; onEdit: (campaign: Campaign) => void }) => {
  const { contacts, updateCampaign, deleteCampaign } = useLrgmStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const audienceContacts = contacts.filter(c => campaign.audienceIds.includes(c.id));
  
  const handleStatusChange = (newStatus: Campaign['status']) => {
    updateCampaign(campaign.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(campaign.id);
    }
  };

  const channelColors = {
    PRESENTATION: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    LUNCH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    EVENTS: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
  };

  const channelIcons = {
    PRESENTATION: <Presentation className="w-4 h-4" />,
    LUNCH: <UtensilsCrossed className="w-4 h-4" />,
    EVENTS: <PartyPopper className="w-4 h-4" />,
  };

  const isUpcoming = new Date(campaign.datePlanned) > new Date();
  const daysToCampaign = Math.ceil((new Date(campaign.datePlanned).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`mb-4 hover:shadow-lg transition-all duration-300 border-l-4 ${
      campaign.status === 'LIVE' 
        ? 'border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20' 
        : 'border-l-gray-400 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-950/20'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${channelColors[campaign.channel]}`}>
                {channelIcons[campaign.channel]}
              </div>
              <div>
                <CardTitle className="text-xl mb-1">{campaign.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="capitalize font-medium">{campaign.channel.toLowerCase()}</span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 ${campaign.status === 'LIVE' ? 'text-green-600' : 'text-gray-500'}`}>
                    {campaign.status === 'LIVE' ? <Target className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    {campaign.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(campaign)}
              className="h-8"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="h-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-accent/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-primary">{audienceContacts.length}</div>
            <div className="text-xs text-muted-foreground">Contacts</div>
          </div>
          <div className="bg-accent/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-primary">
              {isUpcoming ? (daysToCampaign > 0 ? daysToCampaign : 'Today') : 'Past'}
            </div>
            <div className="text-xs text-muted-foreground">
              {isUpcoming ? 'Days left' : 'Event'}
            </div>
          </div>
          <div className="bg-accent/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-primary">
              {new Date(campaign.datePlanned).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-xs text-muted-foreground">Date</div>
          </div>
          <div className="bg-accent/50 rounded-lg p-3 text-center">
            <Button
              size="sm"
              variant={campaign.status === 'LIVE' ? 'destructive' : 'default'}
              onClick={() => handleStatusChange(campaign.status === 'LIVE' ? 'CLOSED' : 'LIVE')}
              className="h-8 w-full text-xs"
            >
              {campaign.status === 'LIVE' ? 'Close' : 'Reopen'}
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between h-8 text-sm"
        >
          <span>Campaign Notes</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">Scheduled Date</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(campaign.datePlanned).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            {campaign.notes && (
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">Notes</div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.notes}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-sm mb-2">Audience ({audienceContacts.length} contacts)</div>
                <div className="flex flex-wrap gap-2">
                  {audienceContacts.slice(0, 6).map(contact => (
                    <span key={contact.id} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {contact.firstName} {contact.lastName}
                    </span>
                  ))}
                  {audienceContacts.length > 6 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      +{audienceContacts.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
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
    channel: campaign?.channel || 'PRESENTATION' as Campaign['channel'],
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
              <option value="PRESENTATION">🎤 Presentation</option>
              <option value="LUNCH">🍽️ Lunch</option>
              <option value="EVENTS">🎉 Events</option>
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

        {/* Campaign Notes */}
        <div>
          <label className="text-sm font-medium mb-2 block">Campaign Notes</label>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <textarea 
                className="w-full p-3 border rounded-lg bg-background text-foreground resize-none hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add campaign notes, objectives, or key messages..."
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
                  {formData.channel === 'PRESENTATION' && '🎤'}
                  {formData.channel === 'LUNCH' && '🍽️'}
                  {formData.channel === 'EVENTS' && '🎉'}
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
  const { campaigns, addCampaign, updateCampaign } = useLrgmStore();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const campaignsByStatus = {
    LIVE: campaigns.filter(c => c.status === 'LIVE'),
    CLOSED: campaigns.filter(c => c.status === 'CLOSED'),
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsDialogOpen(true);
  };

  const handleSave = (data: Omit<Campaign, 'id'>) => {
    if (editingCampaign) {
      updateCampaign(editingCampaign.id, data);
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
              <CampaignCard key={campaign.id} campaign={campaign} onEdit={handleEdit} />
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
              <CampaignCard key={campaign.id} campaign={campaign} onEdit={handleEdit} />
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