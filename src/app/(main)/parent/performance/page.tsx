
"use client";

import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, TrendingUp, MessageSquare, BarChart3, ClipboardCheck, Percent } from 'lucide-react';
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

// Mock data
const mockOverallGrade = "A-";
const mockAttendanceSummary = "97%";
const mockRecentSubjects = [
  { name: "Mathematics", grade: "A", score: 92 },
  { name: "Science", grade: "B+", score: 88 },
  { name: "English", grade: "A-", score: 90 },
];

const getGradeBadgeVariant = (grade: string | null) => {
  if (!grade) return "secondary";
  if (grade.startsWith('A')) return "default";
  if (grade.startsWith('B')) return "secondary";
  if (grade.startsWith('C')) return "outline";
  return "destructive";
};

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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOverallGrade}</div>
            <p className="text-xs text-muted-foreground">Excellent progress this term</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Summary</CardTitle>
            <Percent className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAttendanceSummary}</div>
            <p className="text-xs text-muted-foreground">Based on last 30 days</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher's Note</CardTitle>
            <ClipboardCheck className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">"Great participation in class!"</p>
            <p className="text-xs text-muted-foreground">- Ms. Smith (Math)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Subject Performance
          </CardTitle>
          <CardDescription>Overview of recent grades by subject.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockRecentSubjects.length === 0 ? (
             <p className="text-center text-muted-foreground py-8">
              Grade details are not yet available.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentSubjects.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">{item.score}%</TableCell>
                    <TableCell className="text-center">
                       <Badge variant={getGradeBadgeVariant(item.grade)}>{item.grade}</Badge>
                    </TableCell>
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
            Full term reports and detailed assessments will be available for download here.
          </p>
          <Button variant="outline">Download Term Report (Placeholder)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
