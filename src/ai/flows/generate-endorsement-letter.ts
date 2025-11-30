'use server';
/**
 * @fileOverview A flow to generate endorsement letters for partners.
 *
 * - generateEndorsementLetter - A function that generates an endorsement letter.
 * - GenerateEndorsementLetterInput - The input type for the generateEndorsementLetter function.
 * - GenerateEndorsementLetterOutput - The return type for the generateEndorsementLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEndorsementLetterInputSchema = z.object({
  partnerName: z.string().describe('The name of the partner organization.'),
  contactPerson: z.string().describe('The primary contact person at the partner organization.'),
  partnershipType: z.string().describe('The type of partnership (e.g., Corporate, NGO).'),
  projectName: z.string().optional().describe('The name of a specific project or initiative, if applicable.'),
});
export type GenerateEndorsementLetterInput = z.infer<typeof GenerateEndorsementLetterInputSchema>;

const GenerateEndorsementLetterOutputSchema = z.object({
  subject: z.string().describe('The subject line for the endorsement letter.'),
  body: z.string().describe('The full text content of the endorsement letter.'),
});
export type GenerateEndorsementLetterOutput = z.infer<typeof GenerateEndorsementLetterOutputSchema>;

export async function generateEndorsementLetter(input: GenerateEndorsementLetterInput): Promise<GenerateEndorsementLetterOutput> {
  return generateEndorsementLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEndorsementLetterPrompt',
  input: {schema: GenerateEndorsementLetterInputSchema},
  output: {schema: GenerateEndorsementLetterOutputSchema},
  prompt: `You are an AI assistant for "The Fraternal Order of Eagles - Philippine Eagle" (TFOE-PE). Your task is to generate a formal endorsement letter.

  The letter should be written from the perspective of the National President of TFOE-PE.
  The tone should be professional, respectful, and appreciative.

  **Recipient Details:**
  - Organization Name: {{{partnerName}}}
  - Contact Person: {{{contactPerson}}}
  - Partnership Type: {{{partnershipType}}}
  {{#if projectName}}- Specific Project: {{{projectName}}}{{/if}}

  **Instructions:**
  1.  Create a clear and concise subject line for the letter.
  2.  Write the body of the letter. It should:
      - Start with a formal salutation to {{{contactPerson}}}.
      - Acknowledge the partnership between TFOE-PE and {{{partnerName}}}.
      - Express gratitude for their support and collaboration.
      - Formally endorse their efforts, particularly in relation to the {{{partnershipType}}} sector.
      {{#if projectName}}- Mention the specific project "{{{projectName}}}" and commend their work on it.{{/if}}
      - Reiterate TFOE-PE's commitment to the partnership.
      - End with a formal closing (e.g., "Sincerely," or "Respectfully,") followed by the name and title:
        "Kuya [Your Name], National President, The Fraternal Order of Eagles - Philippine Eagle". Use a placeholder for the President's name.

  Return the output as a JSON object with "subject" and "body" fields.
  `,
});

const generateEndorsementLetterFlow = ai.defineFlow(
  {
    name: 'generateEndorsementLetterFlow',
    inputSchema: GenerateEndorsementLetterInputSchema,
    outputSchema: GenerateEndorsementLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
