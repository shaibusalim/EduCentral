import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ParentPerformancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Child's Performance"
        subtitle="View your child's academic progress, grades, and communicate with teachers."
      >
        <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Teacher
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Academic Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Child performance placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="student learning"
          />
          <p className="text-muted-foreground">
            Your child's grades, attendance, fee status, and communication tools with teachers will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
