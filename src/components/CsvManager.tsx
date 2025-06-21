import React, { useState } from 'react';
import { useLrgmStore } from '@/store/useLrgmStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Upload, FileText } from 'lucide-react';
import { exportToCSV, importFromFiles } from '@/lib/csv';

export const CsvManager = () => {
  const { contacts, campaigns, activities, importData } = useLrgmStore();
  const [importing, setImporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = async () => {
    try {
      await exportToCSV({ contacts, campaigns, activities });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setImporting(true);
    try {
      const importedData = await importFromFiles(files);
      importData(importedData);
      alert('Data imported successfully!');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check your files and try again.');
    } finally {
      setImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
      <Button
        onClick={handleExport}
        className="rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <Download className="w-6 h-6" />
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full w-14 h-14 shadow-lg"
            size="icon"
          >
            <Upload className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Select CSV files to import. You can import:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Contacts (must contain: firstName, lastName, category)</li>
                <li>Campaigns (must contain: title, channel, datePlanned, status)</li>
                <li>Activities (must contain: contactId, date, type, summary)</li>
              </ul>
              <p className="mt-2">
                Files should be named with "contact", "campaign", or "activity" in the filename.
              </p>
            </div>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <label htmlFor="csv-import" className="cursor-pointer">
                  <span className="text-sm font-medium">
                    {importing ? 'Importing...' : 'Click to select CSV files'}
                  </span>
                  <input
                    id="csv-import"
                    type="file"
                    multiple
                    accept=".csv"
                    onChange={handleImport}
                    disabled={importing}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Multiple files allowed
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Current Data Summary:</h4>
              <div className="text-sm space-y-1">
                <p>{contacts.length} contacts</p>
                <p>{campaigns.length} campaigns</p>
                <p>{activities.length} activities</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 