'use server';
/**
 * @fileOverview An AI flow to extract member information from an uploaded file (e.g., an ID card image).
 *
 * - extractMemberFromFile - A function that handles the member data extraction process.
 * - ExtractMemberInput - The input type for the extractMemberFromFile functionthemed
 * - ExtractMemberOutput - The return type for the extractMemberFromFile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractMemberInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "An image or document file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractMemberInput = z.infer<typeof ExtractMemberInputSchema>;

const ExtractMemberOutputSchema = z.object({
  firstName: z.string().describe("The extracted first name of the member."),
  lastName: z.string().describe("The extracted last name of the member."),
  email: z.string().optional().describe("The extracted email address, if available."),
  membershipNumber: z.string().optional().describe("The extracted membership number, if available."),
}).describe("The structured member data extracted from the file.");
export type ExtractMemberOutput = z.infer<typeof ExtractMemberOutputSchema>;

export async function extractMemberFromFile(input: ExtractMemberInput): Promise<ExtractMemberOutput> {
  return extractMemberFromFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractMemberFromFilePrompt',
  input: { schema: ExtractMemberInputSchema },
  output: { schema: ExtractMemberOutputSchema },
  prompt: `You are an expert data entry assistant specializing in extracting information from identity cards and documents for "The Fraternal Order of Eagles - Philippine Eagle" (TFOE-PE).

  Your task is to analyze the provided file and extract the following information for a new member:
  - First Name
  - Last Name
  - Email Address (if present)
  - Membership Number (if present, often prefixed with a region like NCR, R1, etc.)

  Analyze the following file carefully. The text might be oriented in various ways. Be diligent in finding the correct fields. If a field is not present, omit it from the output.

  File: {{media url=fileDataUri}}

  Return the extracted information as a structured JSON object.
  `,
});

const extractMemberFromFileFlow = ai.defineFlow(
  {
    name: 'extractMemberFromFileFlow',
    inputSchema: ExtractMemberInputSchema,
    outputSchema: ExtractMemberOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
