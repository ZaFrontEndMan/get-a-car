
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Languages } from 'lucide-react';
import { toast } from 'sonner';

const LanguageSettings = () => {
  const [settings, setSettings] = useState({
    enableArabic: true,
    enableEnglish: true,
    defaultLanguage: 'en',
    autoDetectLanguage: true,
    showLanguageSwitcher: true,
  });

  const handleSave = () => {
    // Here you would save language settings to database
    toast.success('Language settings saved successfully!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Languages className="mr-2 h-5 w-5" />
          Language Settings
        </CardTitle>
        <CardDescription>
          Configure multi-language support and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Arabic</Label>
              <p className="text-sm text-gray-600">
                Allow Arabic language support throughout the site
              </p>
            </div>
            <Switch
              checked={settings.enableArabic}
              onCheckedChange={(checked) => 
                setSettings({...settings, enableArabic: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable English</Label>
              <p className="text-sm text-gray-600">
                Allow English language support throughout the site
              </p>
            </div>
            <Switch
              checked={settings.enableEnglish}
              onCheckedChange={(checked) => 
                setSettings({...settings, enableEnglish: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-detect Language</Label>
              <p className="text-sm text-gray-600">
                Automatically detect user's preferred language
              </p>
            </div>
            <Switch
              checked={settings.autoDetectLanguage}
              onCheckedChange={(checked) => 
                setSettings({...settings, autoDetectLanguage: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Language Switcher</Label>
              <p className="text-sm text-gray-600">
                Display language switcher in the navigation
              </p>
            </div>
            <Switch
              checked={settings.showLanguageSwitcher}
              onCheckedChange={(checked) => 
                setSettings({...settings, showLanguageSwitcher: checked})
              }
            />
          </div>
        </div>

        <Button onClick={handleSave}>
          Save Language Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
