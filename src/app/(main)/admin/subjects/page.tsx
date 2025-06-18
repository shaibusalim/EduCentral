
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, BookOpen, Edit3, Trash2 } from 'lucide-react';
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

// Mock initial subject data
const initialSubjects: SubjectItem[] = [
  { id: 's1', name: 'Mathematics' },
  { id: 's2', name: 'Physics' },
  { id: 's3', name: 'English Literature' },
  { id: 's4', name: 'History' },
];

export default function SubjectManagementPage() {
  const [subjects, setSubjects] = React.useState<SubjectItem[]>(initialSubjects);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<SubjectItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingSubjectId, setDeletingSubjectId] = React.useState<string | null>(null);

  const handleAddSubject = (newSubjectData: Omit<SubjectItem, 'id'>) => {
    const newSubject: SubjectItem = {
      id: `s${Date.now().toString()}`, 
      ...newSubjectData,
    };
    setSubjects((prevSubjects) => [newSubject, ...prevSubjects]);
    toast({
      title: "Subject Added",
      description: `${newSubject.name} has been successfully added.`,
    });
  };

  const handleOpenEditDialog = (subjectItem: SubjectItem) => {
    setEditingSubject(subjectItem);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubject = (updatedSubjectData: SubjectFormData) => {
    if (!editingSubject) return;

    const updatedSubject: SubjectItem = {
      ...editingSubject,
      ...updatedSubjectData,
    };

    setSubjects((prevSubjects) =>
      prevSubjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
    );
    toast({
      title: "Subject Updated",
      description: `${updatedSubject.name}'s details have been updated.`,
    });
    setIsEditDialogOpen(false);
    setEditingSubject(null);
  };

  const handleOpenDeleteDialog = (subjectId: string) => {
    setDeletingSubjectId(subjectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSubject = () => {
    if (!deletingSubjectId) return;
    const subjectToDelete = subjects.find(s => s.id === deletingSubjectId);
    setSubjects((prevSubjects) => prevSubjects.filter(s => s.id !== deletingSubjectId));
    toast({
      title: "Subject Deleted",
      description: `${subjectToDelete?.name || 'Subject'} has been removed.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
    setDeletingSubjectId(null);
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
          {subjects.length === 0 ? (
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
              This action cannot be undone. This will permanently delete the subject record.
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
