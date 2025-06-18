
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, BookOpen, MapPin, Loader2, UserCircle } from 'lucide-react';
import { getClasses } from '@/services/classService';
import { getTeachers } from '@/services/teacherService';
import type { ClassItem, Teacher } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface DisplayedTeacherClass {
  id: string; // class id
  name: string; // class name
  subject: string; // teacher's primary subject
  roomNumber?: string;
}

export default function TeacherClassesPage() {
  const [teacherClasses, setTeacherClasses] = React.useState<DisplayedTeacherClass[]>([]);
  const [currentTeacher, setCurrentTeacher] = React.useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const { authUser } = useAppContext();

  React.useEffect(() => {
    const fetchTeacherAndClassData = async () => {
      if (!authUser || !authUser.uid) {
        setError("User not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      const currentTeacherId = authUser.uid;

      try {
        const [allClassesData, allTeachersData] = await Promise.all([
          getClasses(),
          getTeachers()
        ]);

        const foundTeacher = allTeachersData.find(t => t.id === currentTeacherId);
        if (!foundTeacher) {
          setError("Teacher profile not found for the logged-in user.");
          setTeacherClasses([]);
          setCurrentTeacher(null);
          setIsLoading(false);
          return;
        }
        setCurrentTeacher(foundTeacher);

        const filteredClasses = allClassesData.filter(
          (classItem) => classItem.assignedTeacherId === currentTeacherId
        );

        const displayedClasses: DisplayedTeacherClass[] = filteredClasses.map((classItem) => ({
          id: classItem.id,
          name: classItem.name,
          subject: foundTeacher.subject, 
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

    fetchTeacherAndClassData();
  }, [authUser, toast]);

  const pageSubtitle = currentTeacher 
    ? `Classes assigned to ${currentTeacher.firstName} ${currentTeacher.lastName}.`
    : "Your assigned classes.";

  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Classes"
        subtitle={pageSubtitle}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
