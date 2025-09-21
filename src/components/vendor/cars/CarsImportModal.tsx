
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Download, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface CarsImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  vendorId: string;
}

const CarsImportModal = ({ isOpen, onClose, onImportSuccess, vendorId }: CarsImportModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    // Create CSV template with all car fields
    const headers = [
      'name',
      'brand', 
      'model',
      'year',
      'type',
      'fuel_type',
      'transmission',
      'seats',
      'color',
      'license_plate',
      'daily_rate',
      'weekly_rate',
      'monthly_rate',
      'deposit_amount',
      'mileage_limit',
      'condition',
      'features',
      'images',
      'is_available',
      'is_featured'
    ];

    const sampleData = [
      'Toyota Camry 2024',
      'Toyota',
      'Camry',
      '2024',
      'sedan',
      'hybrid',
      'automatic',
      '5',
      'White',
      'ABC-123',
      '150.00',
      '900.00',
      '3500.00',
      '500.00',
      '300',
      'excellent',
      'GPS Navigation|Bluetooth|Air Conditioning',
      'https://example.com/image1.jpg|https://example.com/image2.jpg',
      'true',
      'false'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cars_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully",
    });
  };

  const parseCSV = async (text: string) => {
    // Get current user and vendor info
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get vendor for current user
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (vendorError) {
      console.error('Vendor lookup error:', vendorError);
      throw new Error('Vendor not found');
    }

    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        
        switch (header) {
          case 'year':
          case 'seats':
          case 'mileage_limit':
            row[header] = value ? parseInt(value) : null;
            break;
          case 'daily_rate':
          case 'weekly_rate':
          case 'monthly_rate':
          case 'deposit_amount':
            row[header] = value ? parseFloat(value) : null;
            break;
          case 'is_available':
          case 'is_featured':
            row[header] = value.toLowerCase() === 'true';
            break;
          case 'features':
          case 'images':
            row[header] = value ? value.split('|').map(item => item.trim()).filter(item => item) : [];
            break;
          case 'type':
            // Ensure type is one of the allowed values
            const allowedTypes = ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'van'];
            row[header] = allowedTypes.includes(value.toLowerCase()) ? value.toLowerCase() : 'sedan';
            break;
          case 'fuel_type':
            // Ensure fuel_type is one of the allowed values
            const allowedFuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
            row[header] = allowedFuelTypes.includes(value.toLowerCase()) ? value.toLowerCase() : 'petrol';
            break;
          case 'transmission':
            // Ensure transmission is one of the allowed values
            const allowedTransmissions = ['manual', 'automatic'];
            row[header] = allowedTransmissions.includes(value.toLowerCase()) ? value.toLowerCase() : 'automatic';
            break;
          case 'condition':
            // Ensure condition is one of the allowed values
            const allowedConditions = ['excellent', 'good', 'fair'];
            row[header] = allowedConditions.includes(value.toLowerCase()) ? value.toLowerCase() : 'excellent';
            break;
          default:
            row[header] = value || null;
        }
      });

      // Set required fields
      row.vendor_id = vendorData.id;
      row.branch_id = null; // Set to null since we don't have branch info in template
      
      // Ensure required fields are present
      if (row.name && row.brand && row.model && row.year && row.type && row.fuel_type && row.transmission && row.seats && row.daily_rate) {
        data.push(row);
      }
    }

    return data;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress('Reading file...');

    try {
      const text = await file.text();
      const carsData = await parseCSV(text);

      if (carsData.length === 0) {
        toast({
          title: "No Data Found",
          description: "The file doesn't contain valid car data",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      setUploadProgress(`Processing ${carsData.length} cars...`);

      // Insert cars in batches
      const batchSize = 5; // Reduced batch size for better error handling
      let imported = 0;
      
      for (let i = 0; i < carsData.length; i += batchSize) {
        const batch = carsData.slice(i, i + batchSize);
        
        console.log('Inserting batch:', batch);
        
        const { data, error } = await supabase
          .from('cars')
          .insert(batch)
          .select();

        if (error) {
          console.error('Batch import error:', error);
          toast({
            title: "Import Error",
            description: `Error importing batch ${Math.floor(i / batchSize) + 1}: ${error.message}`,
            variant: "destructive",
          });
          continue;
        }

        imported += data?.length || 0;
        setUploadProgress(`Imported ${imported} of ${carsData.length} cars...`);
      }

      toast({
        title: "Import Successful",
        description: `Successfully imported ${imported} cars`,
      });

      onImportSuccess();
      onClose();

    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to process the file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Cars from CSV
          </DialogTitle>
          <DialogDescription>
            Download the template, fill it with your car data, and upload to import multiple cars at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download Section */}
          <div className="space-y-3">
            <h4 className="font-medium">Step 1: Download Template</h4>
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Fill the template with your car data. Required fields: name, brand, model, year, type, fuel_type, transmission, seats, daily_rate. 
              Use | (pipe) to separate multiple values for features and images.
            </AlertDescription>
          </Alert>

          {/* Upload Section */}
          <div className="space-y-3">
            <h4 className="font-medium">Step 2: Upload Filled Template</h4>
            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {uploadProgress && (
                <p className="text-sm text-muted-foreground">{uploadProgress}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarsImportModal;
