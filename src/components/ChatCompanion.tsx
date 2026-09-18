import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { Send, Mic, Sparkles, Volume2, VolumeX, Square, Globe, Play, AlertCircle } from 'lucide-react';

interface ChatCompanionProps {
  user: UserProfile | null;
  onShowToast: (msg: string) => void;
}

export const ChatCompanion: React.FC<ChatCompanionProps> = ({ user, onShowToast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [enableSearch, setEnableSearch] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop all active and queued speech immediately
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
    setSpeakingId(null);
    onShowToast('Voice speech stopped ⏹️');
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initial welcome message from Wellspring AI companion
  useEffect(() => {
    const userName = user?.name || 'friend';
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Vanakkam & Welcome, ${userName}! 🌸 I am your Wellspring mental health companion and doctor-guided listener.

You can talk freely with me about anything on your heart—whether you're carrying deep grief, overwhelmed by stress, missing someone you love, or need a compassionate space to unpack your day. I speak English, Tamil, and Tanglish.

How is your heart and mind feeling in this moment?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Find best natural voice for female or male selection
  const getSelectedVoice = (gender: 'female' | 'male'): SpeechSynthesisVoice | null => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (gender === 'female') {
      const femaleVoice = voices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          name.includes('female') ||
          name.includes('samantha') ||
          name.includes('victoria') ||
          name.includes('karen') ||
          name.includes('zira') ||
          name.includes('jenny') ||
          name.includes('moira') ||
          (name.includes('google') && name.includes('en') && !name.includes('male'))
        );
      });
      return femaleVoice || voices.find((v) => v.lang.startsWith('en')) || voices[0];
    } else {
      const maleVoice = voices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          name.includes('male') ||
          name.includes('daniel') ||
          name.includes('david') ||
          name.includes('alex') ||
          name.includes('guy') ||
          name.includes('ryan') ||
          name.includes('george') ||
          name.includes('oliver')
        );
      });
      return maleVoice || voices.find((v) => v.lang.startsWith('en')) || voices[0];
    }
  };

  // Voice speech synthesis with female or male tone
  const toggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Text-to-speech is not supported on this browser.');
      return;
    }

    // If currently speaking, stop immediately
    if (speakingId) {
      stopSpeaking();
      if (speakingId === id) {
        return;
      }
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    activeUtteranceRef.current = utterance;

    const voice = getSelectedVoice(voiceGender);
    if (voice) {
      utterance.voice = voice;
    }

    if (voiceGender === 'female') {
      utterance.pitch = 1.05; // Soothing, warm feminine tone
      utterance.rate = 0.93; // Human therapeutic cadence
    } else {
      utterance.pitch = 0.88; // Deep, grounded masculine resonance
      utterance.rate = 0.91; // Calm, steady cadence
    }

    utterance.onstart = () => {
      setSpeakingId(id);
    };

    utterance.onend = () => {
      if (activeUtteranceRef.current === utterance) {
        activeUtteranceRef.current = null;
        setSpeakingId(null);
      }
    };

    utterance.onerror = () => {
      if (activeUtteranceRef.current === utterance) {
        activeUtteranceRef.current = null;
        setSpeakingId(null);
      }
    };

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Quick voice tester
  const handleTestVoice = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Audio not supported.');
      return;
    }
    if (speakingId === 'test-sample') {
      stopSpeaking();
      return;
    }
    const sampleText =
      voiceGender === 'female'
        ? "Hello, I am your Wellspring companion. I am right here with you, listening with warmth and compassion."
        : "Hello, I am here to walk beside you through whatever you are carrying today. Take a gentle breath.";
    toggleSpeech('test-sample', sampleText);
  };

  // Toggle voice recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onShowToast('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        onShowToast('Listening... Speak your mind 🎙️');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        onShowToast('Voice input error. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      onShowToast('Could not access microphone.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim() || loading) return;

    const userMessageId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: messageContent.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);
    setApiError(null);

    try {
      // Safely proxy via backend Express server
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          userName: user?.name,
          enableSearch,
        }),
      });

      let replyText = '';
      if (res.ok) {
        const data = await res.json();
        replyText = data.text;
      }

      if (!replyText) {
        throw new Error('No reply received from chat server');
      }

      const modelMessageId = (Date.now() + 1).toString();
      const modelMsg: ChatMessage = {
        id: modelMessageId,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);

      if (autoSpeak) {
        toggleSpeech(modelMessageId, replyText);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      // Compassionate doctor fallback with rich grief & stress attunement
      const userText = messageContent.toLowerCase();
      let fallbackText = '';
      const name = user?.name || 'friend';

      if (userText.includes('lost my dog') || userText.includes('dog died') || userText.includes('pet died')) {
        fallbackText = `I am so deeply sorry for your loss, ${name}. Losing your beloved dog is heartbreaking, and it's completely okay to grieve and take this moment by moment. I'm right here with you.`;
      } else if (userText.includes('anxiety') || userText.includes('panic') || userText.includes('overwhelm')) {
        fallbackText = `Take a slow, gentle breath with me, ${name}. You are safe right now, and you don't have to carry everything at once. What's one small thing we can focus on together?`;
      } else {
        fallbackText = `I hear you, ${name}, and I'm right here listening. Take a gentle breath—how can I best support you in this moment?`;
      }

      const fallbackId = (Date.now() + 1).toString();
      const fallbackMsg: ChatMessage = {
        id: fallbackId,
        role: 'model',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, fallbackMsg]);

      if (autoSpeak) {
        toggleSpeech(fallbackId, fallbackText);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-black dark:text-white">
      {/* Header */}
      <div className="mb-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black dark:text-white flex items-center gap-2">
              <span>Mental Health AI Doctor &amp; Companion</span>
            </h2>
            <p className="text-xs sm:text-sm text-black dark:text-white mt-1">
              Compassionate, non-repetitive clinical guidance and human-friendly listening. Speaks English, Tamil, and Tanglish.
            </p>
          </div>

          {/* Voice Gender Selection Controls */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-white/10 border border-black/15 dark:border-white/15">
            <span className="text-xs font-bold px-2 text-black dark:text-white">
              Voice:
            </span>
            <button
              id="voiceFemaleBtn"
              type="button"
              onClick={() => {
                setVoiceGender('female');
                onShowToast('Female Voice selected 👩');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                voiceGender === 'female'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              👩 Female Voice
            </button>
            <button
              id="voiceMaleBtn"
              type="button"
              onClick={() => {
                setVoiceGender('male');
                onShowToast('Male Voice selected 👨');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                voiceGender === 'male'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              👨 Male Voice
            </button>
            <button
              id="testVoiceBtn"
              type="button"
              onClick={handleTestVoice}
              title="Test Voice Sample"
              className="p-1.5 rounded-xl bg-black/10 dark:bg-white/15 text-black dark:text-white hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Feature Toggles & Speech Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs sm:text-sm text-black dark:text-white">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="autoSpeakToggle"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="rounded accent-black dark:accent-white w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-black dark:text-white" />
                Auto-speak AI responses ({voiceGender === 'female' ? 'Female' : 'Male'} Voice)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="groundingToggle"
                checked={enableSearch}
                onChange={(e) => setEnableSearch(e.target.checked)}
                className="rounded accent-black dark:accent-white w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-medium">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                Google Search Grounding
              </span>
            </label>
          </div>

          {speakingId && (
            <button
              id="stopSpeakingQuickBtn"
              type="button"
              onClick={stopSpeaking}
              className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md animate-pulse cursor-pointer ml-auto"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Speaking ⏹️</span>
            </button>
          )}
        </div>
      </div>

      {apiError && (
        <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-black dark:text-white text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 rounded-2xl sm:rounded-3xl border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/15 flex flex-col h-[560px] overflow-hidden text-black dark:text-white">
        {/* Active Speaking Sticky Banner */}
        {speakingId && (
          <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold border-b border-red-700 shadow-md animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 animate-bounce shrink-0" />
              <span>AI Voice is speaking... You can stop anytime</span>
            </div>
            <button
              id="stopSpeakingHeaderBtn"
              type="button"
              onClick={stopSpeaking}
              className="px-3.5 py-1 rounded-full bg-white text-red-700 hover:bg-red-50 font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>STOP ⏹️</span>
            </button>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed shadow-sm ${
                    isAI
                      ? 'bg-white/90 dark:bg-white/10 text-black dark:text-white rounded-bl-sm border border-black/10 dark:border-white/15'
                      : 'bg-black text-white dark:bg-white dark:text-black rounded-br-sm font-medium'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* AI Message Action Bar */}
                  {isAI && (
                    <div className="flex items-center justify-between gap-3 mt-2.5 pt-2 border-t border-black/10 dark:border-white/15 text-xs text-black dark:text-white">
                      <span className="text-[11px] opacity-75">{msg.timestamp}</span>

                      <button
                        id={`speak-btn-${msg.id}`}
                        onClick={() => {
                          if (speakingId === msg.id) {
                            stopSpeaking();
                          } else {
                            toggleSpeech(msg.id, msg.text);
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          speakingId === msg.id
                            ? 'bg-red-600 text-white shadow-md animate-pulse hover:bg-red-700'
                            : 'bg-black/10 dark:bg-white/20 text-black dark:text-white hover:opacity-80'
                        }`}
                        title={speakingId === msg.id ? 'Click to Stop Speaking' : 'Listen to voice'}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>STOP VOICE ⏹️</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-black dark:text-white" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <span className="text-[11px] text-black dark:text-white opacity-60 mt-1 px-1">{msg.timestamp}</span>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start">
              <div className="bg-white/90 dark:bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 border border-black/10 dark:border-white/15 flex items-center gap-2 text-sm text-black dark:text-white">
                <Sparkles className="w-4 h-4 text-black dark:text-white animate-spin" />
                <span>Gemini is thinking with care... 🌸</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-black/5 dark:bg-white/5 border-t border-black/10 dark:border-white/10 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-black dark:text-white font-bold shrink-0">Suggestions:</span>
          <button
            type="button"
            onClick={() => handleSendMessage('I lost my dog and my heart is completely broken...')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 whitespace-nowrap cursor-pointer"
          >
            🐾 I lost my dog...
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('I am having high exam and work anxiety')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 whitespace-nowrap cursor-pointer"
          >
            😰 Exam &amp; work anxiety
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Tell me a wholesome joke to cheer me up')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 whitespace-nowrap cursor-pointer"
          >
            😄 Tell me a joke
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Romba tired ah irukku, un kooda pesa mudiyuma?')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 whitespace-nowrap cursor-pointer"
          >
            🌸 Tanglish chat
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white/60 dark:bg-sky-950/60 border-t border-black/10 dark:border-white/10">
          <div className="flex items-end gap-2">
            <textarea
              id="chatInput"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your feelings, grief, thoughts, or ask doctor advice (English, Tamil, Tanglish)..."
              className="flex-1 resize-none px-4 py-2.5 text-sm sm:text-base rounded-2xl bg-white dark:bg-[#091e36] border border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
            />

            {/* Voice Input Button */}
            <button
              id="micBtn"
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Click to speak'}
              className={`p-3 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-mic-pulse'
                  : 'bg-black/10 dark:bg-white/15 text-black dark:text-white hover:opacity-80'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              id="sendBtn"
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              title="Send message"
              className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 font-bold transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
