import { NextResponse } from 'next/server';
import { birthInputSchema } from '@/lib/validation';
import { buildNatalReport } from '@/lib/synthesis/build-report';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = birthInputSchema.parse(json);
    const report = await buildNatalReport(input);
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
