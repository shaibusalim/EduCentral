"use client";

import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/PageTitle';
import { Users, BookOpen, BarChart3, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardMetricProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  link?: string;
  colorClass?: string;
}

const DashboardMetric: React.FC<DashboardMetricProps> = ({ title, value, icon: Icon, description, link, colorClass = "text-primary" }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {link && <Link href={link} className="text-xs text-accent hover:underline mt-1 block">View Details</Link>}
    </CardContent>
  </Card>
);


export default function DashboardPage() {
  const { role } = useAppContext();

  // Mock data, replace with actual data fetching
  const adminMetrics: DashboardMetricProps[] = [
    { title: "Total Students", value: 1250, icon: Users, description: "+20 this month", link: "/admin/students" },
    { title: "Total Teachers", value: 75, icon: Users, description: "+2 this month", link: "/admin/teachers", colorClass: "text-green-600" },
    { title: "Active Courses", value: 45, icon: BookOpen, description: "Computer Science, Arts, ...", link: "/admin/subjects", colorClass: "text-blue-600" },
    { title: "Fees Collected (This Month)", value: "$55,230", icon: DollarSign, description: "Target: $60,000", link: "/admin/fees", colorClass: "text-yellow-600" },
  ];

  const teacherMetrics: DashboardMetricProps[] = [
    { title: "My Classes", value: 3, icon: Users, description: "Grade 10A, 11B, 12C", link: "/teacher/classes" },
    { title: "Upcoming Assignments", value: 5, icon: BookOpen, description: "Due this week", link: "#" , colorClass: "text-blue-600"},
    { title: "Average Attendance", value: "92%", icon: BarChart3, description: "Last 7 days", link: "/teacher/attendance" , colorClass: "text-green-600"},
  ];
  
  const studentMetrics: DashboardMetricProps[] = [
    { title: "My Courses", value: 6, icon: BookOpen, description: "Math, Science, ...", link: "#", colorClass: "text-blue-600" },
    { title: "Overall Grade", value: "B+", icon: BarChart3, description: "Keep it up!", link: "/student/grades", colorClass: "text-green-600" },
    { title: "Upcoming Exams", value: 2, icon: Users, description: "Next week", link: "/academic-calendar" },
  ];

  const parentMetrics: DashboardMetricProps[] = [
    { title: "Child's Overall Grade", value: "A-", icon: BarChart3, description: "Excellent progress!", link: "/parent/performance", colorClass: "text-green-600" },
    { title: "Attendance This Month", value: "98%", icon: UserCheck, description: "Very good", link: "/parent/attendance" },
    { title: "Fees Due", value: "$150", icon: DollarSign, description: "Due next week", link: "/parent/fees", colorClass: "text-yellow-600" },
  ];

  let metrics: DashboardMetricProps[] = [];
  let welcomeMessage = "Welcome to your Dashboard!";

  switch (role) {
    case 'admin':
      metrics = adminMetrics;
      welcomeMessage = "Admin Dashboard";
      break;
    case 'teacher':
      metrics = teacherMetrics;
      welcomeMessage = "Teacher Dashboard";
      break;
    case 'student':
      metrics = studentMetrics;
      welcomeMessage = "Student Dashboard";
      break;
    case 'parent':
      metrics = parentMetrics;
      welcomeMessage = "Parent Dashboard";
      break;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle title={welcomeMessage} subtitle={`Overview of your ${role} activities.`} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <DashboardMetric key={index} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Stay updated with the latest school news.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {['School Reopens on Monday', 'Annual Sports Day Next Friday', 'PTA Meeting Scheduled'].map((item, idx) => (
                <li key={idx} className="text-sm p-3 bg-secondary/50 rounded-md hover:bg-secondary transition-colors">
                  {item} - <span className="text-xs text-muted-foreground">{(idx + 1) * 2} days ago</span>
                </li>
              ))}
            </ul>
            <Link href="/notifications" className="text-sm text-accent hover:underline mt-4 block">View all announcements</Link>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Mark your calendar for these important dates.</CardDescription>
          </CardHeader>
          <CardContent>
             <Image 
                src="https://placehold.co/600x300.png" 
                alt="School event placeholder" 
                width={600} 
                height={300} 
                className="w-full h-auto rounded-lg mb-4 object-cover"
                data-ai-hint="school event"
              />
            <ul className="space-y-3">
              {['Science Fair - Oct 15', 'Parent-Teacher Conference - Oct 22', 'Mid-term Exams - Nov 5-9'].map((item, idx) => (
                 <li key={idx} className="text-sm p-3 bg-secondary/50 rounded-md hover:bg-secondary transition-colors">
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/academic-calendar" className="text-sm text-accent hover:underline mt-4 block">View full calendar</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
