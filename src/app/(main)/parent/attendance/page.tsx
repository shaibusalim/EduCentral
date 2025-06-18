
"use client";

import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCheck, AlertCircle, CalendarDays, Percent, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// Mock data
const mockOverallAttendancePercent = 97;
const mockDaysPresent = 194;
const mockDaysAbsent = 6;
const mockRecentAbsences = [
  { date: "2024-09-15", reason: "Sick leave" },
  { date: "2024-08-22", reason: "Family event (excused)" },
];

export default function ParentAttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Child's Attendance"
        subtitle="Monitor your child's attendance records and history."
      >
        <Button variant="outline">
            <AlertCircle className="mr-2 h-4 w-4" /> Report Absence
        </Button>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Percent className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOverallAttendancePercent}%</div>
            <p className="text-xs text-muted-foreground">
              {mockDaysPresent} days present out of {mockDaysPresent + mockDaysAbsent}
            </p>
            <Progress value={mockOverallAttendancePercent} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Present</CardTitle>
            <UserCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDaysPresent}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Absent</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDaysAbsent}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Recent Absence Log
          </CardTitle>
          <CardDescription>A summary of recent absences. For a detailed daily log, please refer to the school portal or contact administration.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockRecentAbsences.length > 0 ? (
            <ul className="space-y-3">
              {mockRecentAbsences.map((absence, index) => (
                <li key={index} className="flex justify-between items-center p-3 rounded-md border bg-secondary/30">
                  <div>
                    <p className="font-medium">{new Date(absence.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-muted-foreground">{absence.reason}</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent absences recorded. Great job!</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Detailed Attendance View
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
            A full calendar view or daily log of attendance will be implemented here. This section would typically show a breakdown by day/subject.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
