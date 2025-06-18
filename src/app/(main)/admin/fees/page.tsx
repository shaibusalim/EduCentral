import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, DollarSign } from 'lucide-react';
import Image from 'next/image';

export default function FeeManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="Fee Management"
        subtitle="Generate invoices, record payments, and manage fee structures."
      >
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Invoice
        </Button>
      </PageTitle>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Fee Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Fee management placeholder" 
            width={800} 
            height={400} 
            className="w-full h-auto rounded-lg mb-4 object-cover"
            data-ai-hint="finance money"
          />
          <p className="text-muted-foreground">
            Fee management features, including invoice generation, payment recording, reminders, and payment history, will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
