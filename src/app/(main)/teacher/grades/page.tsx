
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, UploadCloud, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MockClass {
  id: string;
  name: string;
}

interface MockStudent {
  id: string;
  name: string;
}

interface StudentGradeData {
  studentId: string;
  studentName: string;
  grade: string;
  remarks: string;
}

const mockClasses: MockClass[] = [
  { id: 'class1', name: 'Grade 10A - Mathematics' },
  { id: 'class2', name: 'Grade 11B - Physics' },
  { id: 'class3', name: 'Grade 9C - English' },
];

const mockStudentsByClass: Record<string, MockStudent[]> = {
  class1: [
    { id: 's101', name: 'Alice Smith' },
    { id: 's102', name: 'Bob Johnson' },
    { id: 's103', name: 'Charlie Brown' },
  ],
  class2: [
    { id: 's201', name: 'Edward Nigma' },
    { id: 's202', name: 'Fiona Gallagher' },
  ],
  class3: [
    { id: 's301', name: 'Hannah Montana' },
    { id: 's302', name: 'Iris West' },
    { id: 's303', name: 'Jack Sparrow' },
  ],
};

export default function EnterGradesPage() {
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);
  const [gradesData, setGradesData] = React.useState<StudentGradeData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (selectedClassId && mockStudentsByClass[selectedClassId]) {
      setGradesData(
        mockStudentsByClass[selectedClassId].map(student => ({
          studentId: student.id,
          studentName: student.name,
          grade: '',
          remarks: '',
        }))
      );
    } else {
      setGradesData([]);
    }
  }, [selectedClassId]);

  const handleGradeChange = (studentId: string, value: string) => {
    setGradesData(prevData =>
      prevData.map(item =>
        item.studentId === studentId ? { ...item, grade: value } : item
      )
    );
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setGradesData(prevData =>
      prevData.map(item =>
        item.studentId === studentId ? { ...item, remarks: value } : item
      )
    );
  };

  const handleSubmitGrades = async () => {
    if (!selectedClassId) {
      toast({
        variant: "destructive",
        title: "No Class Selected",
        description: "Please select a class before submitting grades.",
      });
      return;
    }

    const emptyGrades = gradesData.filter(g => !g.grade.trim()).length;
    if (emptyGrades > 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Grades",
        description: `Please enter grades for all ${emptyGrades} remaining student(s).`,
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const className = mockClasses.find(c => c.id === selectedClassId)?.name || 'the class';
    console.log("Grades Submitted:", { className, grades: gradesData });
    toast({
      title: "Grades Submitted Successfully",
      description: `Grades for ${className} have been recorded. (${gradesData.length} students)`,
    });
    setIsLoading(false);
    // Optionally, clear the form or redirect
    // setSelectedClassId(null); 
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Enter Grades"
        subtitle="Submit student grades and remarks for exams and assignments."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Grading Portal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full md:w-1/2">
            <Select onValueChange={setSelectedClassId} value={selectedClassId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class to grade" />
              </SelectTrigger>
              <SelectContent>
                {mockClasses.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClassId && gradesData.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Student Name</TableHead>
                    <TableHead className="w-[120px]">Grade</TableHead>
                    <TableHead>Remarks (Optional)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesData.map((record) => (
                    <TableRow key={record.studentId}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>
                        <Input
                          value={record.grade}
                          onChange={(e) => handleGradeChange(record.studentId, e.target.value)}
                          placeholder="e.g., A+"
                          className="max-w-[100px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={record.remarks}
                          onChange={(e) => handleRemarksChange(record.studentId, e.target.value)}
                          placeholder="Enter remarks..."
                          rows={1}
                          className="min-h-[40px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {selectedClassId && gradesData.length === 0 && (
             <p className="text-center text-muted-foreground py-4">No students found for this class.</p>
          )}
           {!selectedClassId && (
             <p className="text-center text-muted-foreground py-4">Please select a class to enter grades.</p>
          )}
        </CardContent>
        {selectedClassId && gradesData.length > 0 && (
          <CardFooter className="border-t pt-6">
            <Button 
              onClick={handleSubmitGrades} 
              disabled={isLoading || gradesData.some(g => !g.grade.trim())}
              className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? <UploadCloud className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isLoading ? 'Submitting...' : `Submit Grades for ${mockClasses.find(c => c.id === selectedClassId)?.name}`}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
