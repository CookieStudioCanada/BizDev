
import { CampaignKanban } from '@/components/CampaignKanban';

export const CampaignsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <p className="text-muted-foreground mt-2">
          Manage your marketing campaigns and track their progress
        </p>
      </div>
      
      <CampaignKanban />
    </div>
  );
}; 