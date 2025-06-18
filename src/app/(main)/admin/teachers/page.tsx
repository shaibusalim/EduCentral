
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, GraduationCap, Edit3, Trash2 } from 'lucide-react';
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
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Mock initial teacher data
const initialTeachers: Teacher[] = [
  { id: 't1', firstName: 'Emily', lastName: 'Clark', email: 'emily.c@example.com', subject: 'Mathematics', dateOfJoining: '2018-08-15' },
  { id: 't2', firstName: 'David', lastName: 'Wilson', email: 'david.w@example.com', subject: 'Physics', dateOfJoining: '2020-01-20' },
  { id: 't3', firstName: 'Sarah', lastName: 'Garcia', email: 'sarah.g@example.com', subject: 'English', dateOfJoining: '2019-07-10' },
];

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = React.useState<Teacher[]>(initialTeachers);
  const { toast } = useToast();

  const handleAddTeacher = (newTeacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      id: `t${Date.now().toString()}`, // Simple ID generation
      ...newTeacherData,
    };
    setTeachers((prevTeachers) => [newTeacher, ...prevTeachers]);
    toast({
      title: "Teacher Added",
      description: `${newTeacher.firstName} ${newTeacher.lastName} has been successfully added.`,
    });
  };

  const handleEditTeacher = (teacherId: string) => {
    // Placeholder for edit functionality
    console.log("Edit teacher:", teacherId);
    toast({
      title: "Edit Action (Placeholder)",
      description: `Edit functionality for teacher ID ${teacherId} will be implemented here.`,
    });
  };

  const handleDeleteTeacher = (teacherId: string) => {
    // Placeholder for delete functionality
    setTeachers((prevTeachers) => prevTeachers.filter(teacher => teacher.id !== teacherId));
    toast({
      title: "Teacher Deleted (Mock)",
      description: `Teacher ID ${teacherId} has been removed from the list.`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Teacher Management"
        subtitle="Manage teacher profiles, subject assignments, and class allocations."
      >
        <AddTeacherDialog onTeacherAdded={handleAddTeacher}>
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
          {teachers.length === 0 ? (
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
                      {format(parseISO(teacher.dateOfJoining), 'PPP')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditTeacher(teacher.id)} aria-label="Edit teacher">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteTeacher(teacher.id)} aria-label="Delete teacher">
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
