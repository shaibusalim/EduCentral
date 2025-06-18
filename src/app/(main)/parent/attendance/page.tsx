
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCheck, AlertCircle, CalendarDays, Percent, History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { AttendanceRecord, AttendanceStatus } from '@/types';
import { getAttendanceForStudent } from '@/services/attendanceService';
import { format, parseISO } from 'date-fns';

// SIMULATION: In a real app, this would come from auth context or parent's profile
const CURRENT_CHILD_STUDENT_ID = "student123"; // Ensure this student ID exists with data

interface AttendanceStats {
  overallPercentage: number;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  totalRecordedDays: number;
}

export default function ParentAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!CURRENT_CHILD_STUDENT_ID) {
        toast({ variant: "destructive", title: "Child ID missing" });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedRecords = await getAttendanceForStudent(CURRENT_CHILD_STUDENT_ID);
        setAttendanceRecords(fetchedRecords as AttendanceRecord[]); // Assuming service returns the fuller type or cast as needed
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load attendance data",
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendanceData();
  }, [toast]);

  const calculateAttendanceStats = React.useCallback((): AttendanceStats => {
    if (attendanceRecords.length === 0) {
      return { overallPercentage: 0, daysPresent: 0, daysAbsent: 0, daysLate: 0, totalRecordedDays: 0 };
    }
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
    const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
    
    const totalConsideredForPercentage = attendanceRecords.filter(r => r.status !== 'unmarked').length;
    const presentOrLate = presentCount + lateCount;

    const overallPercentage = totalConsideredForPercentage > 0 
      ? Math.round((presentOrLate / totalConsideredForPercentage) * 100) 
      : 0;

    return {
      overallPercentage,
      daysPresent: presentCount,
      daysAbsent: absentCount,
      daysLate: lateCount,
      totalRecordedDays: totalConsideredForPercentage,
    };
  }, [attendanceRecords]);

  const stats = calculateAttendanceStats();
  const recentAbsences = attendanceRecords
    .filter(r => r.status === 'absent')
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()) // Sort descending by date
    .slice(0, 5); // Show latest 5 absences

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

      {isLoading ? (
         <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading attendance data...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                <Percent className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overallPercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.daysPresent + stats.daysLate} days present/late out of {stats.totalRecordedDays}
                </p>
                <Progress value={stats.overallPercentage} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Days Present</CardTitle>
                <UserCheck className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.daysPresent}</div>
                <p className="text-xs text-muted-foreground">This academic year (includes late)</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Days Absent</CardTitle>
                <AlertCircle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.daysAbsent}</div>
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
              {recentAbsences.length > 0 ? (
                <ul className="space-y-3">
                  {recentAbsences.map((absence, index) => (
                    <li key={absence.id || index} className="flex justify-between items-center p-3 rounded-md border bg-secondary/30">
                      <div>
                        <p className="font-medium">{format(parseISO(absence.date), 'PPP')}</p>
                        {/* For simplicity, not showing reason as it's not in AttendanceRecord. Could be added. */}
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
        </>
      )}
    </div>
  );
}
