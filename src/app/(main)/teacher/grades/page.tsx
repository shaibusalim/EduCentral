
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ClassItem, Student, GradeRecord } from '@/types';
import { getClasses } from '@/services/classService';
import { getStudents } from '@/services/studentService';
import { getGradesForClassAssessment, saveOrUpdateStudentGrades } from '@/services/gradeService';

interface StudentGradeEntry {
  studentId: string;
  studentName: string;
  grade: string;
  remarks: string;
}

export default function EnterGradesPage() {
  const [allClasses, setAllClasses] = React.useState<ClassItem[]>([]);
  const [allStudents, setAllStudents] = React.useState<Student[]>([]);
  
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);
  const [assessmentName, setAssessmentName] = React.useState<string>('');
  const [gradesData, setGradesData] = React.useState<StudentGradeEntry[]>([]);
  
  const [isLoadingClasses, setIsLoadingClasses] = React.useState(true);
  const [isLoadingStudentsState, setIsLoadingStudentsState] = React.useState(true);
  const [isLoadingGrades, setIsLoadingGrades] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingClasses(true);
      setIsLoadingStudentsState(true);
      try {
        const [fetchedClasses, fetchedStudents] = await Promise.all([
          getClasses(),
          getStudents()
        ]);
        setAllClasses(fetchedClasses);
        setAllStudents(fetchedStudents);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load initial data",
          description: (error as Error).message || "Could not fetch classes or students.",
        });
      } finally {
        setIsLoadingClasses(false);
        setIsLoadingStudentsState(false);
      }
    };
    fetchInitialData();
  }, [toast]);

  // Effect to filter students for the selected class
  React.useEffect(() => {
    if (selectedClassId && allClasses.length > 0 && allStudents.length > 0) {
      const selectedClass = allClasses.find(c => c.id === selectedClassId);
      if (!selectedClass) {
        setGradesData([]);
        return;
      }

      const gradeInClassName = selectedClass.name.match(/Grade\s*\d+/i);
      const classGradeFilter = gradeInClassName ? gradeInClassName[0].toLowerCase() : null;

      const studentsForClass = allStudents.filter(student => 
        classGradeFilter ? student.grade.toLowerCase() === classGradeFilter : false
      );
      
      // Initialize gradesData with students for the class, default empty grades/remarks
      setGradesData(
        studentsForClass.map(student => ({
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          grade: '', 
          remarks: '',
        }))
      );
    } else {
      setGradesData([]);
    }
  }, [selectedClassId, allClasses, allStudents]);

  // Effect to load existing grades when class and assessment name are set
  React.useEffect(() => {
    if (selectedClassId && assessmentName.trim() && gradesData.length > 0) {
      setIsLoadingGrades(true);
      getGradesForClassAssessment(selectedClassId, assessmentName.trim())
        .then(fetchedGrades => {
          setGradesData(prevData =>
            prevData.map(studentEntry => {
              const existingGrade = fetchedGrades.find(fg => fg.studentId === studentEntry.studentId);
              return existingGrade
                ? { ...studentEntry, grade: existingGrade.grade, remarks: existingGrade.remarks }
                : studentEntry; // Keep current (likely empty) if no existing grade found
            })
          );
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Failed to load existing grades",
            description: (error as Error).message,
          });
        })
        .finally(() => {
          setIsLoadingGrades(false);
        });
    }
  }, [selectedClassId, assessmentName, toast, gradesData.length > 0 && gradesData[0]?.studentId]); // Re-run if student list changes but also need assessmentName

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
    if (!selectedClassId || !assessmentName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a class and enter an assessment name.",
      });
      return;
    }

    const emptyGradesCount = gradesData.filter(g => !g.grade.trim()).length;
    if (emptyGradesCount > 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Grades",
        description: `Please enter grades for all ${emptyGradesCount} remaining student(s) or ensure all students have a grade.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await saveOrUpdateStudentGrades(selectedClassId, assessmentName.trim(), gradesData);
      const currentClass = allClasses.find(c => c.id === selectedClassId);
      toast({
        title: "Grades Submitted Successfully",
        description: `Grades for ${assessmentName} in ${currentClass?.name || 'selected class'} have been saved.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNoStudentsMessage = () => {
    if (!selectedClassId) return "Please select a class to enter grades.";
    if (isLoadingClasses || isLoadingStudentsState) return "Loading students...";
    if (gradesData.length === 0 && selectedClassId) return "No students found for this class based on grade filter.";
    return "Please select a class to enter grades.";
  };
  
  const canSubmit = selectedClassId && assessmentName.trim() && gradesData.length > 0 && !isLoadingGrades;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              onValueChange={(value) => { setSelectedClassId(value); setAssessmentName(''); setGradesData([]); }} 
              value={selectedClassId || ""}
              disabled={isLoadingClasses || allClasses.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingClasses ? "Loading classes..." : (allClasses.length === 0 ? "No classes available" : "Select a class to grade")} />
              </SelectTrigger>
              <SelectContent>
                {allClasses.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Assessment Name (e.g., Mid-Term Exam)"
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              disabled={!selectedClassId || isLoadingGrades}
            />
          </div>

          { (isLoadingClasses || (selectedClassId && isLoadingStudentsState)) && !assessmentName && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading class data...</p>
            </div>
          )}

          { selectedClassId && assessmentName && isLoadingGrades && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading grades...</p>
            </div>
          )}

          { !isLoadingClasses && !isLoadingStudentsState && selectedClassId && gradesData.length > 0 && !isLoadingGrades && (
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
                          disabled={isSubmitting}
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={record.remarks}
                          onChange={(e) => handleRemarksChange(record.studentId, e.target.value)}
                          placeholder="Enter remarks..."
                          rows={1}
                          className="min-h-[40px]"
                          disabled={isSubmitting}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          { !isLoadingClasses && !isLoadingStudentsState && !isLoadingGrades && (!selectedClassId || (selectedClassId && gradesData.length === 0)) && (
             <p className="text-center text-muted-foreground py-4">{getNoStudentsMessage()}</p>
          )}

        </CardContent>
        { canSubmit && (
          <CardFooter className="border-t pt-6">
            <Button 
              onClick={handleSubmitGrades} 
              disabled={isSubmitting || gradesData.some(g => !g.grade.trim() && g.remarks.trim()) || (gradesData.length > 0 && !gradesData.some(g => g.grade.trim()))} // Disable if any remarks without grade, or no grades at all
              className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Submitting...' : `Submit Grades for ${assessmentName || 'this assessment'}`}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

