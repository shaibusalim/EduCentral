
"use client";

import * as React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, FileText, Receipt, CalendarClock, Landmark, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { FeeRecord } from '@/types';
import { getFeesForStudent } from '@/services/feeService';
import { format, parseISO, isValid } from 'date-fns';

// SIMULATION: In a real app, this would come from auth context or parent's profile
const CURRENT_CHILD_STUDENT_ID = "student123"; // Ensure this student ID has fee data in Firestore

export default function ParentFeesPage() {
  const [feeRecords, setFeeRecords] = React.useState<FeeRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchFeeData = async () => {
      if (!CURRENT_CHILD_STUDENT_ID) {
        toast({ variant: "destructive", title: "Child ID missing" });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedFees = await getFeesForStudent(CURRENT_CHILD_STUDENT_ID);
        setFeeRecords(fetchedFees);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load fee data",
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeeData();
  }, [toast]);

  const outstandingBalance = feeRecords
    .filter(fee => fee.status !== 'paid')
    .reduce((sum, fee) => sum + (fee.amountDue - fee.amountPaid), 0);

  const nextDueDate: Date | null = feeRecords
    .filter(fee => fee.status !== 'paid' && isValid(parseISO(fee.dueDate)))
    .map(fee => parseISO(fee.dueDate))
    .reduce((earliest, current) => (earliest && earliest < current ? earliest : current), null as Date | null);
    
  const totalAmountDue = feeRecords.reduce((sum, fee) => sum + fee.amountDue, 0);
  const totalAmountPaid = feeRecords.reduce((sum, fee) => sum + fee.amountPaid, 0);

  const getStatusBadgeVariant = (status: FeeRecord['status']) => {
    switch (status) {
      case 'paid': return 'default'; 
      case 'pending': return 'secondary';
      case 'partially_paid': return 'outline'; 
      case 'overdue': return 'destructive';
      default: return 'secondary';
    }
  };
   const getStatusBadgeColorClass = (status: FeeRecord['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-500 hover:bg-green-600';
      case 'pending': return ''; 
      case 'partially_paid': return 'border-yellow-500 text-yellow-700'; 
      case 'overdue': return ''; 
      default: return '';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Fee Status & Payments"
        subtitle="View payment history, outstanding balances, and make payments."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled>
            <Landmark className="mr-2 h-4 w-4" /> Pay Fees Online (Soon)
        </Button>
      </PageTitle>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading fee information...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                <DollarSign className={`h-5 w-5 ${outstandingBalance > 0 ? 'text-destructive' : 'text-green-500'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${outstandingBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total amount currently due</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
                <CalendarClock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {nextDueDate ? format(nextDueDate, 'PPP') : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">For pending invoices</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Fee Summary</CardTitle>
                <FileText className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Due: ${totalAmountDue.toFixed(2)}</div>
                <div className="text-lg font-bold text-green-600">Paid: ${totalAmountPaid.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Across all recorded invoices</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Fee Invoice History
              </CardTitle>
              <CardDescription>List of all fee invoices and their current status.</CardDescription>
            </CardHeader>
            <CardContent>
              {feeRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No fee records found for this student.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issued</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount Due</TableHead>
                      <TableHead className="text-right">Amount Paid</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeRecords.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell>{isValid(parseISO(fee.issuedDate)) ? format(parseISO(fee.issuedDate), 'PPP') : fee.issuedDate}</TableCell>
                        <TableCell className="font-medium">{fee.description}</TableCell>
                        <TableCell>{isValid(parseISO(fee.dueDate)) ? format(parseISO(fee.dueDate), 'PPP') : fee.dueDate}</TableCell>
                        <TableCell className="text-right">${fee.amountDue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${fee.amountPaid.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                           <Badge 
                            variant={getStatusBadgeVariant(fee.status)} 
                            className={`${getStatusBadgeColorClass(fee.status)} capitalize`}
                          >
                            {fee.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" disabled>Download Full Statement (Soon)</Button>
            </CardFooter>
          </Card>

          <Separator />
          
          <Card>
            <CardHeader>
              <CardTitle>How to Pay Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Details on accepted payment methods (e.g., Online Portal, Bank Deposit) will be listed here.</p>
              <p>For any queries, please contact the accounts office at <a href="mailto:accounts@educentral.app" className="text-accent hover:underline">accounts@educentral.app</a>.</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

