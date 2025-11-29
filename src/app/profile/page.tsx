import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage() {
    const userProfileImage = PlaceHolderImages.find(
        (img) => img.id === 'user-profile-1'
    );

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">My Profile</CardTitle>
            <CardDescription>View and edit your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    {userProfileImage && (
                        <AvatarImage src={userProfileImage.imageUrl} alt="User avatar" data-ai-hint={userProfileImage.imageHint} />
                    )}
                    <AvatarFallback>EN</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">Eagle Secretary</h3>
                    <p className="text-sm text-muted-foreground">secretary@tfoepe.org</p>
                    <Button variant="outline" size="sm" className="mt-2">Change Photo</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="Eagle Secretary" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="membershipNumber">Membership Number</Label>
                    <Input id="membershipNumber" defaultValue="TFOE-2024-001" readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="secretary@tfoepe.org" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact">Contact Info</Label>
                    <Input id="contact" defaultValue="0917-123-4567" />
                </div>
            </div>
            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </CardContent>
    </Card>
  )
}
