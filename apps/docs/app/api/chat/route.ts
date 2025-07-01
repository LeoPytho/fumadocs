export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const reqJson = await req.json();
    
    // Ambil pesan terakhir dari user
    const lastUserMessage = reqJson.messages
      .filter((msg: any) => msg.role === 'user')
      .pop();
    
    if (!lastUserMessage) {
      return new Response(
        JSON.stringify({ error: 'No user message found' }), 
        { status: 400 }
      );
    }

    // Panggil API JKT48Connect
    const apiUrl = `https://api.jkt48connect.my.id/api/ai/microsoft?text=${encodeURIComponent(lastUserMessage.content)}&api_key=JKTCONNECT`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.success) {
      return new Response(
        JSON.stringify({ error: 'API call failed' }), 
        { status: 500 }
      );
    }

    // Return response dalam format yang sesuai
    return new Response(
      JSON.stringify({
        success: true,
        result: data.result
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }), 
      { status: 500 }
    );
  }
}
