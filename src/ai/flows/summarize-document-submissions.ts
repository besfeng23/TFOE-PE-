'use server';

/**
 * @fileOverview An AI agent for summarizing lengthy document submissions.
 *
 * - summarizeDocument - A function that summarizes a document submission.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The output type for the summarizeDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentText: z.string().describe('The full text content of the document to be summarized.'),
  summaryLength: z.string().optional().describe('The desired length of the summary (e.g., short, medium, long).'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;


const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;


export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}


const summarizeDocumentPrompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: { schema: SummarizeDocumentInputSchema },
  output: { schema: SummarizeDocumentOutputSchema },
  prompt: `You are an expert AI assistant for "The Fraternal Order of Eagles - Philippine Eagle" (TFOE-PE).
  Your task is to summarize the following document.
  The summary should be concise, clear, and capture the main points of the text.

  Document Content:
  ---
  {{{documentText}}}
  ---

  {{#if summaryLength}}
  Please generate a {{{summaryLength}}} summary.
  {{else}}
  Please generate a standard-length summary (approximately 3-5 sentences).
  {{/if}}

  Return the summary as a JSON object with a single "summary" field.
  `,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeDocumentPrompt(input);
    return output!;
  }
);
