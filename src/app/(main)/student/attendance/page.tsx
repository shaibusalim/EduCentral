
"use client"; 

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Percent, CalendarDays, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { AttendanceRecord, AttendanceStatus } from '@/types'; 
import { getAttendanceForStudent } from '@/services/attendanceService';
import { format, parseISO } from 'date-fns';

// SIMULATION: In a real app, this would come from auth context
const CURRENT_STUDENT_ID = "student123"; // Replace with an actual student ID from your Firestore

// This type now matches the enhanced return type of getAttendanceForStudent
type DisplayableAttendanceRecord = Omit<AttendanceRecord, 'studentName'> & { id: string };

const getStatusBadgeVariant = (status: AttendanceStatus) => {
  switch (status) {
    case 'present': return 'default'; 
    case 'late': return 'secondary'; 
    case 'absent': return 'destructive';
    default: return 'outline';
  }
};

export default function StudentAttendancePage() {
  const [records, setRecords] = React.useState<DisplayableAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchAttendance = async () => {
      if (!CURRENT_STUDENT_ID) {
        toast({
          variant: "destructive",
          title: "Student ID missing",
          description: "Cannot fetch attendance without a student ID.",
        });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedRecords = await getAttendanceForStudent(CURRENT_STUDENT_ID);
        setRecords(fetchedRecords);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load attendance",
          description: (error as Error).message || "Could not fetch your attendance records.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, [toast]);

  const calculateOverallAttendance = () => {
    if (records.length === 0) return 0;
    const presentOrLate = records.filter(r => r.status === 'present' || r.status === 'late').length;
    const totalConsidered = records.filter(r => r.status !== 'unmarked').length; 
    return totalConsidered > 0 ? Math.round((presentOrLate / totalConsidered) * 100) : 0;
  };

  const overallAttendancePercentage = calculateOverallAttendance();

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Attendance"
        subtitle="Track your attendance records and percentage."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Overall Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-4" />
          ) : (
            <p className="text-4xl font-bold text-primary my-4">{overallAttendancePercentage}%</p>
          )}
          <p className="text-sm text-muted-foreground">Based on recorded attendance.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Attendance Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading attendance log...</p>
            </div>
          ) : records.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No attendance records found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {format(parseISO(item.date), 'PPP')}
                    </TableCell>
                    <TableCell>{item.className || item.classId}</TableCell> {}
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
