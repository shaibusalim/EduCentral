
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, Edit3, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Student } from '@/types';
import { AddStudentDialog } from '@/components/admin/students/AddStudentDialog';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Mock initial student data
const initialStudents: Student[] = [
  { id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', grade: 'Grade 10', dateOfBirth: '2008-05-15' },
  { id: '2', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', grade: 'Grade 9', dateOfBirth: '2009-02-20' },
  { id: '3', firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', grade: 'Grade 11', dateOfBirth: '2007-11-10' },
];

export default function StudentManagementPage() {
  const [students, setStudents] = React.useState<Student[]>(initialStudents);
  const { toast } = useToast();

  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      id: Date.now().toString(), // Simple ID generation
      ...newStudentData,
    };
    setStudents((prevStudents) => [newStudent, ...prevStudents]);
    toast({
      title: "Student Added",
      description: `${newStudent.firstName} ${newStudent.lastName} has been successfully added.`,
    });
  };

  const handleEditStudent = (studentId: string) => {
    // Placeholder for edit functionality
    console.log("Edit student:", studentId);
    toast({
      title: "Edit Action (Placeholder)",
      description: `Edit functionality for student ID ${studentId} will be implemented here.`,
    });
    // In a real app, you would typically open an EditStudentDialog
    // and pre-fill it with the student's data.
  };

  const handleDeleteStudent = (studentId: string) => {
    // Placeholder for delete functionality
    // In a real app, you would show a confirmation dialog first.
    setStudents((prevStudents) => prevStudents.filter(student => student.id !== studentId));
    toast({
      title: "Student Deleted (Mock)",
      description: `Student ID ${studentId} has been removed from the list.`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Student Management"
        subtitle="Add, edit, and manage student profiles and information."
      >
        <AddStudentDialog onStudentAdded={handleAddStudent}>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Student
          </Button>
        </AddStudentDialog>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Student List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No students found. Click "Add New Student" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      {format(parseISO(student.dateOfBirth), 'PPP')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditStudent(student.id)} aria-label="Edit student">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteStudent(student.id)} aria-label="Delete student">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
