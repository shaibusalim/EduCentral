import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School } from 'lucide-react';
import Image from 'next/image';

export default function TeacherClassesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Classes"
        subtitle="View your assigned classes and student lists."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            Class Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Teacher classes placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="teacher students"
          />
          <p className="text-muted-foreground">
            Details about your assigned classes, student lists, and related actions will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
