
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserCheck, CheckCircle, XCircle, Clock, Send, CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ClassItem, Student, AttendanceStatus, AttendanceRecord } from '@/types';
import { getClasses } from '@/services/classService';
import { getStudents } from '@/services/studentService';
import { getAttendanceForClass, saveOrUpdateStudentAttendance } from '@/services/attendanceService';

interface DisplayStudentForAttendance {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  // existingRecordId?: string; // To track if we're updating or creating
}

export default function MarkAttendancePage() {
  const [allClasses, setAllClasses] = React.useState<ClassItem[]>([]);
  const [allStudents, setAllStudents] = React.useState<Student[]>([]);
  
  const [selectedClass, setSelectedClass] = React.useState<ClassItem | null>(null);
  const [displayedStudents, setDisplayedStudents] = React.useState<DisplayStudentForAttendance[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  
  const [isLoadingClasses, setIsLoadingClasses] = React.useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(false); // Initially false, true when class selected
  const [isLoadingAttendance, setIsLoadingAttendance] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { toast } = useToast();

  // Fetch all classes for the dropdown
  React.useEffect(() => {
    const fetchClasses = async () => {
      setIsLoadingClasses(true);
      try {
        const fetchedClasses = await getClasses();
        setAllClasses(fetchedClasses);
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to load classes", description: (error as Error).message });
      } finally {
        setIsLoadingClasses(false);
      }
    };
    fetchClasses();
  }, [toast]);

  // Fetch all students once
   React.useEffect(() => {
    const fetchAllStudents = async () => {
      setIsLoadingStudents(true); // Show general student loading initially
      try {
        const fetchedStudents = await getStudents();
        setAllStudents(fetchedStudents);
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to load student data", description: (error as Error).message });
      } finally {
        setIsLoadingStudents(false);
      }
    };
    fetchAllStudents();
  }, [toast]);


  // Effect to filter students and load attendance when class or date changes
  React.useEffect(() => {
    if (!selectedClass || allStudents.length === 0) {
      setDisplayedStudents([]);
      return;
    }

    setIsLoadingAttendance(true); // For loading attendance data specifically
    
    // Crude filtering: Assumes class name contains "Grade X" and student.grade is "Grade X"
    const gradeInClassName = selectedClass.name.match(/Grade\s*\d+/i);
    const classGrade = gradeInClassName ? gradeInClassName[0] : null;

    const studentsForClass = allStudents.filter(student => {
      if (!classGrade) return false; // If class name doesn't specify grade, can't filter
      return student.grade.toLowerCase() === classGrade.toLowerCase();
    });

    let initialAttendanceRecords: DisplayStudentForAttendance[] = studentsForClass.map(student => ({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      status: 'unmarked',
    }));

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    getAttendanceForClass(selectedClass.id, formattedDate)
      .then(fetchedAttendance => {
        initialAttendanceRecords = initialAttendanceRecords.map(displayStudent => {
          const existingRecord = fetchedAttendance.find(rec => rec.studentId === displayStudent.studentId);
          return existingRecord ? { ...displayStudent, status: existingRecord.status } : displayStudent;
        });
        setDisplayedStudents(initialAttendanceRecords);
      })
      .catch(error => {
        toast({ variant: "destructive", title: "Failed to load existing attendance", description: (error as Error).message });
        setDisplayedStudents(initialAttendanceRecords); // Show students even if attendance fetch fails
      })
      .finally(() => {
        setIsLoadingAttendance(false);
      });

  }, [selectedClass, selectedDate, allStudents, toast]);


  const handleClassChange = (classId: string) => {
    const newSelectedClass = allClasses.find(c => c.id === classId) || null;
    setSelectedClass(newSelectedClass);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setDisplayedStudents(prevRecords =>
      prevRecords.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSubmitAttendance = async () => {
    if (!selectedClass) {
      toast({ variant: "destructive", title: "No class selected" });
      return;
    }
    const unmarkedStudents = displayedStudents.filter(r => r.status === 'unmarked').length;
    if (unmarkedStudents > 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Attendance",
        description: `Please mark attendance for all ${unmarkedStudents} remaining student(s).`,
      });
      return;
    }

    setIsSubmitting(true);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const attendanceDataToSave = displayedStudents
      .filter(s => s.status !== 'unmarked') // Only save if not 'unmarked'
      .map(s => ({ studentId: s.studentId, studentName: s.studentName, status: s.status }));

    try {
      await saveOrUpdateStudentAttendance(selectedClass.id, formattedDate, attendanceDataToSave);
      toast({
        title: "Attendance Submitted",
        description: `Attendance for ${selectedClass.name} on ${format(selectedDate, 'PPP')} has been recorded.`,
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Failed", description: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendanceIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };
  
  const noStudentsMessage = !selectedClass 
    ? "Please select a class to view students."
    : (isLoadingClasses || isLoadingStudents) 
    ? "Loading students..."
    : "No students found for this class based on the current filtering (matching student grade to class name). Please check student records or class naming.";


  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Mark Attendance"
        subtitle="Select a class and date to record daily student attendance."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Attendance Sheet for {format(selectedDate, 'PPP')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Select onValueChange={handleClassChange} value={selectedClass?.id || ""}>
                <SelectTrigger disabled={isLoadingClasses}>
                  <SelectValue placeholder={isLoadingClasses ? "Loading classes..." : "Select a class"} />
                </SelectTrigger>
                <SelectContent>
                  {allClasses.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => date > new Date()} // Optional: disable future dates
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          { (isLoadingStudents && !selectedClass) || (isLoadingAttendance && selectedClass) ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading data...</p>
            </div>
          ) : displayedStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Student Name</TableHead>
                    <TableHead className="text-center">Attendance Status</TableHead>
                    <TableHead className="w-[80px] text-center">Selected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedStudents.map((record) => (
                    <TableRow key={record.studentId}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell className="text-center">
                        <RadioGroup
                          value={record.status === 'unmarked' ? undefined : record.status}
                          onValueChange={(value) => handleAttendanceChange(record.studentId, value as AttendanceStatus)}
                          className="flex justify-center space-x-2 sm:space-x-4"
                        >
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="present" id={`${record.studentId}-present`} />
                            <Label htmlFor={`${record.studentId}-present`} className="cursor-pointer flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-600 hidden sm:inline" /> Present
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="absent" id={`${record.studentId}-absent`} />
                            <Label htmlFor={`${record.studentId}-absent`} className="cursor-pointer flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-600 hidden sm:inline" /> Absent
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="late" id={`${record.studentId}-late`} />
                            <Label htmlFor={`${record.studentId}-late`} className="cursor-pointer flex items-center gap-1">
                             <Clock className="h-4 w-4 text-yellow-600 hidden sm:inline" /> Late
                            </Label>
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell className="text-center h-full">
                        <div className="flex justify-center items-center h-full">
                          {getAttendanceIcon(record.status)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-4">{noStudentsMessage}</p>
          )}
        </CardContent>
        {selectedClass && displayedStudents.length > 0 && (
          <CardFooter className="border-t pt-6">
            <Button 
              onClick={handleSubmitAttendance} 
              disabled={isSubmitting || displayedStudents.some(r => r.status === 'unmarked')}
              className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Submitting...' : `Submit Attendance for ${selectedClass.name} on ${format(selectedDate, 'MMM d')}`}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
