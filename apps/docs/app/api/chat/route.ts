
export const runtime = 'edge';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface APIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ConversationMemory {
  userId: string;
  history: Message[];
  lastAccess: number;
}

// In-memory storage untuk conversation history
const conversationMemory = new Map<string, ConversationMemory>();

// Clean up old conversations (older than 1 hour)
const cleanupMemory = () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  for (const [userId, memory] of conversationMemory.entries()) {
    if (now - memory.lastAccess > oneHour) {
      conversationMemory.delete(userId);
    }
  }
};

// Generate user ID from IP or use session
const getUserId = (req: Request): string => {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return `user_${ip}`;
};

// Get conversation history
const getConversationHistory = (userId: string): Message[] => {
  const memory = conversationMemory.get(userId);
  return memory?.history || [];
};

// Save conversation history
const saveConversationHistory = (userId: string, history: Message[]) => {
  const memory: ConversationMemory = {
    userId,
    history,
    lastAccess: Date.now()
  };
  conversationMemory.set(userId, memory);
};

// API configurations
const apiConfigs = [
  {
    name: "DeepSeek V3",
    url: "https://router.huggingface.co/fireworks-ai/inference/v1/chat/completions",
    model: "accounts/fireworks/models/deepseek-v3",
    role: "Analyzer & Initial Responder",
    systemPrompt: "Kamu adalah DeepSeek V3, AI pertama dalam rantai pemrosesan. Tugasmu adalah menganalisis pertanyaan user dengan mendalam dan memberikan respons awal yang komprehensif. Fokus pada pemahaman konteks dan memberikan jawaban yang informatif dan terstruktur."
  },
  {
    name: "Kimi K2",
    url: "https://router.huggingface.co/novita/v3/openai/chat/completions",
    model: "moonshotai/kimi-k2-instruct",
    role: "Refiner & Enhancer",
    systemPrompt: "Kamu adalah Kimi K2, AI kedua yang bertugas memperbaiki dan meningkatkan kualitas respons dari AI sebelumnya. Analisis respons yang diberikan, perbaiki kesalahan, tambahkan detail yang kurang, dan pastikan jawaban lebih jelas dan mudah dipahami."
  },
  {
    name: "Qwen2",
    url: "https://router.huggingface.co/featherless-ai/v1/chat/completions",
    model: "Qwen/Qwen2-7B-Instruct",
    role: "Validator & Optimizer",
    systemPrompt: "Kamu adalah Qwen2, AI ketiga yang bertugas memvalidasi dan mengoptimalkan respons. Periksa akurasi informasi, pastikan struktur jawaban logis, dan optimalkan agar lebih engaging dan user-friendly. Hilangkan redundansi dan tambahkan contoh jika perlu."
  },
  {
    name: "MiniMax M1",
    url: "https://router.huggingface.co/novita/v3/openai/chat/completions",
    model: "minimaxai/minimax-m1-80k",
    role: "Final Polisher",
    systemPrompt: "Kamu adalah MiniMax M1, AI terakhir yang bertugas memberikan sentuhan akhir pada respons. Pastikan jawaban sempurna, ramah, dan siap dikirim ke user. Perbaiki tone, grammar, dan pastikan jawaban benar-benar membantu user. Ini adalah tahap final sebelum dikirim ke pengguna."
  }
];

// Call single AI model
const callAIModel = async (config: any, messages: Message[]): Promise<string> => {
  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: config.systemPrompt
          },
          ...messages
        ],
        model: config.model,
        stream: false,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`${config.name} API error: ${response.status}`);
    }

    const data: APIResponse = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error(`Invalid response from ${config.name}`);
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error calling ${config.name}:`, error);
    throw error;
  }
};

// Multi-model processing pipeline
const processWithMultipleModels = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
  let currentResponse = userMessage;
  let processingHistory = [...conversationHistory];

  // Add user message to processing history
  processingHistory.push({
    role: 'user',
    content: userMessage
  });

  for (let i = 0; i < apiConfigs.length; i++) {
    const config = apiConfigs[i];
    console.log(`Processing with ${config.name} (${config.role})...`);

    try {
      let messages: Message[];

      if (i === 0) {
        // First model: Process original user message with full conversation history
        messages = processingHistory;
      } else {
        // Subsequent models: Process previous AI response
        messages = [
          {
            role: 'user',
            content: `Berikut adalah pertanyaan asli user dan respons dari AI sebelumnya. Tugasmu sebagai ${config.role} adalah memperbaiki dan meningkatkan kualitas respons tersebut.

PERTANYAAN ASLI USER: "${userMessage}"

RESPONS AI SEBELUMNYA: "${currentResponse}"

