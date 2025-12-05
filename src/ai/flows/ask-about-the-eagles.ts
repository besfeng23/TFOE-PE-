
'use server';
/**
 * @fileOverview An AI flow to answer questions about The Fraternal Order of Eagles.
 *
 * - askAboutTheEagles - a function that streams an answer to a question.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generate, generateStream } from 'genkit';

const FaqDataSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

// Mock tool to fetch FAQs. In a real app, this would query a database.
const getFaqs = ai.defineTool(
  {
    name: 'getFaqs',
    description: 'Get a list of frequently asked questions about the organization.',
    inputSchema: z.object({
      query: z.string().optional().describe('A specific topic to get FAQs for.'),
    }),
    outputSchema: z.array(FaqDataSchema),
  },
  async () => {
    // This is mock data. In a real application, you might fetch this from a CMS or database.
    return [
      {
        question: 'What is The Fraternal Order of Eagles?',
        answer: 'The Fraternal Order of Eagles (TFOE) is an international non-profit organization uniting fraternally in the spirit of liberty, truth, justice, and equality, to make human life more desirable by lessening its ills and promoting peace, prosperity, gladness and hope.',
      },
      {
        question: 'What is the TFOE-PE?',
        answer: 'TFOE-PE stands for The Fraternal Order of Eagles - Philippine Eagle. It is the Philippine chapter of the international organization, founded in 1979.',
      },
      {
        question: 'What is the motto?',
        answer: 'The motto is "Service Through Strong Brotherhood".',
      },
      {
        question: 'Who can join?',
        answer: 'Membership is open to individuals of good moral character, who believe in a Supreme Being, and are not affiliated with any subversive organizations.',
      },
    ];
  }
);


export async function askAboutTheEagles(question: string) {
  return generateStream({
    model: 'googleai/gemini-2.5-flash',
    tools: [getFaqs],
    prompt: `You are a helpful and friendly AI assistant for "The Fraternal Order of Eagles - Philippine Eagle" (TFOE-PE).
      Your role is to answer questions about the organization in a concise and informative way.
      Use the provided tools to get information if needed.
      Keep your answers to 2-3 sentences unless the user asks for more detail.

      USER'S QUESTION:
      ---
      ${question}
      ---
      `,
  });
}
