
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, Edit3, Trash2, Loader2 } from 'lucide-react';
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
import { getStudents, updateStudentInFirestore, deleteStudentFromFirestore } from '@/services/studentService';
// Removed addStudentToFirestore import here as AddStudentDialog handles the full creation.

export default function StudentManagementPage() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingStudentId, setDeletingStudentId] = React.useState<string | null>(null);

  const fetchStudents = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedStudents = await getStudents();
      setStudents(fetchedStudents);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load students",
        description: (error as Error).message || "Could not fetch student data from the server.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // This handler is simplified as AddStudentDialog now manages its own logic including Firestore.
  const handleStudentAdded = () => {
    fetchStudents(); // Just refresh the list
  };

  const handleOpenEditDialog = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };
  
  // StudentFormData for edit will not include password.
  // The StudentForm will conditionally hide the password field in edit mode.
  const handleUpdateStudent = async (updatedStudentFormData: Omit<StudentFormData, 'password'>) => {
    if (!editingStudent) return;

    // Data for service doesn't include email (can't change) or password (not edited here)
    const dataForService: Omit<Student, 'id' | 'email'> = {
        firstName: updatedStudentFormData.firstName,
        lastName: updatedStudentFormData.lastName,
        grade: updatedStudentFormData.grade,
        dateOfBirth: format(updatedStudentFormData.dateOfBirth, "yyyy-MM-dd"),
    };

    try {
      await updateStudentInFirestore(editingStudent.id, dataForService);
      toast({
        title: "Student Updated",
        description: `${dataForService.firstName} ${dataForService.lastName}'s details have been updated.`,
      });
      fetchStudents(); 
      setIsEditDialogOpen(false);
      setEditingStudent(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update student",
        description: (error as Error).message,
      });
    }
  };

  const handleOpenDeleteDialog = (studentId: string) => {
    setDeletingStudentId(studentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (!deletingStudentId) return;
    const studentToDelete = students.find(s => s.id === deletingStudentId);
    try {
      // Deleting from 'students' collection.
      // Actual Firebase Auth user deletion and 'users' role deletion would be separate, more complex operations.
      // For now, we only delete the student profile.
      await deleteStudentFromFirestore(deletingStudentId);
      toast({
        title: "Student Profile Deleted",
        description: `${studentToDelete?.firstName || 'Student'}'s profile has been removed. Their auth account may still exist.`,
      });
      fetchStudents(); 
      setIsDeleteDialogOpen(false);
      setDeletingStudentId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete student profile",
        description: (error as Error).message,
      });
      setIsDeleteDialogOpen(false);
      setDeletingStudentId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Student Management"
        subtitle="Add, edit, and manage student profiles and information."
      >
        <AddStudentDialog onStudentAdded={handleStudentAdded}>
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
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
                      {student.dateOfBirth ? format(parseISO(student.dateOfBirth), 'PPP') : 'N/A'}
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
              This action will delete the student's profile. Deleting their login account and role record are separate administrative tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingStudentId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStudent} className="bg-destructive hover:bg-destructive/90">
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
