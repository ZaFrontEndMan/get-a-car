
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Shield, Loader2 } from 'lucide-react';
import { usePrivacyPolicy, useUpdatePrivacyPolicy } from '@/hooks/usePrivacyPolicy';

const PrivacySettings = () => {
  const { data: privacyData, isLoading } = usePrivacyPolicy();
  const updatePrivacyMutation = useUpdatePrivacyPolicy();
  
  const [privacyContent, setPrivacyContent] = useState({
    content_en: '',
    content_ar: ''
  });

  useEffect(() => {
    if (privacyData) {
      setPrivacyContent({
        content_en: privacyData.content_en,
        content_ar: privacyData.content_ar || ''
      });
    }
  }, [privacyData]);

  const handleSave = () => {
    updatePrivacyMutation.mutate(privacyContent);
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
          <Shield className="mr-2 h-5 w-5" />
          Privacy Policy
        </CardTitle>
        <CardDescription>
          Manage privacy policy in English and Arabic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privacyEn">Privacy Policy (English)</Label>
            <Textarea
              id="privacyEn"
              value={privacyContent.content_en}
              onChange={(e) => setPrivacyContent({...privacyContent, content_en: e.target.value})}
              className="min-h-[300px]"
              placeholder="Enter privacy policy in English..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="privacyAr">Privacy Policy (Arabic)</Label>
            <Textarea
              id="privacyAr"
              value={privacyContent.content_ar}
              onChange={(e) => setPrivacyContent({...privacyContent, content_ar: e.target.value})}
              className="min-h-[300px]"
              placeholder="أدخل سياسة الخصوصية باللغة العربية..."
              dir="rtl"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave}
          disabled={updatePrivacyMutation.isPending}
        >
          {updatePrivacyMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save Privacy Policy
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
