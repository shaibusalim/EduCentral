"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/contexts/AppContext';
import { useAppContext } from '@/contexts/AppContext';
import Image from 'next/image';
import { Building } from 'lucide-react';

export default function RoleSelectorClient() {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const router = useRouter();
  const { setRole } = useAppContext();

  const handleRoleSelection = () => {
    if (selectedRole) {
      setRole(selectedRole as UserRole);
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
       <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Building size={40} />
          </div>
          <CardTitle className="font-headline text-3xl font-bold text-primary">Welcome to EduCentral</CardTitle>
          <CardDescription className="text-muted-foreground">
            Select your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Image
              src="https://placehold.co/600x400.png"
              alt="School illustration"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
              data-ai-hint="school education"
            />
          <Select value={selectedRole || ''} onValueChange={(value) => setSelectedRole(value as UserRole) }>
            <SelectTrigger className="w-full text-base">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRoleSelection} disabled={!selectedRole} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
            Proceed to Dashboard
          </Button>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        EduCentral &copy; {new Date().getFullYear()}. Your integrated school management solution.
      </p>
    </div>
  );
}
