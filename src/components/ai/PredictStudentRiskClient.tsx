"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { predictAtRiskStudents, type PredictAtRiskStudentsInput, type PredictAtRiskStudentsOutput } from '@/ai/flows/predict-at-risk-students';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  academicRecord: z.string().min(10, "Academic record must be at least 10 characters"),
  grades: z.string().min(5, "Grades information must be at least 5 characters"),
  teacherFeedback: z.string().min(10, "Teacher feedback must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function PredictStudentRiskClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictAtRiskStudentsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      academicRecord: '',
      grades: '',
      teacherFeedback: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const aiInput: PredictAtRiskStudentsInput = {
        academicRecord: data.academicRecord,
        grades: data.grades,
        teacherFeedback: data.teacherFeedback,
      };
      const result = await predictAtRiskStudents(aiInput);
      // The studentId from the form is not part of the AI input schema,
      // but we want to display it with the result. So, we'll merge it here.
      setPredictionResult({ ...result, studentId: data.studentId }); 
      toast({
        title: "Prediction Successful",
        description: `Analysis complete for student ID: ${data.studentId}.`,
      });
    } catch (error) {
      console.error("Error predicting student risk:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "An error occurred while processing the student data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Predict Student At-Risk Status</CardTitle>
        <CardDescription>Enter student details to get an AI-powered risk assessment and suggested interventions.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., S1001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="academicRecord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Record</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Courses taken, attendance (e.g., Math: 85% attendance, English: 90% attendance, History: 70% attendance. Completed Algebra 1, Geometry.)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grades"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grades</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Current grades (e.g., Math: C, English: B, History: D)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherFeedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher Feedback</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Summary of teacher observations (e.g., Struggles with homework, participates well in class but test scores are low. Shows potential but needs motivation.)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Predict Risk
            </Button>
          </CardFooter>
        </form>
      </Form>

      {predictionResult && (
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-4 text-primary">Prediction Result for Student {predictionResult.studentId}</h3>
          <Alert variant={predictionResult.isAtRisk ? "destructive" : "default"} className="mb-4">
            {predictionResult.isAtRisk ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertTitle>{predictionResult.isAtRisk ? "Student At Risk" : "Student Not Currently At Risk"}</AlertTitle>
            <AlertDescription>
              {predictionResult.isAtRisk ? "This student has been identified as potentially at risk of academic challenges." : "This student does not currently show significant risk factors based on the provided data."}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-muted-foreground">Reason:</h4>
              <p className="text-sm">{predictionResult.reason}</p>
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground">Suggested Interventions:</h4>
              <p className="text-sm">{predictionResult.suggestedInterventions}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
