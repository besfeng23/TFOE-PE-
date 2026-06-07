
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json(
    {
      error: 'AI features are not enabled.',
    },
    {status: 501}
  );
}
