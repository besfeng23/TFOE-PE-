
import MembershipForm from "@/components/applications/membership-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApplicationsPage() {
  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Membership Application</CardTitle>
                <CardDescription>
                    Complete the form below to apply for membership. Use the AI Autofill feature to speed up the process.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MembershipForm />
            </CardContent>
        </Card>
    </div>
  );
}
