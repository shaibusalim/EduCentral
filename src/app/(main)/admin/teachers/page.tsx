
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, GraduationCap, Edit3, Trash2, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Teacher } from '@/types';
import { AddTeacherDialog } from '@/components/admin/teachers/AddTeacherDialog';
import { EditTeacherDialog } from '@/components/admin/teachers/EditTeacherDialog';
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
import type { TeacherFormData } from '@/components/admin/teachers/TeacherForm';
import { getTeachers, updateTeacherInFirestore, deleteTeacherFromFirestore } from '@/services/teacherService';
// addTeacherToFirestore import is removed as AddTeacherDialog handles the full creation.

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingTeacher, setEditingTeacher] = React.useState<Teacher | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingTeacherId, setDeletingTeacherId] = React.useState<string | null>(null);

  const fetchTeachers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTeachers = await getTeachers();
      setTeachers(fetchedTeachers);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load teachers",
        description: (error as Error).message || "Could not fetch teacher data from the server.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleTeacherAdded = () => {
    fetchTeachers(); // Just refresh the list
  };

  const handleOpenEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsEditDialogOpen(true);
  };

  // TeacherFormData for edit will not include password. Email is also not editable here.
  const handleUpdateTeacher = async (updatedTeacherFormData: Omit<TeacherFormData, 'password' | 'email'>) => {
    if (!editingTeacher) return;

    // Data for service doesn't include email or password
    const dataForService: Omit<Teacher, 'id' | 'email'> = {
        firstName: updatedTeacherFormData.firstName,
        lastName: updatedTeacherFormData.lastName,
        subject: updatedTeacherFormData.subject,
        dateOfJoining: format(updatedTeacherFormData.dateOfJoining, "yyyy-MM-dd"),
    };

    try {
      await updateTeacherInFirestore(editingTeacher.id, dataForService);
      toast({
        title: "Teacher Updated",
        description: `${dataForService.firstName} ${dataForService.lastName}'s details have been updated.`,
      });
      fetchTeachers(); 
      setIsEditDialogOpen(false);
      setEditingTeacher(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update teacher",
        description: (error as Error).message,
      });
    }
  };

  const handleOpenDeleteDialog = (teacherId: string) => {
    setDeletingTeacherId(teacherId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTeacher = async () => {
    if (!deletingTeacherId) return;
    const teacherToDelete = teachers.find(t => t.id === deletingTeacherId);
    try {
      // This deletes the teacher's profile from 'teachers' collection.
      // Actual Firebase Auth user deletion and 'users' role deletion would be separate admin tasks.
      await deleteTeacherFromFirestore(deletingTeacherId);
      toast({
        title: "Teacher Profile Deleted",
        description: `${teacherToDelete?.firstName || 'Teacher'}'s profile has been removed. Their auth account may still exist.`,
      });
      fetchTeachers(); 
      setIsDeleteDialogOpen(false);
      setDeletingTeacherId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete teacher profile",
        description: (error as Error).message,
      });
      setIsDeleteDialogOpen(false);
      setDeletingTeacherId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Teacher Management"
        subtitle="Manage teacher profiles, subject assignments, and class allocations."
      >
        <AddTeacherDialog onTeacherAdded={handleTeacherAdded}>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Teacher
          </Button>
        </AddTeacherDialog>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Teacher List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading teachers...</p>
            </div>
          ) : teachers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No teachers found. Click "Add New Teacher" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date of Joining</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{`${teacher.firstName} ${teacher.lastName}`}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>
                      {teacher.dateOfJoining ? format(parseISO(teacher.dateOfJoining), 'PPP') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEditDialog(teacher)} aria-label="Edit teacher">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleOpenDeleteDialog(teacher.id)} aria-label="Delete teacher">
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

      {editingTeacher && (
        <EditTeacherDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          teacherToEdit={editingTeacher}
          onTeacherUpdated={handleUpdateTeacher}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
               This action will delete the teacher's profile. Deleting their login account and role record are separate administrative tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingTeacherId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTeacher} className="bg-destructive hover:bg-destructive/90">
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
