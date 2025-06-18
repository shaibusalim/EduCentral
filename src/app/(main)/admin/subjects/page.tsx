
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, BookOpen, Edit3, Trash2, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubjectItem } from '@/types';
import { AddSubjectDialog } from '@/components/admin/subjects/AddSubjectDialog';
import { EditSubjectDialog } from '@/components/admin/subjects/EditSubjectDialog';
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
import type { SubjectFormData } from '@/components/admin/subjects/SubjectForm';
import { getSubjects, addSubjectToFirestore, updateSubjectInFirestore, deleteSubjectFromFirestore } from '@/services/subjectService';

export default function SubjectManagementPage() {
  const [subjects, setSubjects] = React.useState<SubjectItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<SubjectItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingSubjectId, setDeletingSubjectId] = React.useState<string | null>(null);

  const fetchSubjects = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedSubjects = await getSubjects();
      setSubjects(fetchedSubjects);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load subjects",
        description: (error as Error).message || "Could not fetch subject data from the server.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleAddSubject = async (newSubjectData: Omit<SubjectItem, 'id'>) => {
    try {
      await addSubjectToFirestore(newSubjectData);
      toast({
        title: "Subject Added",
        description: `${newSubjectData.name} has been successfully added.`,
      });
      fetchSubjects(); // Refresh list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add subject",
        description: (error as Error).message,
      });
    }
  };

  const handleOpenEditDialog = (subjectItem: SubjectItem) => {
    setEditingSubject(subjectItem);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubject = async (updatedSubjectData: SubjectFormData) => {
    if (!editingSubject) return;
    try {
      await updateSubjectInFirestore(editingSubject.id, updatedSubjectData);
      toast({
        title: "Subject Updated",
        description: `${updatedSubjectData.name}'s details have been updated.`,
      });
      fetchSubjects(); // Refresh list
      setIsEditDialogOpen(false);
      setEditingSubject(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update subject",
        description: (error as Error).message,
      });
    }
  };

  const handleOpenDeleteDialog = (subjectId: string) => {
    setDeletingSubjectId(subjectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSubject = async () => {
    if (!deletingSubjectId) return;
    const subjectToDelete = subjects.find(s => s.id === deletingSubjectId);
    try {
      await deleteSubjectFromFirestore(deletingSubjectId);
      toast({
        title: "Subject Deleted",
        description: `${subjectToDelete?.name || 'Subject'} has been removed.`,
      });
      fetchSubjects(); // Refresh list
      setIsDeleteDialogOpen(false);
      setDeletingSubjectId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete subject",
        description: (error as Error).message,
      });
      setIsDeleteDialogOpen(false);
      setDeletingSubjectId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Subject Management"
        subtitle="Create, edit, and manage school subjects."
      >
        <AddSubjectDialog onSubjectAdded={handleAddSubject}>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
          </Button>
        </AddSubjectDialog>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Subject List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading subjects...</p>
            </div>
          ) : subjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No subjects found. Click "Add New Subject" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subjectItem) => (
                  <TableRow key={subjectItem.id}>
                    <TableCell>{subjectItem.name}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEditDialog(subjectItem)} aria-label="Edit subject">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleOpenDeleteDialog(subjectItem.id)} aria-label="Delete subject">
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

      {editingSubject && (
        <EditSubjectDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          subjectToEdit={editingSubject}
          onSubjectUpdated={handleUpdateSubject}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subject record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSubjectId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSubject} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
