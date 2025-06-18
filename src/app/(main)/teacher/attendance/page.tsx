
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserCheck, CheckCircle, XCircle, Clock, Send, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MockClass {
  id: string;
  name: string;
}

interface MockStudent {
  id: string;
  name: string;
}

interface StudentAttendanceRecord {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'unmarked';
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
    { id: 's104', name: 'Diana Prince' },
  ],
  class2: [
    { id: 's201', name: 'Edward Nigma' },
    { id: 's202', name: 'Fiona Gallagher' },
    { id: 's203', name: 'George Abitbol' },
  ],
  class3: [
    { id: 's301', name: 'Hannah Montana' },
    { id: 's302', name: 'Iris West' },
    { id: 's303', name: 'Jack Sparrow' },
    { id: 's304', name: 'Kara Zor-El' },
    { id: 's305', name: 'Liam Neeson' },
  ],
};

export default function MarkAttendancePage() {
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = React.useState<StudentAttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const { toast } = useToast();

  React.useEffect(() => {
    if (selectedClassId && mockStudentsByClass[selectedClassId]) {
      setAttendanceRecords(
        mockStudentsByClass[selectedClassId].map(student => ({
          studentId: student.id,
          studentName: student.name,
          status: 'unmarked',
        }))
      );
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedClassId, selectedDate]); // Reset records if class or date changes

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prevRecords =>
      prevRecords.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSubmitAttendance = () => {
    const unmarkedStudents = attendanceRecords.filter(r => r.status === 'unmarked').length;
    if (unmarkedStudents > 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Attendance",
        description: `Please mark attendance for all ${unmarkedStudents} remaining student(s).`,
      });
      return;
    }

    const className = mockClasses.find(c => c.id === selectedClassId)?.name || 'the class';
    const dateStr = format(selectedDate, 'PPP');

    console.log("Attendance Submitted:", { date: dateStr, className, records: attendanceRecords });
    toast({
      title: "Attendance Submitted",
      description: `Attendance for ${className} on ${dateStr} has been recorded. (${attendanceRecords.length} students)`,
    });
  };

  const getAttendanceIcon = (status: StudentAttendanceRecord['status']) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

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
              <Select onValueChange={setSelectedClassId} value={selectedClassId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
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
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {selectedClassId && attendanceRecords.length > 0 && (
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
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.studentId}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell className="text-center">
                        <RadioGroup
                          value={record.status === 'unmarked' ? undefined : record.status}
                          onValueChange={(value) => handleAttendanceChange(record.studentId, value as 'present' | 'absent' | 'late')}
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
          )}
          {selectedClassId && attendanceRecords.length === 0 && (
             <p className="text-center text-muted-foreground py-4">No students found for this class or class not selected.</p>
          )}
           {!selectedClassId && (
             <p className="text-center text-muted-foreground py-4">Please select a class to view students.</p>
          )}
        </CardContent>
        {selectedClassId && attendanceRecords.length > 0 && (
          <CardFooter className="border-t pt-6">
            <Button 
              onClick={handleSubmitAttendance} 
              disabled={attendanceRecords.some(r => r.status === 'unmarked')}
              className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Attendance for {mockClasses.find(c => c.id === selectedClassId)?.name} on {format(selectedDate, 'MMM d')}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}


    