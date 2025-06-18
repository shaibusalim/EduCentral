
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, School, Edit3, Trash2, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClassItem } from '@/types';
import { AddClassDialog } from '@/components/admin/classes/AddClassDialog';
import { EditClassDialog } from '@/components/admin/classes/EditClassDialog';
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
import type { ClassFormData } from '@/components/admin/classes/ClassForm';
import { getClasses, addClassToFirestore, updateClassInFirestore, deleteClassFromFirestore } from '@/services/classService';

export default function ClassManagementPage() {
  const [classes, setClasses] = React.useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<ClassItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingClassId, setDeletingClassId] = React.useState<string | null>(null);

  const fetchClasses = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedClasses = await getClasses();
      setClasses(fetchedClasses);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load classes",
        description: (error as Error).message || "Could not fetch class data from the server.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleAddClass = async (newClassData: Omit<ClassItem, 'id'>) => {
    try {
      await addClassToFirestore(newClassData);
      toast({
        title: "Class Added",
        description: `${newClassData.name} has been successfully added.`,
      });
      fetchClasses(); // Refresh list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add class",
        description: (error as Error).message,
      });
    }
  };

  const handleOpenEditDialog = (classItem: ClassItem) => {
    setEditingClass(classItem);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClass = async (updatedClassFormData: ClassFormData) => {
    if (!editingClass) return;
    try {
      await updateClassInFirestore(editingClass.id, updatedClassFormData);
      toast({
        title: "Class Updated",
        description: `${updatedClassFormData.name}'s details have been updated.`,
      });
      fetchClasses(); // Refresh list
      setIsEditDialogOpen(false);
      setEditingClass(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update class",
        description: (error as Error).message,
      });
    }
  };

  const handleOpenDeleteDialog = (classId: string) => {
    setDeletingClassId(classId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClass = async () => {
    if (!deletingClassId) return;
    const classToDelete = classes.find(c => c.id === deletingClassId);
    try {
      await deleteClassFromFirestore(deletingClassId);
      toast({
        title: "Class Deleted",
        description: `${classToDelete?.name || 'Class'} has been removed.`,
      });
      fetchClasses(); // Refresh list
      setIsDeleteDialogOpen(false);
      setDeletingClassId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete class",
        description: (error as Error).message,
      });
      setIsDeleteDialogOpen(false);
      setDeletingClassId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Class Management"
        subtitle="Create, edit, and manage classes and sections."
      >
        <AddClassDialog onClassAdded={handleAddClass}>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Class
          </Button>
        </AddClassDialog>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            Class List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading classes...</p>
            </div>
          ) : classes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No classes found. Click "Add New Class" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Assigned Teacher</TableHead>
                  <TableHead>Room Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>{classItem.name}</TableCell>
                    <TableCell>{classItem.assignedTeacherName}</TableCell>
                    <TableCell>{classItem.roomNumber || 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEditDialog(classItem)} aria-label="Edit class">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleOpenDeleteDialog(classItem.id)} aria-label="Delete class">
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

      {editingClass && (
        <EditClassDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          classToEdit={editingClass}
          onClassUpdated={handleUpdateClass}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingClassId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClass} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
