import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users } from 'lucide-react';
import Image from 'next/image';

export default function StudentManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Student Management"
        subtitle="Add, edit, and manage student profiles and information."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Student
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Student Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Student management placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="students classroom"
          />
          <p className="text-muted-foreground">
            Student management features (add/edit/delete students, profiles, ID generation, class assignment, attendance, grades, fees, behavior reports) will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
