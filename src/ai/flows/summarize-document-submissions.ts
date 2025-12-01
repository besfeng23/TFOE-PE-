'use server';

/**
 * @fileOverview An AI agent for summarizing lengthy document submissions.
 *
 * - summarizeDocument - A function that summarizes a document submission.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to be summarized.'),
  summaryLength: z
    .string()
    .optional()
    .describe('Desired length of the summary (e.g., short, medium, long).'),
  focusAreas: z
    .string()
    .optional()
    .describe('Specific areas or topics to focus on in the summary.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('The summarized text of the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `You are an expert summarizer. Create a concise summary of the following document.
  
  {{#if focusAreas}}Focus on these key areas: {{{focusAreas}}}.{{/if}}
  {{#if summaryLength}}The desired length is {{{summaryLength}}}.{{/if}}

  Document:
  """
  {{{documentText}}}
  """`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
