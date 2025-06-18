import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, School } from 'lucide-react';
import Image from 'next/image';

export default function ClassManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Class Management"
        subtitle="Create, edit, and manage classes and sections."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Class
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            Class Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Class management placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="classroom empty"
          />
          <p className="text-muted-foreground">
            Class and section management features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
