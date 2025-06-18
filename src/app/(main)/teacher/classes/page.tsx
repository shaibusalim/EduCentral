
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Users, BookOpen, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeacherClassInfo {
  id: string;
  name: string; 
  subject: string; 
  studentCount: number;
  roomNumber?: string;
  period?: string; // e.g., "Mon 9:00-10:00 AM"
}

const mockTeacherClasses: TeacherClassInfo[] = [
  { id: 'tc1', name: 'Grade 10A', subject: 'Mathematics', studentCount: 28, roomNumber: '101', period: 'Mon 9:00-10:00 AM' },
  { id: 'tc2', name: 'Grade 11B', subject: 'Physics', studentCount: 25, roomNumber: '203', period: 'Tue 10:00-11:00 AM' },
  { id: 'tc3', name: 'Grade 9C', subject: 'Mathematics', studentCount: 30, roomNumber: '105', period: 'Wed 11:00-12:00 PM' },
  { id: 'tc4', name: 'Grade 10A', subject: 'Advanced Algebra (Elective)', studentCount: 15, period: 'Fri 1:00-2:00 PM' },
];

export default function TeacherClassesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="My Classes"
        subtitle="View your assigned classes, subjects, and schedules."
      />
      {mockTeacherClasses.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center text-muted-foreground">
            You are not currently assigned to any classes.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTeacherClasses.map((classInfo) => (
            <Card key={classInfo.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl text-primary">
                    <School className="h-6 w-6" />
                    {classInfo.name}
                  </CardTitle>
                  {classInfo.period && (
                    <Badge variant="outline" className="text-xs">{classInfo.period}</Badge>
                  )}
                </div>
                <CardDescription>Subject: {classInfo.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4 text-accent" />
                  <span>{classInfo.studentCount} Students</span>
                </div>
                {classInfo.roomNumber && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 text-accent" />
                    <span>Room: {classInfo.roomNumber}</span>
                  </div>
                )}
              </CardContent>
              {/* Future actions could go in CardFooter if needed */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
