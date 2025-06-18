import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, BookOpen } from 'lucide-react';
import Image from 'next/image';

export default function SubjectManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Subject Management"
        subtitle="Create, edit, and manage school subjects."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Subject Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Subject management placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="books library"
          />
          <p className="text-muted-foreground">
            Subject management features, including assigning teachers to subjects and viewing class-wise subject/teacher mapping, will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
