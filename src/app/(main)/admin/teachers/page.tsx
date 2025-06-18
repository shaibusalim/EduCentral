import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default function TeacherManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Teacher Management"
        subtitle="Manage teacher profiles, subject assignments, and class allocations."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Teacher
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Teacher Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Teacher management placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="teacher classroom"
          />
          <p className="text-muted-foreground">
            Teacher management features (add/edit/delete teachers, assign to subjects/classes, view schedules, student performance) will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
