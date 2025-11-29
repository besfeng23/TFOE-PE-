'use server';

/**
 * @fileOverview This file implements the Intelligent Form Completion flow.
 *
 * It suggests relevant data to pre-fill form fields based on user roles, past submissions, and organization data.
 * - intelligentFormCompletion - The main function to trigger the form completion flow.
 * - IntelligentFormCompletionInput - The input type for the intelligentFormCompletion function.
 * - IntelligentFormCompletionOutput - The output type for the intelligentFormCompletion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentFormCompletionInputSchema = z.object({
  userRole: z
    .string()
    .describe('The role of the user filling the form (e.g., Member, Secretary, Admin).'),
  formType: z.string().describe('The type of form being filled (e.g., National ID application, Membership application).'),
  previousFormData: z.record(z.any()).optional().describe('Data from the user\'s previous form submissions, if available.'),
  organizationData: z.record(z.any()).optional().describe('Relevant organizational data that can be used to pre-fill fields.'),
  currentFormFields: z.record(z.string()).describe('The fields currently present in the form and their labels.'),
});
export type IntelligentFormCompletionInput = z.infer<typeof IntelligentFormCompletionInputSchema>;

const IntelligentFormCompletionOutputSchema = z.record(z.string()).describe('A map of form fields to suggested values.');
export type IntelligentFormCompletionOutput = z.infer<typeof IntelligentFormCompletionOutputSchema>;

export async function intelligentFormCompletion(input: IntelligentFormCompletionInput): Promise<IntelligentFormCompletionOutput> {
  return intelligentFormCompletionFlow(input);
}

const intelligentFormCompletionPrompt = ai.definePrompt({
  name: 'intelligentFormCompletionPrompt',
  input: {schema: IntelligentFormCompletionInputSchema},
  output: {schema: IntelligentFormCompletionOutputSchema},
  prompt: `You are an AI assistant designed to help users fill out forms quickly and accurately.

  Based on the user's role, the type of form they are filling, their previous submissions, and organization data, suggest values for the fields in the current form.

  User Role: {{{userRole}}}
  Form Type: {{{formType}}}
  Previous Form Data: {{#if previousFormData}}{{{JSON.stringify previousFormData}}}{{else}}N/A{{/if}}
  Organization Data: {{#if organizationData}}{{{JSON.stringify organizationData}}}{{else}}N/A{{/if}}
  Current Form Fields: {{{JSON.stringify currentFormFields}}}

  Suggest values for the following fields:
  {
    {{#each currentFormFields}}
      "{{@key}}": "", // Suggest a value for this field based on available data.
    {{/each}}
  }

  Return the suggested values as a JSON object where keys are field names and values are suggested values. If you do not have a suggestion, return an empty string for that field.
  `,
});

const intelligentFormCompletionFlow = ai.defineFlow(
  {
    name: 'intelligentFormCompletionFlow',
    inputSchema: IntelligentFormCompletionInputSchema,
    outputSchema: IntelligentFormCompletionOutputSchema,
  },
  async input => {
    const {output} = await intelligentFormCompletionPrompt(input);
    return output!;
  }
);
