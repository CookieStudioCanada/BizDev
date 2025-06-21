import Papa from 'papaparse';
import JSZip from 'jszip';
import { Contact, Activity, LrgmData } from './types';

export const exportToCSV = async (data: LrgmData) => {
  const zip = new JSZip();
  
  // Export contacts
  const contactsCSV = Papa.unparse(data.contacts, {
    header: true,
    columns: ['id', 'firstName', 'lastName', 'org', 'email', 'phone', 'notes']
  });
  zip.file('contacts.csv', contactsCSV);
  
  // Export campaigns
  const campaignsData = data.campaigns.map(campaign => ({
    ...campaign,
    audienceIds: campaign.audienceIds.join(';')
  }));
  const campaignsCSV = Papa.unparse(campaignsData, {
    header: true,
    columns: ['id', 'title', 'channel', 'datePlanned', 'status', 'audienceIds', 'notes']
  });
  zip.file('campaigns.csv', campaignsCSV);
  
  // Export activities
  const activitiesCSV = Papa.unparse(data.activities, {
    header: true,
    columns: ['id', 'contactId', 'date', 'type', 'summary', 'details']
  });
  zip.file('activities.csv', activitiesCSV);
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.download = `lrgm-data-${timestamp}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFromFiles = (files: FileList): Promise<Partial<LrgmData>> => {
  return new Promise((resolve) => {
    const result: Partial<LrgmData> = {};
    let processedFiles = 0;
    const totalFiles = files.length;

    if (totalFiles === 0) {
      resolve(result);
      return;
    }

    Array.from(files).forEach((file) => {
      const fileName = file.name.toLowerCase();
      
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            if (fileName.includes('contact')) {
              result.contacts = results.data as Contact[];
            } else if (fileName.includes('campaign')) {
              result.campaigns = (results.data as any[]).map((campaign: any) => ({
                ...campaign,
                audienceIds: campaign.audienceIds ? campaign.audienceIds.split(';') : []
              }));
            } else if (fileName.includes('activit')) {
              result.activities = results.data as Activity[];
            }
          } catch (error) {
            console.error(`Error processing ${fileName}:`, error);
          }
          
          processedFiles++;
          if (processedFiles === totalFiles) {
            resolve(result);
          }
        },
        error: (error) => {
          console.error(`Error parsing ${fileName}:`, error);
          processedFiles++;
          if (processedFiles === totalFiles) {
            resolve(result);
          }
        }
      });
    });
  });
}; 