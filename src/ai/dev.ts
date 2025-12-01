import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-document-submissions.ts';
import '@/ai/flows/intelligent-form-completion.ts';
import '@/ai/flows/generate-endorsement-letter.ts';
import '@/ai/flows/generate-member-report.ts';
import '@/ai/flows/extract-