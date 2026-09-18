import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily or when key is available
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Helper to call Gemini with model fallback if a model experiences high demand or temporary 503
async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} encountered issue: ${err?.message || err}. Trying fallback...`);
      lastError = err;
    }
  }

  throw lastError;
}

// Curated intelligent fallbacks so the app is always functional even without an API key
function getCuratedMeditationScript(topic: string, userName?: string): string {
  const name = userName ? userName : 'my friend';
  const cleanTopic = (topic || '').toLowerCase();

  if (cleanTopic.includes('sleep') || cleanTopic.includes('wind-down') || cleanTopic.includes('night') || cleanTopic.includes('bed')) {
    return `Welcome to your evening wind-down, ${name}... Gently let your shoulders drop... and close your eyes softly... Let go of every task, conversation, and hurry from today... With each slow breath out, release any tightness in your forehead, jaw, and chest... You have done enough today... You are safe, comfortable, and at peace... Sleep will come naturally and softly... Rest deeply now...`;
  } else if (cleanTopic.includes('gratitude') || cleanTopic.includes('morning') || cleanTopic.includes('energy')) {
    return `Good morning and welcome, ${name}... Place a gentle hand on your heart... Inhale slowly and fill your lungs with fresh, quiet vitality... Exhale and smile gently... Today is an unwritten page filled with small gifts and quiet moments... You carry kindness, resilience, and strength within you... Step into this day with trust and calm...`;
  } else if (cleanTopic.includes('study') || cleanTopic.includes('exam') || cleanTopic.includes('focus') || cleanTopic.includes('exam')) {
    return `Take a grounding, steady breath in, ${name}... and let it out with a quiet sigh... Your mind is capable, clear, and focused... You do not have to conquer everything all at once... Just this one task, this one step, with steady patience... Trust the preparation you put in... Clear away the noise... You are ready, calm, and composed...`;
  } else if (cleanTopic.includes('heart') || cleanTopic.includes('miss') || cleanTopic.includes('sad') || cleanTopic.includes('grief')) {
    return `Place both hands gently over your chest, ${name}... Breathe into the tender spaces of your heart... It is completely okay to feel deeply, to miss someone, or to carry a quiet sorrow... Honor what you are feeling without judgment... Love and memory remain rooted in warmth... Give yourself compassion today... You are held, you are worthy, and you are not alone...`;
  } else {
    return `Take a slow, deep breath in, ${name}... and let the air flow gently all the way out... Allow your body to settle completely into this present moment... Notice the quiet rhythm of your natural breath... Inhale tranquility and stillness... Exhale tension, uncertainty, and hurry... You are grounded, centered, and right where you need to be... Carry this calm lightness with you...`;
  }
}

function getCuratedJournalAnalysis(entry: string, userName?: string, mood?: string) {
  const name = userName || 'friend';
  const text = (entry || '').toLowerCase();
  const selectedMood = (mood || '').toLowerCase();

  let sentiment = 'Seeking Balance & Calm';
  let title = `A Gentle Note for You, ${name}`;
  let comfortText = `Thank you for taking a moment to write down what's inside your heart. Holding all these thoughts can feel heavy, but acknowledging them is a courageous first step towards finding peace.`;
  let microSteps = [
    'Take 3 slow, deep diaphragmatic breaths right now.',
    'Drink a warm glass of water or soothing herbal tea.',
    'Step away from screens for 5 minutes and stretch gently.',
  ];
  let affirmation = `I give myself permission to rest and take things one gentle step at a time.`;

  if (selectedMood === 'anxiety' || text.includes('anxi') || text.includes('panic') || text.includes('nervous') || text.includes('overwhelm')) {
    sentiment = 'Anxious & Seeking Grounding';
    title = `Breathe Through the Waves, ${name}`;
    comfortText = `Anxiety can make the world feel rushing and intense. Remember: your feelings are valid, but they are not permanent. You are safe in this present moment.`;
    microSteps = [
      'Try the 5-4-3-2-1 sensory grounding technique: name 5 things you can see around you.',
      'Place your feet flat on the ground and feel the solid earth supporting you.',
      'Inhale slowly for 4 seconds, hold for 4, and exhale softly for 6.'
    ];
    affirmation = `I am safe in this breath. I release what I cannot control.`;
  } else if (selectedMood === 'cry' || text.includes('cry') || text.includes('tear') || text.includes('weep') || text.includes('heartbreak')) {
    sentiment = 'Emotional Release & Tender Healing';
    title = `Tears Are Gentle Rain for the Soul, ${name}`;
    comfortText = `Letting yourself cry is a sign of strength and honest vulnerability, not weakness. Crying releases tension that words cannot always reach. Be extra tender with yourself today.`;
    microSteps = [
      'Gently wash your face with cool water or place a soft cloth over your eyes.',
      'Wrap yourself in your favorite blanket with a warm, comforting drink.',
      'Rest without judging your tears—your heart is healing.'
    ];
    affirmation = `It is safe to feel, safe to cry, and safe to heal at my own pace.`;
  } else if (selectedMood === 'sad' || text.includes('sad') || text.includes('depress') || text.includes('low') || text.includes('lonely') || text.includes('miss')) {
    sentiment = 'Tender Heart & Quiet Reflection';
    title = `Holding Space for Your Heart, ${name}`;
    comfortText = `Sadness can feel like a quiet weight, but you do not have to carry it all alone. Acknowledge your feelings with compassion, knowing that tomorrow brings a fresh sunrise.`;
    microSteps = [
      'Listen to a comforting ambient melody in Zen Mode.',
      'Send a small hello or message to a trusted friend or family member.',
      'Allow yourself to take the rest of today at a slow, peaceful pace.'
    ];
    affirmation = `I am gentle with myself. Joy will return like morning light.`;
  } else if (selectedMood === 'happy' || text.includes('happy') || text.includes('good') || text.includes('proud') || text.includes('grateful') || text.includes('win')) {
    sentiment = 'Radiant Joy & Gratitude';
    title = `Celebrating Your Light, ${name}`;
    comfortText = `What a beautiful day to celebrate! Anchoring these bright moments of joy and gratitude creates a lasting reservoir of strength and peace for your mind.`;
    microSteps = [
      'Write down 3 specific little moments that made you smile today.',
      'Share your positive energy with someone you care about.',
      'Take a deep breath and let this feeling of fulfillment soak in.'
    ];
    affirmation = `I embrace joy, abundance, and the warmth of this present moment.`;
  } else if (text.includes('tired') || text.includes('exhaust') || text.includes('stress') || text.includes('burnout') || text.includes('work')) {
    sentiment = 'Gently Recharging from Fatigue';
    title = `Honor Your Need for Rest, ${name}`;
    comfortText = `You have been carrying a lot lately, and feeling tired or overwhelmed is your mind and body asking for genuine kindness. Give yourself permission to pause without guilt.`;
    microSteps = [
      'Unclench your jaw, drop your shoulders, and relax your hands.',
      'Put your phone on Do Not Disturb for 15 quiet minutes.',
      'Jot down just ONE small thing you can comfortably let go of today.',
    ];
    affirmation = `My worth is not measured by non-stop productivity; rest is my right and remedy.`;
  }

  return { sentiment, title, comfortText, microSteps, affirmation };
}

