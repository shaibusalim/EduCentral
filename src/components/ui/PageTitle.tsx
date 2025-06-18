import type React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // For action buttons or breadcrumbs
}

export function PageTitle({ title, subtitle, children }: PageTitleProps) {
  return (
    <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
