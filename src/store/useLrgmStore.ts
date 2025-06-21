import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact, Campaign, Activity, LrgmData } from '../lib/types';
import { generateId } from '../lib/id';

interface LrgmStore extends LrgmData {
  // Contact actions
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  // Campaign actions
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // Activity actions
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  
  // Bulk operations
  importData: (data: Partial<LrgmData>) => void;
  clearAllData: () => void;
}

export const useLrgmStore = create<LrgmStore>()(
  persist(
    (set, get) => ({
      contacts: [],
      campaigns: [],
      activities: [],
      
      // Contact actions
      addContact: (contact) => set((state) => ({
        contacts: [...state.contacts, { ...contact, id: generateId() }]
      })),
      
      updateContact: (id, updates) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === id ? { ...contact, ...updates } : contact
        )
      })),
      
      deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter(contact => contact.id !== id),
        activities: state.activities.filter(activity => activity.contactId !== id),
        campaigns: state.campaigns.map(campaign => ({
          ...campaign,
          audienceIds: campaign.audienceIds.filter(audienceId => audienceId !== id)
        }))
      })),
      
      // Campaign actions
      addCampaign: (campaign) => set((state) => ({
        campaigns: [...state.campaigns, { ...campaign, id: generateId() }]
      })),
      
      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map(campaign => 
          campaign.id === id ? { ...campaign, ...updates } : campaign
        )
      })),
      
      deleteCampaign: (id) => set((state) => ({
        campaigns: state.campaigns.filter(campaign => campaign.id !== id)
      })),
      
      // Activity actions
      addActivity: (activity) => set((state) => ({
        activities: [...state.activities, { ...activity, id: generateId() }]
      })),
      
      updateActivity: (id, updates) => set((state) => ({
        activities: state.activities.map(activity => 
          activity.id === id ? { ...activity, ...updates } : activity
        )
      })),
      
      deleteActivity: (id) => set((state) => ({
        activities: state.activities.filter(activity => activity.id !== id)
      })),
      
      // Bulk operations
      importData: (data) => set((state) => ({
        contacts: data.contacts ? [...state.contacts, ...data.contacts] : state.contacts,
        campaigns: data.campaigns ? [...state.campaigns, ...data.campaigns] : state.campaigns,
        activities: data.activities ? [...state.activities, ...data.activities] : state.activities,
      })),
      
      clearAllData: () => set(() => ({
        contacts: [],
        campaigns: [],
        activities: []
      }))
    }),
    {
      name: 'lrgm-data',
    }
  )
); 