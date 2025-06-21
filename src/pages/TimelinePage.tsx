import React from 'react';
import { Timeline } from '@/components/Timeline';

export const TimelinePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Timeline</h1>
        <p className="text-muted-foreground mt-2">
          Track all your interactions and activities with contacts
        </p>
      </div>
      
      <Timeline />
    </div>
  );
}; 