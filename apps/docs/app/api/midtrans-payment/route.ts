import { NextRequest, NextResponse } from 'next/server';

const MIDTRANS_API_URL = 'https://api.midtrans.com/v2/charge';

export async function POST(request: NextRequest) {
  try {
    const { payload, authString } = await request.json();

    const response = await fetch(MIDTRANS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.status_message || 'Payment failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Midtrans API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
