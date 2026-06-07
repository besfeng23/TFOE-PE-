import {ai} from '@/ai/genkit';
import {defineFlow} from '@genkit-ai/core';
import {z} from 'zod';

export const askAboutTheEagles = defineFlow(
  {
    name: 'askAboutTheEagles',
    inputSchema: z.object({query: z.string()}),
    outputSchema: z.string(),
  },
  async ({query}) => {
    const llmResponse = await ai.generate({
      prompt: `You are a Philadelphia Eagles fan. Answer the following query about the Eagles in a passionate, but not overly aggressive, way: ${query}`,
    });
    return llmResponse.text();
  }
);
