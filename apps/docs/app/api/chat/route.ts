
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

    // System prompt untuk JKT48Connect AI dengan endpoint yang benar
    const systemPrompt = `Kamu adalah JKT48Connect AI, asisten virtual yang ditugaskan untuk membantu pengguna dalam menggunakan REST API dan module JKT48Connect. 

IDENTITAS:
- Nama: JKT48Connect AI
- Peran: Asisten dokumentasi dan implementasi JKT48Connect API
- Tujuan: Membantu developer mengintegrasikan JKT48Connect API ke dalam aplikasi mereka

KNOWLEDGE BASE:
JKT48Connect API adalah REST API yang menyediakan data terkait JKT48:
- Base URL: https://v2.jkt48connect.my.id
- Format response: JSON
- Authentication: Memerlukan API key yang bisa ditambahkan pada setiap endpoint seperti "?apikey=XXX"
- Founders, developers, dan lainnya adalah Valzyy

ENDPOINT LENGKAP:
1. Members Data: GET /api/jkt48/members
2. Birthday: GET /api/jkt48/birthday
3. Events: GET /api/jkt48/events
4. Recent Updates: GET /api/jkt48/recent
5. Replay: GET /api/jkt48/replay
6. Recent Detail: GET /api/jkt48/recent/{liveId}
7. Live Schedule: GET /api/jkt48/live
8. Live YouTube: GET /api/jkt48/live/youtube
9. YouTube: GET /api/jkt48/youtube
10. Live IDN: GET /api/jkt48/live/idn
11. Live Showroom: GET /api/jkt48/live/showroom
12. Member Detail: GET /api/jkt48/member/{name}
13. News: GET /api/jkt48/news
14. News Detail: GET /api/jkt48/news/{id}
15. Theater: GET /api/jkt48/theater
16. Theater Detail: GET /api/jkt48/theater/{id}
17. Chat Stream: GET /api/jkt48/chat-stream?username={username}&slug={slug}
18. Chat Stream SR: GET /api/jkt48/chat-stream-sr?room_id={roomId}

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
6. Redirect langsung ke halaman dokumentasi jika diminta

RESPONSE FORMAT:
- Berikan jawaban yang informatif dan mudah dipahami
- Sertakan contoh kode jika diperlukan
- Arahkan ke dokumentasi lengkap dengan menyebutkan link yang spesifik
- Gunakan bahasa Indonesia yang ramah dan profesional
- Jika user meminta dokumentasi atau ingin diarahkan ke halaman tertentu, berikan link langsung

CONTOH IMPLEMENTASI:
\`\`\`javascript
// Fetch members data
const response = await fetch('https://v2.jkt48connect.my.id/api/jkt48/members?apikey=YOUR_API_KEY');
const data = await response.json();
console.log(data);

// Fetch member detail
const memberResponse = await fetch('https://v2.jkt48connect.my.id/api/jkt48/member/Freya%20Jayawardana?apikey=YOUR_API_KEY');
const memberData = await memberResponse.json();
console.log(memberData);
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
    
    // Enhanced keyword detection untuk redirect ke dokumentasi
    const docLinks = {
      // Dokumentasi umum
      'dokumentasi': 'https://docs.jkt48connect.my.id/docs/ui',
      'panduan': 'https://docs.jkt48connect.my.id/docs/ui',
      'docs': 'https://docs.jkt48connect.my.id/docs/ui',
      
      // Spesifik pages
      'what is jkt48connect': 'https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect',
      'apa itu jkt48connect': 'https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect',
      'pengenalan': 'https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect',
      
      // API endpoints
      'all live': 'https://docs.jkt48connect.my.id/docs/ui/all-live',
      'live': 'https://docs.jkt48connect.my.id/docs/ui/all-live',
      'idn live': 'https://docs.jkt48connect.my.id/docs/ui/idn',
      'idn': 'https://docs.jkt48connect.my.id/docs/ui/idn',
      'showroom': 'https://docs.jkt48connect.my.id/docs/ui/showroom',
      'youtube': 'https://docs.jkt48connect.my.id/docs/ui/youtube',
      'recent': 'https://docs.jkt48connect.my.id/docs/ui/recent',
      'recent detail': 'https://docs.jkt48connect.my.id/docs/ui/recent-detail',
      'member': 'https://docs.jkt48connect.my.id/docs/ui/member',
      'members': 'https://docs.jkt48connect.my.id/docs/ui/member',
      
      // Additional endpoints
      'news': 'https://docs.jkt48connect.my.id/docs/ui',
      'theater': 'https://docs.jkt48connect.my.id/docs/ui',
      'birthday': 'https://docs.jkt48connect.my.id/docs/ui',
      'events': 'https://docs.jkt48connect.my.id/docs/ui',
      'chat stream': 'https://docs.jkt48connect.my.id/docs/ui'
    };

    // Cek apakah user meminta redirect langsung ke dokumentasi
    const userMessageLower = lastUserMessage.content.toLowerCase();
    const redirectKeywords = [
      'buka dokumentasi', 'ke dokumentasi', 'lihat dokumentasi',
      'redirect ke', 'arahkan ke', 'bawa ke',
      'halaman dokumentasi', 'page dokumentasi'
    ];

    const isDirectRedirectRequest = redirectKeywords.some(keyword => 
      userMessageLower.includes(keyword)
    );

    if (isDirectRedirectRequest) {
      // Cari keyword spesifik untuk redirect yang tepat
      let redirectLink = 'https://docs.jkt48connect.my.id/docs/ui'; // default
      
      for (const [keyword, link] of Object.entries(docLinks)) {
        if (userMessageLower.includes(keyword)) {
          redirectLink = link;
          break;
        }
      }
      
      processedResult += `\n\n🔗 **Redirect ke Dokumentasi:** ${redirectLink}`;
    } else {
      // Tambahkan link yang relevan berdasarkan konteks
      for (const [keyword, link] of Object.entries(docLinks)) {
        if (userMessageLower.includes(keyword)) {
          processedResult += `\n\n📚 **Dokumentasi Terkait:** ${link}`;
          break;
        }
      }
    }

    // Tambahkan footer dengan link dokumentasi umum jika belum ada link spesifik
    if (!processedResult.includes('📚 **Dokumentasi') && !processedResult.includes('🔗 **Redirect')) {
      processedResult += `\n\n📚 **Dokumentasi Lengkap:** https://docs.jkt48connect.my.id/docs/ui`;
    }

    // Tambahkan informasi tambahan untuk penggunaan API
    if (userMessageLower.includes('api key') || userMessageLower.includes('apikey') || userMessageLower.includes('authentication')) {
      processedResult += `\n\n🔑 **Catatan:** Jangan lupa menambahkan API key Anda pada setiap request: \`?apikey=YOUR_API_KEY\``;
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
