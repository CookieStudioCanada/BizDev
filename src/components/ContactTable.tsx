import React, { useState } from 'react';
import { Contact } from '@/lib/types';
import { useLrgmStore } from '@/store/useLrgmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Plus, Edit, Trash2, Eye, Mail, Calendar } from 'lucide-react';

const CategoryBadge = ({ category }: { category: Contact['category'] }) => {
  const variants = {
    CLIENT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    PARTNER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    PROSPECT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[category]}`}>
      {category}
    </span>
  );
};

const ContactForm = ({ 
  contact, 
  onSave, 
  onCancel 
}: { 
  contact?: Contact; 
  onSave: (data: Omit<Contact, 'id'>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    category: contact?.category || 'PROSPECT' as Contact['category'],
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    org: contact?.org || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    notes: contact?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <Input 
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Last Name</label>
          <Input 
            required
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Organization</label>
        <Input 
          value={formData.org}
          onChange={(e) => setFormData(prev => ({ ...prev, org: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input 
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea 
          className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {contact ? 'Update' : 'Create'} Contact
        </Button>
      </div>
    </form>
  );
};

export const ContactTable = () => {
  const { contacts, campaigns, activities, addContact, updateContact, deleteContact } = useLrgmStore();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredContacts = contacts;

  const handleSave = (data: Omit<Contact, 'id'>) => {
    if (editingContact) {
      updateContact(editingContact.id, data);
    } else {
      addContact(data);
    }
    setIsDialogOpen(false);
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const handleView = (contact: Contact) => {
    setViewingContact(contact);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contactId);
    }
  };

  const getContactCampaigns = (contactId: string) => {
    return campaigns.filter(campaign => campaign.audienceIds.includes(contactId));
  };

  const getContactActivities = (contactId: string) => {
    return activities.filter(activity => activity.contactId === contactId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-2">Manage your contacts</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingContact(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" aria-describedby="contact-dialog-description">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </DialogTitle>
              <div id="contact-dialog-description" className="sr-only">
                {editingContact ? 'Edit the contact information below' : 'Fill in the form to add a new contact'}
              </div>
            </DialogHeader>
            <ContactForm
              contact={editingContact || undefined}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingContact(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Contact View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl" aria-describedby="contact-view-description">
            <DialogHeader>
              <DialogTitle>
                {viewingContact && `${viewingContact.firstName} ${viewingContact.lastName}`}
              </DialogTitle>
              <div id="contact-view-description" className="sr-only">
                Contact details, campaigns, and activities
              </div>
            </DialogHeader>
            
            {viewingContact && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={viewingContact.category} />
                      </div>
                      {viewingContact.org && (
                        <p><span className="font-medium">Organization:</span> {viewingContact.org}</p>
                      )}
                      {viewingContact.email && (
                        <p><span className="font-medium">Email:</span> {viewingContact.email}</p>
                      )}
                      {viewingContact.phone && (
                        <p><span className="font-medium">Phone:</span> {viewingContact.phone}</p>
                      )}
                      {viewingContact.notes && (
                        <div>
                          <p className="font-medium">Notes:</p>
                          <p className="text-sm text-muted-foreground">{viewingContact.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-accent/50 rounded-lg text-center">
                        <div className="text-2xl font-bold">{getContactCampaigns(viewingContact.id).length}</div>
                        <div className="text-sm text-muted-foreground">Campaigns</div>
                      </div>
                      <div className="p-3 bg-accent/50 rounded-lg text-center">
                        <div className="text-2xl font-bold">{getContactActivities(viewingContact.id).length}</div>
                        <div className="text-sm text-muted-foreground">Activities</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Campaigns */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Campaigns ({getContactCampaigns(viewingContact.id).length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {getContactCampaigns(viewingContact.id).map(campaign => (
                        <div key={campaign.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{campaign.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              campaign.status === 'LIVE' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                            }`}>
                              {campaign.status}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.channel} • {new Date(campaign.datePlanned).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {getContactCampaigns(viewingContact.id).length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No campaigns yet</p>
                      )}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recent Activities ({getContactActivities(viewingContact.id).length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {getContactActivities(viewingContact.id).slice(0, 10).map(activity => (
                        <div key={activity.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              activity.type === 'EMAIL' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                              activity.type === 'CALL' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                              activity.type === 'MEETING' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' :
                              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                            }`}>
                              {activity.type}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{activity.summary}</p>
                        </div>
                      ))}
                      {getContactActivities(viewingContact.id).length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No activities yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(viewingContact);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Contact
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">
                  {contact.firstName} {contact.lastName}
                </TableCell>
                <TableCell>
                  <CategoryBadge category={contact.category} />
                </TableCell>
                <TableCell>{contact.org || '-'}</TableCell>
                <TableCell>{contact.email || '-'}</TableCell>
                <TableCell>{contact.phone || '-'}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleView(contact)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(contact)}
                      title="Edit Contact"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(contact.id)}
                      title="Delete Contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 