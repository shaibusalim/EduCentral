import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, CalendarDays } from 'lucide-react';
import Image from 'next/image';

export default function MarkAttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Mark Attendance"
        subtitle="Record daily student attendance for your classes."
      >
        <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" /> Select Date
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Attendance Sheet
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Attendance marking placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="checklist form"
          />
          <p className="text-muted-foreground">
            Interface for marking student attendance, viewing attendance records, and generating reports will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
