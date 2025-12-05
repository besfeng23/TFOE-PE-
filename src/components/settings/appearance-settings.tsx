
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function AppearanceSettings() {
    const { theme, setTheme } = useTheme();

    return (
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
                <Switch 
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
                <Label htmlFor="dark-mode">Enable Dark Mode</Label>
             </div>
             <p className="text-sm text-muted-foreground">Note: TFOE-PE brand colors are strictly applied.</p>
            <Button disabled>Save Changes</Button>
          </CardContent>
        </Card>
    )
}
