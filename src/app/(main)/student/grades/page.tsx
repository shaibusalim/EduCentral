import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function StudentGradesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Grades"
        subtitle="View your academic performance and report cards."
      >
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download Report Card
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
           <Image 
            src="https://placehold.co/800x400.png" 
            alt="Student grades placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="grades chart"
          />
          <p className="text-muted-foreground">
            Your grades, term-wise results, cumulative performance, and report card downloads will be accessible here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
