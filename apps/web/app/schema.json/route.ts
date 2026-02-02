import { NextResponse } from 'next/server';
import schema from '@statecharts/core/schema.json';

export function GET(): NextResponse {
  return NextResponse.json(schema, {
    headers: {
      'Content-Type': 'application/schema+json',
    },
  });
}
