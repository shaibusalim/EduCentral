"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { navigationItems, type NavItem } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building, LogOut, BadgeAlert } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from '../ui/button';

export function AppSidebar() {
  const { role, isLoadingRole, logout } = useAppContext();
  const pathname = usePathname();

  if (isLoadingRole) {
    // Optional: Show a loading state for the sidebar
    return (
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base text-sidebar-foreground">
            <Building className="h-6 w-6" />
            <span className="font-headline text-xl">EduCentral</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <div className="animate-pulse space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 rounded bg-sidebar-accent/50"></div>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }
  
  const filteredNavItems = navigationItems.filter(item => item.allowedRoles.includes(role));

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    
    const buttonContent = (
      <>
        <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/80")} />
        <span className="truncate">{item.label}</span>
        {item.isBeta && <BadgeAlert className="ml-auto h-4 w-4 text-yellow-400" />}
      </>
    );

    if (isSubItem) {
      return (
        <SidebarMenuSubItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuSubButton isActive={isActive} className="text-sm">
              {buttonContent}
            </SidebarMenuSubButton>
          </Link>
        </SidebarMenuSubItem>
      );
    }

    return (
      <SidebarMenuItem key={item.href}>
        <Link href={item.href} legacyBehavior passHref>
          <SidebarMenuButton isActive={isActive} tooltip={item.label} className="justify-start">
            {buttonContent}
          </SidebarMenuButton>
        </Link>
        {item.children && item.children.length > 0 && (
          <SidebarMenuSub>
            {item.children
              .filter(subItem => subItem.allowedRoles.includes(role))
              .map(subItem => renderNavItem(subItem, true))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };


  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base text-sidebar-foreground">
          <Building className="h-6 w-6" />
          <span className="font-headline text-xl">EduCentral</span>
        </Link>
      </SidebarHeader>
      <ScrollArea className="h-[calc(100vh-12rem)]"> {/* Adjust height as needed */}
        <SidebarContent className="flex-grow p-2">
          <SidebarMenu>
            {filteredNavItems.map(item => renderNavItem(item))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <Button variant="ghost" onClick={logout} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
