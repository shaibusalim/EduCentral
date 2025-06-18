
"use client";

import type React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { Skeleton } from '@/components/ui/skeleton';


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, role, isLoadingUser } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingUser) {
      if (!authUser) {
        router.push('/'); // Redirect to login/role selection if not authenticated
      } else if (!role) {
        router.push('/'); // Redirect if authenticated but no role selected
      }
    }
  }, [authUser, role, isLoadingUser, router]);

  if (isLoadingUser || !authUser || !role) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <AppHeader />
        <SidebarInset>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
      <SidebarRail />
    </SidebarProvider>
  );
}
