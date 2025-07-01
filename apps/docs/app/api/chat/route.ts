
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

    // System prompt untuk JKT48Connect AI
    const systemPrompt = `Kamu adalah JKT48Connect AI, asisten virtual yang ditugaskan untuk membantu pengguna dalam menggunakan REST API dan module JKT48Connect. 

IDENTITAS:
- Nama: JKT48Connect AI
- Peran: Asisten dokumentasi dan implementasi JKT48Connect API
- Tujuan: Membantu developer mengintegrasikan JKT48Connect API ke dalam aplikasi mereka

KNOWLEDGE BASE:
JKT48Connect API adalah REST API yang menyediakan data terkait JKT48:
- Base URL: https://v2.jkt48connect.my.id
- Format response: JSON
- dan ini memerlukan authentication berubah apikey yang bisa ditambahkan pada setiap endpoint seperti "?apikey=XXX"
- Founders, developers, dan lainnya adalah Valzyy

ENDPOINT UTAMA:
1. Members Data: GET /api/jkt48/members
2. Live Schedule: GET /api/jkt48/live  
3. Theater Schedule: GET /api/jkt48/theater
4. Showroom: GET /api/showroom
5. IDN Live: GET /api/idn
6. YouTube: GET /api/youtube
7. Recent Updates: GET /api/recent

DOKUMENTASI LENGKAP:
- Panduan Umum: https://docs.jkt48connect.my.id/docs/ui
- Apa itu JKT48Connect: https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect
- All Live: https://docs.jkt48connect.my.id/docs/ui/all-live
- IDN Live: https://docs.jkt48connect.my.id/docs/ui/idn
- Showroom: https://docs.jkt48connect.my.id/docs/ui/showroom
- YouTube: https://docs.jkt48connect.my.id/docs/ui/youtube
- Recent Updates: https://docs.jkt48connect.my.id/docs/ui/recent
- Recent Detail: https://docs.jkt48connect.my.id/docs/ui/recent-detail
- Member Data: https://docs.jkt48connect.my.id/docs/ui/member

TUGAS UTAMA:
1. Jelaskan cara menggunakan JKT48Connect API
2. Berikan contoh implementasi kode
3. Arahkan pengguna ke dokumentasi yang tepat
4. Bantu troubleshooting masalah integrasi
5. Berikan rekomendasi best practices

RESPONSE FORMAT:
- Berikan jawaban yang informatif dan mudah dipahami
- Sertakan contoh kode jika diperlukan
- Arahkan ke dokumentasi lengkap dengan menyebutkan link yang spesifik
- Gunakan bahasa Indonesia yang ramah dan profesional

CONTOH IMPLEMENTASI:
\`\`\`javascript
// Fetch members data
const response = await fetch('https://v2.jkt48connect.my.id/api/jkt48/members');
const data = await response.json();
console.log(data);
\`\`\`

Selalu siap membantu dengan pertanyaan seputar JKT48Connect API!`;

    // Gabungkan system prompt dengan user message
    const fullPrompt = `${systemPrompt}\n\nUser: ${lastUserMessage.content}`;

    // Panggil API JKT48Connect
    const apiUrl = `https://api.jkt48connect.my.id/api/ai/microsoft?text=${encodeURIComponent(fullPrompt)}&api_key=JKTCONNECT`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.success) {
      return new Response(
        JSON.stringify({ error: 'API call failed' }), 
        { status: 500 }
      );
    }

    // Post-process response untuk menambahkan link otomatis
    let processedResult = data.result;
    
    // Detect keywords dan arahkan ke dokumentasi yang tepat
    const docLinks = {
      'what is jkt48connect': 'https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect',
      'apa itu jkt48connect': 'https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect',
      'all live': 'https://docs.jkt48connect.my.id/docs/ui/all-live',
      'idn live': 'https://docs.jkt48connect.my.id/docs/ui/idn',
      'showroom': 'https://docs.jkt48connect.my.id/docs/ui/showroom',
      'youtube': 'https://docs.jkt48connect.my.id/docs/ui/youtube',
      'recent': 'https://docs.jkt48connect.my.id/docs/ui/recent',
      'member': 'https://docs.jkt48connect.my.id/docs/ui/member',
      'dokumentasi': 'https://docs.jkt48connect.my.id/docs/ui'
    };

    // Tambahkan link yang relevan berdasarkan konteks
    const userMessageLower = lastUserMessage.content.toLowerCase();
    for (const [keyword, link] of Object.entries(docLinks)) {
      if (userMessageLower.includes(keyword)) {
        processedResult += `\n\n📚 **Dokumentasi Lengkap:** ${link}`;
        break;
      }
    }

    // Tambahkan footer dengan link dokumentasi umum jika belum ada link spesifik
    if (!processedResult.includes('📚 **Dokumentasi Lengkap:**')) {
      processedResult += `\n\n📚 **Dokumentasi Lengkap:** https://docs.jkt48connect.my.id/docs/ui`;
    }

    // Return response dalam format yang sesuai
    return new Response(
      JSON.stringify({
        success: true,
        result: processedResult
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }), 
      { status: 500 }
    );
  }
}
