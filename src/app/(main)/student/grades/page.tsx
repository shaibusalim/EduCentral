
"use client"; // Assuming this might need client-side interactions or hooks in the future

import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

// Mock data for student's grades
const mockStudentGrades = [
  { subject: 'Mathematics', grade: 'A', score: 92, remarks: 'Excellent understanding of concepts.' },
  { subject: 'Physics', grade: 'B+', score: 88, remarks: 'Good effort, can improve in practicals.' },
  { subject: 'English Literature', grade: 'A-', score: 90, remarks: 'Strong analytical skills.' },
  { subject: 'History', grade: 'B', score: 82, remarks: 'Consistent performance.' },
  { subject: 'Computer Science', grade: 'A', score: 95, remarks: 'Outstanding project work.' },
  { subject: 'Physical Education', grade: 'Pass', score: null, remarks: 'Active participation.' },
];

const getGradeBadgeVariant = (grade: string | null) => {
  if (!grade) return "secondary";
  if (grade.startsWith('A')) return "default";
  if (grade.startsWith('B')) return "secondary"; // Or another color
  if (grade.startsWith('C')) return "outline";
  if (grade.startsWith('D') || grade === 'Fail') return "destructive";
  return "outline";
};

export default function StudentGradesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Grades"
        subtitle="View your academic performance and report cards."
      >
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download Report Card
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
          {mockStudentGrades.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Your grades are not available yet. Please check back later.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudentGrades.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell className="text-center">{item.score ?? 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getGradeBadgeVariant(item.grade)}>{item.grade}</Badge>
                    </TableCell>
                    <TableCell>{item.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-primary">Overall GPA: 3.8 / 4.0 (Example)</p>
            <p className="text-sm text-muted-foreground">Based on the current term's performance.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