Perbaiki, tingkatkan, dan berikan respons yang lebih baik sesuai dengan peranmu sebagai ${config.role}.`
          }
        ];
      }

      const aiResponse = await callAIModel(config, messages);
      currentResponse = aiResponse;

      // Add some delay between calls to prevent rate limiting
      if (i < apiConfigs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (error) {
      console.error(`Error with ${config.name}:`, error);
      
      // If there's an error, try to continue with current response
      if (i === 0) {
        // If first model fails, return error
        throw new Error(`Primary AI model failed: ${error}`);
      }
      // If subsequent models fail, continue with previous response
      console.log(`Continuing with previous response due to ${config.name} failure`);
    }
  }

  return currentResponse;
};

export async function POST(req: Request) {
  try {
    // Clean up old memories periodically
    if (Math.random() < 0.1) { // 10% chance to clean up
      cleanupMemory();
    }

    const reqJson = await req.json();
    const userId = getUserId(req);
    
    // Get conversation history
    let conversationHistory = getConversationHistory(userId);
    
    // Get the last user message
    const lastUserMessage = reqJson.messages
      .filter((msg: any) => msg.role === 'user')
      .pop();
    
    if (!lastUserMessage) {
      return new Response(
        JSON.stringify({ error: 'No user message found' }), 
        { status: 400 }
      );
    }

    // System prompt for JKT48Connect AI
    const jkt48SystemPrompt: Message = {
      role: "system",
      content: `Kamu adalah JKT48Connect AI, asisten virtual yang ditugaskan untuk membantu pengguna dalam menggunakan REST API dan module JKT48Connect. 

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

Selalu siap membantu dengan pertanyaan seputar JKT48Connect API!`
    };

    // Initialize conversation history if empty
    if (conversationHistory.length === 0) {
      conversationHistory = [jkt48SystemPrompt];
    }

    // Process user message through multiple AI models
    console.log('Starting multi-model processing pipeline...');
    const finalResponse = await processWithMultipleModels(
      lastUserMessage.content,
      conversationHistory
    );

    // Post-process response untuk menambahkan link otomatis
    let processedResult = finalResponse;
    
    // Enhanced keyword detection untuk redirect ke dokumentasi
    const docLinks = {
      'dokumentasi': 'https://docs.jkt48connect.my.id/docs/ui',
      'panduan': 'https://docs.jkt48connect.my.id/docs/ui',
      'docs': 'https://docs.jkt48connect.my.id/docs/ui',
      'what is jkt48connect': 'https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect',
      'apa itu jkt48connect': 'https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect',
      'pengenalan': 'https://docs.jkt48connect.my.id/docs/ui/what-is-jkt48connect',
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
      'news': 'https://docs.jkt48connect.my.id/docs/ui',
      'theater': 'https://docs.jkt48connect.my.id/docs/ui',
      'birthday': 'https://docs.jkt48connect.my.id/docs/ui',
      'events': 'https://docs.jkt48connect.my.id/docs/ui',
      'chat stream': 'https://docs.jkt48connect.my.id/docs/ui'
    };

    // Check for redirect requests
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
      let redirectLink = 'https://docs.jkt48connect.my.id/docs/ui';
      
      for (const [keyword, link] of Object.entries(docLinks)) {
        if (userMessageLower.includes(keyword)) {
          redirectLink = link;
          break;
        }
      }
      
      processedResult += `\n\n🔗 **Redirect ke Dokumentasi:** ${redirectLink}`;
    } else {
      for (const [keyword, link] of Object.entries(docLinks)) {
        if (userMessageLower.includes(keyword)) {
          processedResult += `\n\n📚 **Dokumentasi Terkait:** ${link}`;
          break;
        }
      }
    }

    // Add general documentation link if no specific link added
    if (!processedResult.includes('📚 **Dokumentasi') && !processedResult.includes('🔗 **Redirect')) {
      processedResult += `\n\n📚 **Dokumentasi Lengkap:** https://docs.jkt48connect.my.id/docs/ui`;
    }

    // Add API key reminder
    if (userMessageLower.includes('api key') || userMessageLower.includes('apikey') || userMessageLower.includes('authentication')) {
      processedResult += `\n\n🔑 **Catatan:** Jangan lupa menambahkan API key Anda pada setiap request: \`?apikey=YOUR_API_KEY\``;
    }

    // Update conversation history
    conversationHistory.push({
      role: 'user',
      content: lastUserMessage.content
    });
    
    conversationHistory.push({
      role: 'assistant',
      content: processedResult
    });

    // Keep only last 10 messages to prevent memory bloat
    if (conversationHistory.length > 21) { // system + 10 pairs
      conversationHistory = [
        conversationHistory[0], // Keep system prompt
        ...conversationHistory.slice(-20) // Keep last 20 messages (10 pairs)
      ];
    }

    // Save updated conversation history
    saveConversationHistory(userId, conversationHistory);

    // Add processing info
    processedResult += `\n\n---\n*Processed by Multi-Model AI Pipeline: ${apiConfigs.map(c => c.name).join(' → ')}*`;

    return new Response(
      JSON.stringify({
        success: true,
        result: processedResult,
        processing_info: {
          models_used: apiConfigs.map(c => c.name),
          conversation_length: conversationHistory.length,
          user_id: userId
        }
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
        error: error instanceof Error ? error.message : 'Internal server error'
      }), 
      { status: 500 }
    );
  }
}
