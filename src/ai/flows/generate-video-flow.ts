
'use server';
/**
 * @fileOverview An AI flow to generate video from a text prompt using Veo.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';
import { initializeFirebaseAdmin } from '@/firebase/server';
import { serverTimestamp } from 'firebase/firestore';

const { firestore } = initializeFirebaseAdmin();

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video from.'),
  durationSeconds: z.number().optional().default(5),
});

const CheckVideoOperationInputSchema = z.object({
    operationName: z.string().describe('The name of the operation to check.'),
});

// Helper function to convert readable stream to base64
async function streamToBase64(stream: NodeJS.ReadableStream): Promise<string> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    });
}


export async function generateVideo(input: z.infer<typeof GenerateVideoInputSchema>) {
    const { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: input.prompt,
        config: {
            durationSeconds: input.durationSeconds,
            aspectRatio: '16:9',
        },
    });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }
    
    return { operation };
}


export async function checkVideoOperation(input: z.infer<typeof CheckVideoOperationInputSchema>) {
    let operation = await ai.checkOperation({ name: input.operationName });

    if (operation.done && !operation.error) {
        const videoPart = operation.output?.message?.content.find((p) => !!p.media);
        if (videoPart?.media?.url) {
             const fetch = (await import('node-fetch')).default;
            const videoDownloadResponse = await fetch(
                `${videoPart.media.url}&key=${process.env.GOOGLE_GENAI_API_KEY}`
            );

            if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
                throw new Error('Failed to download generated video.');
            }
            
            const base64Video = await streamToBase64(videoDownloadResponse.body);
            const dataUri = `data:video/mp4;base64,${base64Video}`;
            
            // Save the data URI to a new document in a 'generatedVideos' collection
            const newVideoRef = firestore.collection('generatedVideos').doc();
            await newVideoRef.set({
                id: newVideoRef.id,
                prompt: (operation.input?.message?.content[0] as any)?.text || 'N/A',
                videoUrl: dataUri,
                createdAt: serverTimestamp(),
            });

            // Modify the operation output to contain the data URI
            operation = {
                ...operation,
                output: {
                    ...operation.output,
                    videoUrl: dataUri,
                }
            }
        }
    }
    
    return { operation };
}
