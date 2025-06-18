
"use client"; 

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
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
import type { GradeRecord } from '@/types';
import { getGradesForStudent } from '@/services/gradeService';

// SIMULATION: In a real app, this would come from auth context
const CURRENT_STUDENT_ID = "student123"; // Replace with an actual student ID from your Firestore

const getGradeBadgeVariant = (grade: string | null) => {
  if (!grade) return "secondary";
  if (grade.toUpperCase().startsWith('A')) return "default";
  if (grade.toUpperCase().startsWith('B')) return "secondary";
  if (grade.toUpperCase().startsWith('C')) return "outline";
  if (grade.toUpperCase().startsWith('D') || grade.toUpperCase() === 'FAIL' || grade.toUpperCase() === 'F') return "destructive";
  if (grade.toUpperCase() === 'PASS') return "default"; // Treat 'Pass' like 'A' for styling for now
  return "outline";
};

export default function StudentGradesPage() {
  const [grades, setGrades] = React.useState<GradeRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchGrades = async () => {
      if (!CURRENT_STUDENT_ID) {
        toast({
          variant: "destructive",
          title: "Student ID missing",
          description: "Cannot fetch grades without a student ID.",
        });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedGrades = await getGradesForStudent(CURRENT_STUDENT_ID);
        setGrades(fetchedGrades);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load grades",
          description: (error as Error).message || "Could not fetch your grades.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrades();
  }, [toast]);

  // Calculate GPA (Example calculation, adapt as needed)
  const calculateGpa = () => {
    if (grades.length === 0) return "N/A";
    let totalPoints = 0;
    let gradedCourses = 0;
    grades.forEach(g => {
      // This is a very simplified GPA logic
      if (g.grade.toUpperCase().startsWith('A')) { totalPoints += 4; gradedCourses++; }
      else if (g.grade.toUpperCase().startsWith('B')) { totalPoints += 3; gradedCourses++; }
      else if (g.grade.toUpperCase().startsWith('C')) { totalPoints += 2; gradedCourses++; }
      else if (g.grade.toUpperCase().startsWith('D')) { totalPoints += 1; gradedCourses++; }
      // 'F' or 'Fail' count as 0, 'Pass' might not count towards GPA depending on system
    });
    return gradedCourses > 0 ? (totalPoints / gradedCourses).toFixed(2) : "N/A";
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Grades"
        subtitle="View your academic performance and report cards."
      >
        <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" /> Download Report Card (Soon)
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading your grades...</p>
            </div>
          ) : grades.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Your grades are not available yet. Please check back later or contact your teacher.
            </p>
          ) : (
            <>
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
              <div className="mt-6 text-center">
                <p className="text-lg font-semibold text-primary">Overall GPA: {calculateGpa()} (Example)</p>
                <p className="text-sm text-muted-foreground">Based on available graded assessments.</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
