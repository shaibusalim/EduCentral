import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, GraduationCap, School, Book, Brain, CalendarDays, Bell, UserCheck, Settings, FileText, DollarSign } from 'lucide-react';
import type { UserRole } from '@/contexts/AppContext';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
  isBeta?: boolean;
  children?: NavItem[]; // For nested menus
}

export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'teacher', 'student', 'parent'],
  },
  {
    label: 'Academic Calendar',
    href: '/academic-calendar',
    icon: CalendarDays,
    allowedRoles: ['admin', 'teacher', 'student', 'parent'],
  },
  {
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
    allowedRoles: ['admin', 'teacher', 'student', 'parent'],
  },
  // Admin specific
  {
    label: 'Student Management',
    href: '/admin/students',
    icon: Users,
    allowedRoles: ['admin'],
  },
  {
    label: 'Teacher Management',
    href: '/admin/teachers',
    icon: GraduationCap,
    allowedRoles: ['admin'],
  },
  {
    label: 'Class Management',
    href: '/admin/classes',
    icon: School,
    allowedRoles: ['admin'],
  },
  {
    label: 'Subject Management',
    href: '/admin/subjects',
    icon: Book,
    allowedRoles: ['admin'],
  },
  {
    label: 'Fee Management',
    href: '/admin/fees',
    icon: DollarSign,
    allowedRoles: ['admin'],
  },
  {
    label: 'Predict At-Risk Students',
    href: '/admin/predict-risk',
    icon: Brain,
    allowedRoles: ['admin'],
    isBeta: true,
  },
  // Teacher specific
  {
    label: 'My Classes',
    href: '/teacher/classes',
    icon: School,
    allowedRoles: ['teacher'],
  },
  {
    label: 'Mark Attendance',
    href: '/teacher/attendance',
    icon: UserCheck,
    allowedRoles: ['teacher'],
  },
  {
    label: 'Enter Grades',
    href: '/teacher/grades',
    icon: FileText,
    allowedRoles: ['teacher'],
  },
  // Student specific
  {
    label: 'My Grades',
    href: '/student/grades',
    icon: FileText,
    allowedRoles: ['student'],
  },
  {
    label: 'My Attendance',
    href: '/student/attendance',
    icon: UserCheck,
    allowedRoles: ['student'],
  },
  // Parent specific
  {
    label: "Child's Performance",
    href: '/parent/performance',
    icon: FileText,
    allowedRoles: ['parent'],
  },
  {
    label: "Child's Attendance",
    href: '/parent/attendance',
    icon: UserCheck,
    allowedRoles: ['parent'],
  },
   {
    label: "Fee Status",
    href: '/parent/fees',
    icon: DollarSign,
    allowedRoles: ['parent'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    allowedRoles: ['admin', 'teacher', 'student', 'parent'],
  },
];
