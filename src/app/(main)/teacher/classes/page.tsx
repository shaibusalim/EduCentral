
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, BookOpen, MapPin, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getClasses } from '@/services/classService';
import { getTeachers } from '@/services/teacherService';
import type { ClassItem, Teacher } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DisplayedTeacherClass {
  id: string;
  name: string;
  subject: string;
  roomNumber?: string;
  // period and studentCount are omitted as they are not easily available from current Firestore structure
}

// SIMULATION: In a real app, this would come from auth context
const CURRENT_TEACHER_NAME = "Ms. Emily Clark"; 

export default function TeacherClassesPage() {
  const [teacherClasses, setTeacherClasses] = React.useState<DisplayedTeacherClass[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchTeacherClasses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allClasses = await getClasses();
        const allTeachers = await getTeachers();

        const currentTeacher = allTeachers.find(
          (t) => `${t.firstName} ${t.lastName}` === CURRENT_TEACHER_NAME
        );

        if (!currentTeacher) {
          // If current "mock" teacher is not found, show no classes.
          // In a real app, this scenario might mean the teacher has no classes or there's a data issue.
          setTeacherClasses([]);
          // Optionally, set an error or info message if the teacher identity is critical
          // setError(`Teacher profile for ${CURRENT_TEACHER_NAME} not found.`);
          return;
        }
        
        const filteredClasses = allClasses.filter(
          (classItem) => classItem.assignedTeacherName === CURRENT_TEACHER_NAME
        );

        const displayedClasses: DisplayedTeacherClass[] = filteredClasses.map((classItem) => ({
          id: classItem.id,
          name: classItem.name,
          subject: currentTeacher.subject, // Use the teacher's primary subject
          roomNumber: classItem.roomNumber,
        }));

        setTeacherClasses(displayedClasses);
      } catch (err) {
        console.error("Failed to fetch teacher classes:", err);
        setError("Could not load class information. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error loading classes",
          description: (err as Error).message || "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherClasses();
  }, [toast]);

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Classes"
        subtitle={`Classes assigned to ${CURRENT_TEACHER_NAME}.`}
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading your classes...</p>
        </div>
      ) : error ? (
         <Card className="shadow-lg">
          <CardContent className="p-6 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : teacherClasses.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center text-muted-foreground">
            You are not currently assigned to any classes, or your classes could not be loaded.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teacherClasses.map((classInfo) => (
            <Card key={classInfo.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl text-primary">
                    <School className="h-6 w-6" />
                    {classInfo.name}
                  </CardTitle>
                  {/* Period Badge removed as data is not available */}
                </div>
                <CardDescription className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-muted-foreground" /> Subject: {classInfo.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                {classInfo.roomNumber && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 text-accent" />
                    <span>Room: {classInfo.roomNumber}</span>
                  </div>
                )}
                {/* Student count removed as data is not available */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
