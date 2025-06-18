import { PredictStudentRiskClient } from '@/components/ai/PredictStudentRiskClient';
import { PageTitle } from '@/components/ui/PageTitle';
import { Lightbulb } from 'lucide-react';

export default function PredictRiskPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="AI Student Risk Predictor"
        subtitle="Identify students who may need additional support using predictive analytics."
      >
        <Lightbulb className="h-6 w-6 text-accent" />
      </PageTitle>
      <PredictStudentRiskClient />
    </div>
  );
}
