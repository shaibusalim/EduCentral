
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
import { EditStudentDialog } from '@/components/admin/students/EditStudentDialog';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { StudentFormData } from '@/components/admin/students/StudentForm';


// Mock initial student data
const initialStudents: Student[] = [
  { id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', grade: 'Grade 10', dateOfBirth: '2008-05-15' },
  { id: '2', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', grade: 'Grade 9', dateOfBirth: '2009-02-20' },
  { id: '3', firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', grade: 'Grade 11', dateOfBirth: '2007-11-10' },
];

export default function StudentManagementPage() {
  const [students, setStudents] = React.useState<Student[]>(initialStudents);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingStudentId, setDeletingStudentId] = React.useState<string | null>(null);

  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      id: Date.now().toString(), 
      ...newStudentData,
    };
    setStudents((prevStudents) => [newStudent, ...prevStudents]);
    toast({
      title: "Student Added",
      description: `${newStudent.firstName} ${newStudent.lastName} has been successfully added.`,
    });
  };

  const handleOpenEditDialog = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = (updatedStudentData: StudentFormData) => {
    if (!editingStudent) return;

    const updatedStudent: Student = {
      ...editingStudent,
      ...updatedStudentData,
      dateOfBirth: format(updatedStudentData.dateOfBirth, "yyyy-MM-dd"),
    };

    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    toast({
      title: "Student Updated",
      description: `${updatedStudent.firstName} ${updatedStudent.lastName}'s details have been updated.`,
    });
    setIsEditDialogOpen(false);
    setEditingStudent(null);
  };

  const handleOpenDeleteDialog = (studentId: string) => {
    setDeletingStudentId(studentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = () => {
    if (!deletingStudentId) return;
    const studentToDelete = students.find(s => s.id === deletingStudentId);
    setStudents((prevStudents) => prevStudents.filter(student => student.id !== deletingStudentId));
    toast({
      title: "Student Deleted",
      description: `${studentToDelete?.firstName || 'Student'} has been removed.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
    setDeletingStudentId(null);
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
                      <Button variant="outline" size="icon" onClick={() => handleOpenEditDialog(student)} aria-label="Edit student">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleOpenDeleteDialog(student.id)} aria-label="Delete student">
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

      {editingStudent && (
        <EditStudentDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          studentToEdit={editingStudent}
          onStudentUpdated={handleUpdateStudent}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student's record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingStudentId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStudent} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
