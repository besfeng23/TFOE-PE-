
import {askAboutTheEagles} from '@/ai/flows/ask-about-the-eagles';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  const {query} = await req.json();
  const answer = await askAboutTheEagles.run({query});
  return NextResponse.json({answer});
}
