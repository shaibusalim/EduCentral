import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, UploadCloud } from 'lucide-react';
import Image from 'next/image';

export default function EnterGradesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Enter Grades"
        subtitle="Submit student grades and remarks for exams and assignments."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <UploadCloud className="mr-2 h-4 w-4" /> Submit Grades
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Grading Portal
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Grade entry placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="report card"
          />
          <p className="text-muted-foreground">
            Subject-wise marks entry, auto-grade computation, and remarks submission features will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
