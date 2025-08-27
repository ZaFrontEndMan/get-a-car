
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Loader2 } from 'lucide-react';
import { useTermsConditions, useUpdateTermsConditions } from '@/hooks/useTermsConditions';

const TermsSettings = () => {
  const { data: termsData, isLoading } = useTermsConditions();
  const updateTermsMutation = useUpdateTermsConditions();
  
  const [termsContent, setTermsContent] = useState({
    content_en: '',
    content_ar: ''
  });

  useEffect(() => {
    if (termsData) {
      setTermsContent({
        content_en: termsData.content_en,
        content_ar: termsData.content_ar || ''
      });
    }
  }, [termsData]);

  const handleSave = () => {
    updateTermsMutation.mutate(termsContent);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Terms and Conditions
        </CardTitle>
        <CardDescription>
          Manage terms and conditions in English and Arabic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="termsEn">Terms and Conditions (English)</Label>
            <Textarea
              id="termsEn"
              value={termsContent.content_en}
              onChange={(e) => setTermsContent({...termsContent, content_en: e.target.value})}
              className="min-h-[300px]"
              placeholder="Enter terms and conditions in English..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="termsAr">Terms and Conditions (Arabic)</Label>
            <Textarea
              id="termsAr"
              value={termsContent.content_ar}
              onChange={(e) => setTermsContent({...termsContent, content_ar: e.target.value})}
              className="min-h-[300px]"
              placeholder="أدخل الشروط والأحكام باللغة العربية..."
              dir="rtl"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave}
          disabled={updateTermsMutation.isPending}
        >
          {updateTermsMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save Terms and Conditions
        </Button>
      </CardContent>
    </Card>
  );
};

export default TermsSettings;