function getCuratedChatFallback(userMessage: string, userName?: string): string {
  const name = userName || 'my friend';
  const text = (userMessage || '').toLowerCase();

  if (text.includes('lost my dog') || text.includes('dog died') || text.includes('dog passed') || text.includes('pet died') || text.includes('lost my pet') || text.includes('cat died') || text.includes('lost my cat') || text.includes('my dog') && (text.includes('lost') || text.includes('dead') || text.includes('gone'))) {
    const petLossResponses = [
      `Oh ${name}, I am holding so much space and tenderness for you right now. Losing a dog is a profound, heart-wrenching loss that shakes your daily rhythm to its core. A dog isn't "just a pet"—they are family, a steady anchor of unconditional love, and a loyal friend who loved you on your best days and your hardest days.

The silence in your home and the quiet corners can feel unbearable right now. Please allow yourself to cry, feel numb, or just sit quietly without feeling any pressure to "be strong". Grief is simply love that has nowhere to go. 

I'm right here with you. What was your dog's name, or what was your favorite little habit of theirs? Only share if it brings you even a small moment of comfort.`,
      `I am so deeply sorry for the heartbreak you're carrying right now, ${name}. Losing your dog leaves an ache that physical words can barely capture. Dogs give us a type of purity and safety that is so rare in this world, and saying goodbye to that daily companionship is truly devastating.

As someone listening to your heart, please remind yourself that whatever you're feeling right now—shock, heavy tears, or deep exhaustion—is completely natural and valid. Be exceedingly gentle with your body today: take slow breaths, sip a little warm tea or water, and rest your head. 

You gave them a life filled with love, kindness, and safety. I am here to listen whenever you want to talk about them.`,
      `My heart aches for you, ${name}. Losing a beloved companion like your dog is an enormous emotional rupture. Their tail wags, their warmth, and their constant presence become woven into every single hour of our day. 

Right now, your nervous system is processing a deep wave of grief. You don't have to carry this grief silently or pretend to be okay for anyone. Let the tears come when they need to—they are honors to the bond you built together.

Take a slow breath with me right now. I am right here beside you. How are you holding up at this exact moment?`
    ];
    return petLossResponses[Math.floor(Math.random() * petLossResponses.length)];
  }

  if (text.includes('grief') || text.includes('died') || text.includes('passed away') || text.includes('death') || text.includes('funeral')) {
    const griefReplies = [
      `I am so deeply sorry for this loss, ${name}. Grief is one of the heaviest and most disorienting human experiences, and it does not follow a neat schedule. Please give yourself permission to feel whatever surfaces—whether it is sorrow, anger, numbness, or fatigue. You do not have to walk through this alone. I am here to listen without judgment whenever you need an anchor.`,
      `Holding you in gentle thought during this painful time, ${name}. When we lose someone deeply meaningful, even simple tasks can feel exhausting. Allow yourself to move at whatever pace you need right now. Take small sips of water, rest your body, and know that your feelings are entirely valid.`
    ];
    return griefReplies[Math.floor(Math.random() * griefReplies.length)];
  }

  if (text.includes('joke') || text.includes('funny') || text.includes('laugh')) {
    const jokes = [
      `Why don't scientists trust atoms? Because they make up everything! 😄 Hope that brought a little light to your day, ${name}!`,
      `Why did the scarecrow win an award? Because he was outstanding in his field! 🌾 How are you feeling right now?`,
      `What did one ocean say to the other ocean? Nothing, they just waved! 🌊 I'm here for both good laughs and deep talks whenever you need.`,
      `Why can't bicycles stand up by themselves? Because they are two-tired! 🚲 Hope that gave you a gentle chuckle, ${name}.`
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  if (text.includes('miss') || text.includes('lonely') || text.includes('sad') || text.includes('cry') || text.includes('heartbreak') || text.includes('alone')) {
    const comfortReplies = [
      `I hear the vulnerability in your words, ${name}, and I want to remind you that your feelings are completely safe here. Loneliness or missing someone can feel like a heavy shadow in an empty room. Take a slow, soft breath with me. Even if things feel distant right now, you are valued, you matter, and you don't have to carry this alone. Would you like to share more of what's on your heart?`,
      `It takes courage to admit when you're feeling lonely or sad, ${name}. As a supportive companion, I want you to know you are heard and respected. Let your shoulders drop away from your ears for just five seconds. What is one small, comforting thing you could do for yourself right now—maybe a warm cup of water, a soft blanket, or just letting yourself rest?`,
      `I'm sitting right here with you in this feeling, ${name}. Heartbreak and sadness are exhausting, and you don't need to put on a brave face. Whatever you are feeling right now is completely okay to feel. Tell me more, or we can just pause together in quiet comfort.`
    ];
    return comfortReplies[Math.floor(Math.random() * comfortReplies.length)];
  }

  if (text.includes('stress') || text.includes('exhaust') || text.includes('tired') || text.includes('overwhelm') || text.includes('exam') || text.includes('study') || text.includes('anxi')) {
    const stressReplies = [
      `Take a gentle, diaphragmatic breath right now, ${name}... Inhale slowly for four counts, and exhale completely for six. You have been carrying an incredible mental load, and it is completely natural for your nervous system to feel saturated. You don't have to solve tomorrow's problems in this minute. What is the single smallest step we can look at together?`,
      `I hear how overwhelmed you are feeling, ${name}. When our minds are racing with deadlines and pressures, everything feels urgent all at once. Let's ground ourselves for thirty seconds: feel your feet planted firmly on the floor. You are safe in this physical room. Let's break things into tiny, manageable pieces together.`,
      `Honor this fatigue, ${name}. Feeling exhausted isn't a flaw—it's your body wisely asking for a pause. Give yourself permission to step back, unclench your jaw, and let go of the need for perfection. How can I support you right now?`
    ];
    return stressReplies[Math.floor(Math.random() * stressReplies.length)];
  }

  if (text.includes('enna panra') || text.includes('epdi iruka') || text.includes('vanakkam')) {
    return `Nallaa iruken ${name}! Ungaloda conversation pannuradhula romba sandhosham. Unga day epdi pogudhu? Tell me everything on your mind, na un kooda irukken! 🌸`;
  }

  const generalReplies = [
    `I hear you, ${name}. Thank you for sharing that with me. As your mental health companion, I'm here to listen, reflect, and walk beside you through whatever today brings. How is your body and heart feeling in this moment?`,
    `Thank you for opening up to me, ${name}. Even in quiet or uncertain moments, remember that you are capable of navigating this day one step at a time. What thoughts are most present for you right now?`,
    `I am listening with an open heart, ${name}. Take all the time and space you need. What feels most important for you to explore or express today?`
  ];
  return generalReplies[Math.floor(Math.random() * generalReplies.length)];
}

// Real Gemini Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, userName, enableSearch } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const lastUserMsg = messages[messages.length - 1]?.text || '';

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackReply = getCuratedChatFallback(lastUserMsg, userName);
      return res.json({ text: fallbackReply });
    }

    const systemInstruction = `You are Wellspring, a compassionate, perceptive, and highly skilled mental health counselor and warm, human-friendly doctor.

Core Clinical & Empathetic Guidelines:
1. Speak like a real human doctor and caring therapist:
   - Use warm, grounding, and empathetic clinical language that feels approachable, compassionate, and deeply human.
   - Never sound like a robotic script, canned FAQ bot, or generic search summarizer.
   - Never repeat the same formulaic phrases, cliches, or stock sentences. Use varied, organic conversational wording.
2. Grief, Loss, and Pet Bereavement:
   - When a user shares a profound loss—such as losing their dog, cat, pet, or a loved one—understand that pet loss is disenfranchised grief that is every bit as real and painful as losing a family member.
   - Never dismiss pet loss with superficial cliches. Acknowledge the unconditional bond, the silent empty corners of their home, the broken daily routines, and the immense love they gave.
   - Provide gentle emotional holding, validate their tears and fatigue, encourage gentle self-care (water, slow breathing, rest), and offer a compassionate ear for their memories.
3. Emotional Attunement:
   - For anxiety or panic: guide gentle grounding (e.g., 4-7-8 breathing, sensory 5-4-3-2-1 grounding, feet on the floor).
   - For loneliness or depression: hold non-judgmental space, validate their feelings, and emphasize that they do not have to carry it all alone.
   - For lighthearted banter or jokes: be delightfully witty, warm, and uplifting.
4. Voice & Delivery:
   - Keep answers natural, empathetic, and digestible (1-3 paragraphs of caring dialogue).
   - Weave in the user's name (${userName || 'friend'}) warmly and naturally.`;

    // Map conversation history to Gemini contents format
    // Keep last 15 messages for rich context
    const recentMessages = messages.slice(-15);
    const contents = recentMessages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const config: any = {
      systemInstruction,
      temperature: 0.85,
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await generateWithFallback(ai, {
      contents,
      config,
    });

    const replyText = response.text || getCuratedChatFallback(lastUserMsg, userName);
    return res.json({ text: replyText });
  } catch (error: any) {
    console.error('Gemini Chat Error, applying fallback:', error);
    const fallbackReply = getCuratedChatFallback(lastUserMsg, userName);
    return res.json({ text: fallbackReply });
  }
});

