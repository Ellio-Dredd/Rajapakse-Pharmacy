import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Save, Bell, Mail, Lock, Globe, Database } from 'lucide-react';

export function AdminSettings() {
  const [loading, setLoading] = useState(false);

  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Rajapakse Pharmacy',
    storeEmail: 'Rajapaksepharmacypvt@gmail.com',
    storePhone: '0322247833',
    storeAddress: 'No.456, Kurunagala Road, Newtown Madampe',
    currency: 'LKR',
    shippingFee: '599.00',
    freeShippingThreshold: '5000.00',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    appointmentNotifications: true,
    lowStockAlerts: true,
    promotionalEmails: false,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAttempts: '5',
  });

  const handleSaveStoreSettings = async () => {
    try {
      setLoading(true);
      // In a real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Store settings saved successfully');
    } catch (error) {
      console.error('Error saving store settings:', error);
      toast.error('Failed to save store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      setLoading(true);
      // In a real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification settings saved successfully');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      setLoading(true);
      // In a real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Security settings saved successfully');
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error('Failed to save security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      setLoading(true);
      // In a real app, trigger database backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Database backup completed successfully');
    } catch (error) {
      console.error('Error backing up database:', error);
      toast.error('Failed to backup database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Configure your store information and preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storePhone">Phone Number</Label>
              <Input
                id="storePhone"
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={storeSettings.currency}
                onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Textarea
              id="storeAddress"
              value={storeSettings.storeAddress}
              onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
              rows={3}
            />
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shippingFee">Shipping Fee (LKR)</Label>
              <Input
                id="shippingFee"
                type="number"
                step="0.01"
                value={storeSettings.shippingFee}
                onChange={(e) => setStoreSettings({ ...storeSettings, shippingFee: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (LKR)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                step="0.01"
                value={storeSettings.freeShippingThreshold}
                onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveStoreSettings} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Store Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="orderNotifications">Order Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about new orders</p>
            </div>
            <Switch
              id="orderNotifications"
              checked={notificationSettings.orderNotifications}
              onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, orderNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointmentNotifications">Appointment Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about appointments</p>
            </div>
            <Switch
              id="appointmentNotifications"
              checked={notificationSettings.appointmentNotifications}
              onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, appointmentNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">Get alerted when products are low in stock</p>
            </div>
            <Switch
              id="lowStockAlerts"
              checked={notificationSettings.lowStockAlerts}
              onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="promotionalEmails">Promotional Emails</Label>
              <p className="text-sm text-muted-foreground">Receive promotional and marketing emails</p>
            </div>
            <Switch
              id="promotionalEmails"
              checked={notificationSettings.promotionalEmails}
              onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, promotionalEmails: checked })}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveNotificationSettings} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Enable two-factor authentication for added security</p>
            </div>
            <Switch
              id="twoFactorAuth"
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
            />
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginAttempts">Max Login Attempts</Label>
              <Input
                id="loginAttempts"
                type="number"
                value={securitySettings.loginAttempts}
                onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSecuritySettings} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Manage your database and backups</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Database Backup</p>
              <p className="text-sm text-muted-foreground">Create a backup of your database</p>
            </div>
            <Button onClick={handleBackupDatabase} disabled={loading} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
          </div>

          <Separator />

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Last backup: <span className="font-medium text-foreground">Feb 3, 2026 at 10:30 AM</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
