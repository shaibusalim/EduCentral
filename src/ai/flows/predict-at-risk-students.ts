//Predicts students at risk of failure based on academic record, grades, and teacher feedback.
'use server';

/**
 * @fileOverview Predicts students at risk of failure based on academic record, grades, and teacher feedback.
 *
 * - predictAtRiskStudents - A function that predicts students at risk of failure.
 * - PredictAtRiskStudentsInput - The input type for the predictAtRiskStudents function.
 * - PredictAtRiskStudentsOutput - The return type for the predictAtRiskStudents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictAtRiskStudentsInputSchema = z.object({
  academicRecord: z
    .string()
    .describe('The academic record of the student, including courses taken and attendance.'),
  grades: z
    .string()
    .describe('The grades of the student in each course.'),
  teacherFeedback: z
    .string()
    .describe('The feedback from teachers about the student.'),
});
export type PredictAtRiskStudentsInput = z.infer<typeof PredictAtRiskStudentsInputSchema>;

const PredictAtRiskStudentsOutputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  isAtRisk: z
    .boolean()
    .describe('Whether or not the student is at risk of failure.'),
  reason: z
    .string()
    .describe('The reason why the student is at risk of failure.'),
  suggestedInterventions: z
    .string()
    .describe('Suggested interventions to help the student succeed.'),
});
export type PredictAtRiskStudentsOutput = z.infer<typeof PredictAtRiskStudentsOutputSchema>;

export async function predictAtRiskStudents(input: PredictAtRiskStudentsInput): Promise<PredictAtRiskStudentsOutput> {
  return predictAtRiskStudentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictAtRiskStudentsPrompt',
  input: {schema: PredictAtRiskStudentsInputSchema},
  output: {schema: PredictAtRiskStudentsOutputSchema},
  prompt: `You are an AI expert at predicting students at risk of failure.

You will use the student's academic record, grades, and teacher feedback to determine if the student is at risk of failure.

Academic Record: {{{academicRecord}}}
Grades: {{{grades}}}
Teacher Feedback: {{{teacherFeedback}}}

Is the student at risk of failure? Explain why or why not. What interventions can be suggested to help the student succeed?
`,
});

const predictAtRiskStudentsFlow = ai.defineFlow(
  {
    name: 'predictAtRiskStudentsFlow',
    inputSchema: PredictAtRiskStudentsInputSchema,
    outputSchema: PredictAtRiskStudentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
