import React, { useState } from 'react';
import { Contact } from '@/lib/types';
import { useLrgmStore } from '@/store/useLrgmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Plus, Edit, Trash2 } from 'lucide-react';

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
  const { contacts, addContact, updateContact, deleteContact } = useLrgmStore();
  const [selectedCategory, setSelectedCategory] = useState<Contact['category'] | 'ALL'>('ALL');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredContacts = selectedCategory === 'ALL' 
    ? contacts 
    : contacts.filter(contact => contact.category === selectedCategory);

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

  const handleDelete = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contactId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {(['ALL', 'CLIENT', 'PARTNER', 'PROSPECT'] as const).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'ALL' ? 'All' : category.toLowerCase()}
            </Button>
          ))}
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
                      onClick={() => handleEdit(contact)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(contact.id)}
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