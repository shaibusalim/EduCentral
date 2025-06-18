import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, UserCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Settings"
        subtitle="Manage your account preferences and security."
      />
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Profile settings placeholder" 
              width={600} 
              height={300} 
              className="w-full h-auto rounded-lg mb-4 object-cover"
              data-ai-hint="profile user"
            />
            <p className="text-muted-foreground mb-4">
              Update your personal information, contact details, and profile picture here.
            </p>
            <Button>Edit Profile</Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Account security placeholder" 
              width={600} 
              height={300} 
              className="w-full h-auto rounded-lg mb-4 object-cover"
              data-ai-hint="security lock"
            />
            <p className="text-muted-foreground mb-4">
              Change your password and manage security settings.
            </p>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
