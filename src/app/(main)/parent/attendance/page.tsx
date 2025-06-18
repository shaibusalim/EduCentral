import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ParentAttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Child's Attendance"
        subtitle="Monitor your child's attendance records."
      >
        <Button variant="outline">
            <AlertCircle className="mr-2 h-4 w-4" /> Report Absence
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Attendance Log
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Child attendance placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="attendance list"
          />
          <p className="text-muted-foreground">
            Detailed attendance records for your child will be displayed here. You will also receive alerts for absenteeism.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
