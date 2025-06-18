"use client";

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DateRange } from "react-day-picker";
import { addDays, format, isSameDay, isWithinInterval, startOfMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface CalendarEvent {
  date: Date;
  title: string;
  type: 'event' | 'holiday' | 'exam' | 'meeting';
}

const mockEvents: CalendarEvent[] = [
  { date: new Date(), title: "Today's Staff Meeting", type: 'meeting' },
  { date: addDays(new Date(), 2), title: "Science Fair Submissions Due", type: 'event' },
  { date: addDays(new Date(), 5), title: "Mid-term Math Exam", type: 'exam' },
  { date: addDays(new Date(), 10), title: "School Holiday", type: 'holiday' },
  { date: addDays(startOfMonth(new Date()), 14), title: "Parent-Teacher Association Meeting", type: 'meeting' },
  { date: addDays(startOfMonth(new Date()), 20), title: "Annual Sports Day", type: 'event' },
];


export function AcademicCalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));

  const eventsForSelectedDate = date ? mockEvents.filter(event => isSameDay(event.date, date)) : [];
  const eventsForSelectedMonth = mockEvents.filter(event => 
    isWithinInterval(event.date, { start: startOfMonth(selectedMonth), end: addDays(startOfMonth(selectedMonth), 30) })
  );
  
  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'event': return 'bg-blue-500';
      case 'holiday': return 'bg-green-500';
      case 'exam': return 'bg-red-500';
      case 'meeting': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary">School Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            className="rounded-md border p-0"
            modifiers={{
              event: mockEvents.filter(e => e.type === 'event').map(e => e.date),
              holiday: mockEvents.filter(e => e.type === 'holiday').map(e => e.date),
              exam: mockEvents.filter(e => e.type === 'exam').map(e => e.date),
              meeting: mockEvents.filter(e => e.type === 'meeting').map(e => e.date),
            }}
            modifiersClassNames={{
              event: 'bg-blue-100 text-blue-700 rounded-full',
              holiday: 'bg-green-100 text-green-700 rounded-full',
              exam: 'bg-red-100 text-red-700 rounded-full',
              meeting: 'bg-purple-100 text-purple-700 rounded-full',
            }}
            components={{
              DayContent: ({ date, displayMonth }) => {
                const dayEvents = mockEvents.filter(event => isSameDay(event.date, date) && event.date.getMonth() === displayMonth.getMonth());
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span>{format(date, "d")}</span>
                    {dayEvents.length > 0 && (
                       <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                        {dayEvents.slice(0,2).map(event => (
                          <span key={event.title} className={`block h-1 w-1 rounded-full ${getEventTypeColor(event.type)}`}></span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary">
            {date ? `Events for ${format(date, 'PPP')}` : `Events for ${format(selectedMonth, 'MMMM yyyy')}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(date ? eventsForSelectedDate : eventsForSelectedMonth).length > 0 ? (
            <ul className="space-y-3">
              {(date ? eventsForSelectedDate : eventsForSelectedMonth).map((event, index) => (
                <li key={index} className="p-3 rounded-md border border-border bg-card hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{event.title}</p>
                    <Badge variant="outline" className={`${getEventTypeColor(event.type)} text-white text-xs`}>{event.type}</Badge>
                  </div>
                  {!date && <p className="text-xs text-muted-foreground">{format(event.date, 'PPP')}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              {date ? "No events scheduled for this day." : "No events scheduled for this month."}
            </p>
          )}
           <div className="mt-6 space-y-1 text-xs text-muted-foreground">
            <p><span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span>Event</p>
            <p><span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>Holiday</p>
            <p><span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>Exam</p>
            <p><span className="inline-block h-2 w-2 rounded-full bg-purple-500 mr-2"></span>Meeting</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
