
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, TrendingUp, MessageSquare, BarChart3, ClipboardCheck, Percent, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import type { GradeRecord, AttendanceRecord } from '@/types';
import { getGradesForStudent } from '@/services/gradeService';
import { getAttendanceForStudent } from '@/services/attendanceService';

// SIMULATION: In a real app, this would come from auth context or parent's profile
const CURRENT_CHILD_STUDENT_ID = "student123"; // Ensure this student ID exists with data

const getGradeBadgeVariant = (grade: string | null) => {
  if (!grade) return "secondary";
  if (grade.toUpperCase().startsWith('A')) return "default";
  if (grade.toUpperCase().startsWith('B')) return "secondary";
  if (grade.toUpperCase().startsWith('C')) return "outline";
  if (grade.toUpperCase().startsWith('D') || grade.toUpperCase() === 'FAIL' || grade.toUpperCase() === 'F') return "destructive";
  if (grade.toUpperCase() === 'PASS') return "default";
  return "outline";
};

export default function ParentPerformancePage() {
  const [grades, setGrades] = React.useState<GradeRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      if (!CURRENT_CHILD_STUDENT_ID) {
        toast({ variant: "destructive", title: "Child ID missing" });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [fetchedGrades, fetchedAttendance] = await Promise.all([
          getGradesForStudent(CURRENT_CHILD_STUDENT_ID),
          getAttendanceForStudent(CURRENT_CHILD_STUDENT_ID)
        ]);
        setGrades(fetchedGrades);
        setAttendanceRecords(fetchedAttendance as AttendanceRecord[]); // Assuming getAttendanceForStudent returns the fuller type needed
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load child's data",
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const calculateOverallGrade = () => {
    if (grades.length === 0) return "N/A";
    let totalPoints = 0;
    let gradedCourses = 0;
    grades.forEach(g => {
      if (g.grade.toUpperCase().startsWith('A')) { totalPoints += 4; gradedCourses++; }
      else if (g.grade.toUpperCase().startsWith('B')) { totalPoints += 3; gradedCourses++; }
      else if (g.grade.toUpperCase().startsWith('C')) { totalPoints += 2; gradedCourses++; }
      else if (g.grade.toUpperCase().startsWith('D')) { totalPoints += 1; gradedCourses++; }
    });
    return gradedCourses > 0 ? (totalPoints / gradedCourses).toFixed(2) : "N/A";
  };

  const overallGradeDisplay = calculateOverallGrade(); // You might want a letter grade conversion too

  const calculateAttendancePercentage = () => {
    if (attendanceRecords.length === 0) return 0;
    const presentOrLate = attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const totalConsidered = attendanceRecords.filter(r => r.status !== 'unmarked').length;
    return totalConsidered > 0 ? Math.round((presentOrLate / totalConsidered) * 100) : 0;
  };
  const attendanceSummaryPercentage = calculateAttendancePercentage();

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
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading performance data...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Grade (GPA Example)</CardTitle>
                <BarChart3 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallGradeDisplay}</div>
                <p className="text-xs text-muted-foreground">Based on recorded assessments</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Summary</CardTitle>
                <Percent className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceSummaryPercentage}%</div>
                <p className="text-xs text-muted-foreground">Overall attendance</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teacher's Note</CardTitle>
                <ClipboardCheck className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">"Great participation in class!"</p>
                <p className="text-xs text-muted-foreground">- Ms. Smith (Math) (Static Mock)</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Subject Performance
              </CardTitle>
              <CardDescription>Overview of grades by subject/assessment.</CardDescription>
            </CardHeader>
            <CardContent>
              {grades.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Grade details are not yet available for this child.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment / Subject</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.assessmentName}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getGradeBadgeVariant(item.grade)}>{item.grade}</Badge>
                        </TableCell>
                        <TableCell>{item.remarks || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Detailed Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Full term reports and detailed assessments will be available for download here. (Placeholder)
              </p>
              <Button variant="outline" disabled>Download Term Report (Soon)</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
