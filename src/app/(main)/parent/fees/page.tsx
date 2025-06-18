
"use client";

import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, FileCheck2, Receipt, CalendarClock, Landmark } from 'lucide-react';
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

// Mock Data
const mockOutstandingBalance = 150.75;
const mockNextDueDate = "2024-10-30";
const mockRecentPayments = [
  { id: "txn1", date: "2024-09-01", amount: 500.00, method: "Credit Card", status: "Paid" },
  { id: "txn2", date: "2024-05-01", amount: 500.00, method: "Bank Transfer", status: "Paid" },
  { id: "txn3", date: "2024-01-15", amount: 475.00, method: "Mobile Money", status: "Paid" },
];

export default function ParentFeesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Fee Status & Payments"
        subtitle="View payment history, outstanding balances, and make payments."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Landmark className="mr-2 h-4 w-4" /> Pay Fees Online
        </Button>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <DollarSign className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockOutstandingBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">As of today</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
            <CalendarClock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(mockNextDueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
            <p className="text-xs text-muted-foreground">{new Date(mockNextDueDate).getFullYear()}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Payment Made</CardTitle>
            <FileCheck2 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockRecentPayments[0]?.amount.toFixed(2) || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              On {mockRecentPayments[0] ? new Date(mockRecentPayments[0].date).toLocaleDateString() : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Recent Payment History
          </CardTitle>
          <CardDescription>Showing the last few transactions. For a full statement, please download your account summary.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockRecentPayments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No payment history found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={payment.status === 'Paid' ? 'default' : 'destructive'} className={payment.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm">Download Full Statement</Button>
        </CardFooter>
      </Card>

      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>How to Pay Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Details on accepted payment methods (e.g., MTN MoMo, Bank Deposit, Online Portal) will be listed here.</p>
          <p>For any queries, please contact the accounts office at <a href="mailto:accounts@educentral.app" className="text-accent hover:underline">accounts@educentral.app</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
