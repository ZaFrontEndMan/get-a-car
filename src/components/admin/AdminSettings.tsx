import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Shield, Mail, Database, Users, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Linkedin, FileText, HelpCircle, Languages } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { useAdminSettingsMutation } from '@/hooks/useAdminSettingsMutation';
import TermsSettings from './settings/TermsSettings';
import PrivacySettings from './settings/PrivacySettings';
import FAQSettings from './settings/FAQSettings';
import LanguageSettings from './settings/LanguageSettings';

const AdminSettings = () => {
  const { data: adminSettings, isLoading, error } = useAdminSettings();
  const updateSettingsMutation = useAdminSettingsMutation();

  const [settings, setSettings] = useState({
    // General Settings
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    supportPhone: '',
    
    // Contact Information
    address: '',
    city: '',
    country: '',
    website: '',
    
    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    
    // System Settings (these remain local for now)
    enableNotifications: true,
    enableAutoApproval: false,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    bookingApprovalRequired: true,
    maxBookingDays: 30,
    minBookingHours: 1,
    cancellationPolicy: '24 hours before pickup for full refund'
  });

  // Update local state when admin settings are loaded
  useEffect(() => {
    if (adminSettings) {
      setSettings(prev => ({
        ...prev,
        siteName: adminSettings.siteName,
        siteDescription: adminSettings.siteDescription,
        contactEmail: adminSettings.contactEmail,
        supportPhone: adminSettings.supportPhone,
        address: adminSettings.address,
        city: adminSettings.city,
        country: adminSettings.country,
        website: adminSettings.website,
        facebookUrl: adminSettings.facebookUrl,
        twitterUrl: adminSettings.twitterUrl,
        instagramUrl: adminSettings.instagramUrl,
        linkedinUrl: adminSettings.linkedinUrl,
        youtubeUrl: adminSettings.youtubeUrl,
      }));
    }
  }, [adminSettings]);

  const handleSave = (section: string) => {
    const settingsToSave = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactEmail,
      supportPhone: settings.supportPhone,
      address: settings.address,
      city: settings.city,
      country: settings.country,
      website: settings.website,
      facebookUrl: settings.facebookUrl,
      twitterUrl: settings.twitterUrl,
      instagramUrl: settings.instagramUrl,
      linkedinUrl: settings.linkedinUrl,
      youtubeUrl: settings.youtubeUrl,
    };

    updateSettingsMutation.mutate(settingsToSave);
  };

  const handleGeneralSave = () => handleSave('General');
  const handleContactInfoSave = () => handleSave('Contact');
  const handleSocialMediaSave = () => handleSave('Social Media');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">System Settings</h2>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">System Settings</h2>
            <p className="text-red-600">Error loading settings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic site configuration and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    value={settings.website}
                    onChange={(e) => setSettings({...settings, website: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={handleGeneralSave}
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save General Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Configure contact details and address information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={settings.city}
                    onChange={(e) => setSettings({...settings, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={settings.country}
                    onChange={(e) => setSettings({...settings, country: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                onClick={handleContactInfoSave}
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Contact Information'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Configure social media profiles and links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <Input
                      id="facebookUrl"
                      type="url"
                      placeholder="https://facebook.com/yourpage"
                      value={settings.facebookUrl}
                      onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <Label htmlFor="twitterUrl">Twitter URL</Label>
                    <Input
                      id="twitterUrl"
                      type="url"
                      placeholder="https://twitter.com/yourhandle"
                      value={settings.twitterUrl}
                      onChange={(e) => setSettings({...settings, twitterUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <div className="flex-1">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      type="url"
                      placeholder="https://instagram.com/yourhandle"
                      value={settings.instagramUrl}
                      onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Linkedin className="h-5 w-5 text-blue-700" />
                  <div className="flex-1">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={settings.linkedinUrl}
                      onChange={(e) => setSettings({...settings, linkedinUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                    <Input
                      id="youtubeUrl"
                      type="url"
                      placeholder="https://youtube.com/channel/yourchannel"
                      value={settings.youtubeUrl}
                      onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSocialMediaSave}
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Social Media Links'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Send email notifications for bookings and updates
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, emailNotifications: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Send SMS alerts for important updates
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, smsNotifications: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Admin Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive notifications about system events
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, enableNotifications: checked})
                  }
                />
              </div>

              <Button onClick={() => toast.success('Notification settings saved!')}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>
                Configure booking rules and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Booking Approval Required</Label>
                  <p className="text-sm text-gray-600">
                    Require manual approval for all bookings
                  </p>
                </div>
                <Switch
                  checked={settings.bookingApprovalRequired}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, bookingApprovalRequired: checked})
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxBookingDays">Max Booking Days</Label>
                  <Input
                    id="maxBookingDays"
                    type="number"
                    value={settings.maxBookingDays}
                    onChange={(e) => setSettings({...settings, maxBookingDays: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minBookingHours">Min Booking Hours</Label>
                  <Input
                    id="minBookingHours"
                    type="number"
                    value={settings.minBookingHours}
                    onChange={(e) => setSettings({...settings, minBookingHours: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Textarea
                  id="cancellationPolicy"
                  value={settings.cancellationPolicy}
                  onChange={(e) => setSettings({...settings, cancellationPolicy: e.target.value})}
                />
              </div>

              <Button onClick={() => toast.success('Booking settings saved!')}>
                Save Booking Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6">
          <TermsSettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings />
        </TabsContent>

        <TabsContent value="faqs" className="space-y-6">
          <FAQSettings />
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <LanguageSettings />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                System maintenance and technical settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">
                    Enable maintenance mode for system updates
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, maintenanceMode: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-gray-600">
                    Automatically backup database daily
                  </p>
                </div>
                <Switch />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">System Actions</h4>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    Clear Cache
                  </Button>
                  <Button variant="outline">
                    Export Data
                  </Button>
                  <Button variant="outline">
                    View Logs
                  </Button>
                </div>
              </div>

              <Button onClick={() => toast.success('System settings saved!')}>
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
