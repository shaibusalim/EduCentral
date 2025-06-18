import { AcademicCalendarView } from '@/components/calendar/AcademicCalendarView';
import { PageTitle } from '@/components/ui/PageTitle';

export default function AcademicCalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Academic Calendar" 
        subtitle="View school events, holidays, exams, and meetings."
      />
      <AcademicCalendarView />
    </div>
  );
}
