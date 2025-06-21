export type Contact = {
  id: string;
  category: 'CLIENT' | 'PARTNER' | 'PROSPECT';
  firstName: string;
  lastName: string;
  org?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export type Campaign = {
  id: string;
  title: string;
  channel: 'BLOG' | 'NEWSLETTER' | 'WEBINAR' | 'DINNER';
  datePlanned: string;
  status: 'LIVE' | 'CLOSED';
  audienceIds: string[];
  notes?: string;
};

export type Activity = {
  id: string;
  contactId: string;
  date: string;
  type: 'EMAIL' | 'CALL' | 'MEETING' | 'EVENT';
  summary: string;
  details?: string;
};

export type LrgmData = {
  contacts: Contact[];
  campaigns: Campaign[];
  activities: Activity[];
}; 