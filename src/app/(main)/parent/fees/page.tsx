import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ParentFeesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Fee Status"
        subtitle="View payment history, outstanding balances, and make payments."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <DollarSign className="mr-2 h-4 w-4" /> Pay Fees Online
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Fee status placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="invoice payment"
          />
          <p className="text-muted-foreground">
            Your child's fee payment history, outstanding balances, and options for online payment (e.g., MTN MoMo, card) will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
