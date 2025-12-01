import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile Settings</CardTitle>
            <CardDescription>
              Manage your personal information. These settings are managed on the Profile page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Eagle Secretary" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="secretary@tfoepe.org" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture">Profile Picture</Label>
              <Input id="picture" type="file" />
            </div>
            <Button disabled>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="branding">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Branding & Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Organization Logo</Label>
              <Input id="logo" type="file" />
            </div>
             <div className="flex items-center space-x-2">
                <Switch id="dark-mode" />
                <Label htmlFor="dark-mode">Enable Dark Mode</Label>
             </div>
             <p className="text-sm text-muted-foreground">Note: TFOE-PE brand colors are strictly applied.</p>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Security</CardTitle>
            <CardDescription>
              Manage your password and two-factor authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="2fa"/>
                <Label htmlFor="2fa">Enable Two-Factor Authentication (GCash)</Label>
            </div>
            <Button>Update Password</Button>
          </CardContent>
