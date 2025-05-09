import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
}