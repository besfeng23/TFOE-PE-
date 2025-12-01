'use server';
/**
 * @fileOverview A flow to generate a CSV report of member data.
 *
 * - generateMemberReport - A function that generates a member report.
 * - GenerateMemberReportInput - The input type for the generateMemberReport function.
 * - GenerateMemberReportOutput - The return type for the generateMemberReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { UserProfile } from '@/lib/types';

const GenerateMemberReportInputSchema = z.object({
  profiles: z.array(z.any()).describe("A list of user profile objects to include in the report."),
});
export type GenerateMemberReportInput = z.infer<typeof GenerateMemberReportInputSchema>;

const GenerateMemberReportOutputSchema = z.object({
  csv: z.string().describe('The generated member report in CSV format.'),
});
export type GenerateMemberReportOutput = z.infer<typeof GenerateMemberReportOutputSchema>;

export async function generateMemberReport(input: GenerateMemberReportInput): Promise<GenerateMemberReportOutput> {
  return generateMemberReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMemberReportPrompt',
  input: { schema: GenerateMemberReportInputSchema },
  output: { schema: GenerateMemberReportOutputSchema },
  prompt: `You are a data processing assistant for "The Fraternal Order of Eagles - Philippine Eagle" (TFOE-PE).
  Your task is to convert a JSON array of member profiles into a CSV string.

  The CSV should have the following headers:
  "ID", "First Name", "Last Name", "Email", "Membership Number", "Role", "Membership Status", "Government Position", "Government Branch", "Position Type"

  Here is the data:
  {{{JSON.stringify profiles}}}

  Generate the CSV string based on the provided data. Ensure that if a value is missing for a field, it is represented as an empty string in the CSV.
  `,
});

const generateMemberReportFlow = ai.defineFlow(
  {
    name: 'generateMemberReportFlow',
    inputSchema: GenerateMemberReportInputSchema,
    outputSchema: GenerateMemberReportOutputSchema,
  },
  async (input) => {
    // Sanitize data before sending to the model
    const profilesToProcess = input.profiles.map((p: UserProfile) => ({
      id: p.id || '',
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      email: p.email || '',
      membershipNumber: p.membershipNumber || '',
      roleId: p.roleId || '',
      membershipStatus: p.membershipStatus || 'N/A',
      assignedGovernmentPosition: p.assignedGovernmentPosition || '',
      governmentBranch: p.governmentBranch || '',
      positionType: p.positionType || 'None',
    }));

    const { output } = await prompt({ profiles: profilesToProcess });
    return output!;
  }
);
