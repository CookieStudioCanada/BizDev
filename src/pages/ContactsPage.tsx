
import { ContactTable } from '@/components/ContactTable';

export const ContactsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contacts</h1>
        <p className="text-muted-foreground mt-2">
          Manage your clients, partners, and prospects
        </p>
      </div>
      
      <ContactTable />
    </div>
  );
}; 