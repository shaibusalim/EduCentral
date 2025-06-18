import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Percent } from 'lucide-react';
import Image from 'next/image';

export default function StudentAttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Attendance"
        subtitle="Track your attendance records and percentage."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center items-center my-4">
            <Percent className="h-16 w-16 text-green-500 mr-4" />
            <div>
              <p className="text-4xl font-bold text-primary">95%</p>
              <p className="text-muted-foreground">Overall Attendance</p>
            </div>
          </div>
           <Image 
            src="https://placehold.co/800x300.png" 
            alt="Student attendance placeholder" 
            width={800} 
            height={300} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="calendar checkmark"
          />
          <p className="text-muted-foreground">
            Your detailed attendance records, including daily status and overall percentage, will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