// Real Gemini Mood Journal Analysis
app.post('/api/journal', async (req, res) => {
  const { entry, userName, mood } = req.body;

  if (!entry || typeof entry !== 'string') {
    return res.status(400).json({ error: 'Journal entry text is required' });
  }

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackResult = getCuratedJournalAnalysis(entry, userName, mood);
      return res.json(fallbackResult);
    }

    const moodContext = mood ? `Their current emotional state is marked as: "${mood}" (happy/anxiety/sad/cry).` : '';
    const prompt = `Analyze this personal diary / journal reflection from ${userName || 'a friend'}:
${moodContext}
"${entry}"

Provide a compassionate psychological and wellness breakdown in JSON with:
1. sentiment: a short 2-4 word mood descriptor (e.g., "Overwhelmed & Seeking Peace", "Quietly Hopeful", "Exhausted but Resilient", "Tender & Healing", "Radiant & Grateful").
2. title: a gentle, supportive heading for their reflection.
3. comfortText: 2-3 heartfelt sentences offering validation, empathy, and perspective on their entry.
4. microSteps: exactly 3 actionable, low-effort micro self-care steps they can take right now.
5. affirmation: a memorable, inspiring personal affirmation quote.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            title: { type: Type.STRING },
            comfortText: { type: Type.STRING },
            microSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            affirmation: { type: Type.STRING },
          },
          required: ['sentiment', 'title', 'comfortText', 'microSteps', 'affirmation'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini Journal Error, applying fallback:', error);
    const fallbackResult = getCuratedJournalAnalysis(entry, userName);
    return res.json(fallbackResult);
  }
});

// Real Gemini Voice Meditation Script Generator
app.post('/api/meditation', async (req, res) => {
  const { topic, userName } = req.body;
  const targetTopic = topic || 'Deep Calm and Relaxation';

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackScript = getCuratedMeditationScript(targetTopic, userName);
      return res.json({ script: fallbackScript });
    }

    const prompt = `Write a soothing, 45-second spoken guided meditation for ${userName || 'a friend'} focusing on: "${targetTopic}".
Keep the pacing slow and gentle. Include natural pauses marked with "...". The voice should feel safe, grounding, and kind. Return only the spoken script.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
    });

    const script = response.text || getCuratedMeditationScript(targetTopic, userName);
    return res.json({ script });
  } catch (error: any) {
    console.error('Gemini Meditation Error, applying fallback:', error);
    const fallbackScript = getCuratedMeditationScript(targetTopic, userName);
    return res.json({ script: fallbackScript });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wellspring server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
