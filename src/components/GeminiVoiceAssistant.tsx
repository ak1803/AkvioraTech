import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Square,
  Sparkles,
  Radio,
  Send,
  MessageSquare,
  Copy,
  Check,
  Headphones,
  Sliders,
  ChevronDown,
  Info,
  Globe,
} from 'lucide-react';
import { AssistantPersonaId } from '../types/akviora';
import { AI_ASSISTANTS } from '../data/akvioraData';

interface VoiceTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioUrl?: string | null;
  personaTitle?: string;
  voiceName?: string;
  language?: string;
}

export type GeminiVoiceName = 'Zephyr' | 'Kore' | 'Puck' | 'Fenrir';

export interface VoiceLanguage {
  id: string; // Speech recognition BCP-47 code
  label: string;
  name: string; // Sent to Gemini
  flag: string;
  nativeLabel: string;
  placeholder: string;
  listeningText: string;
  prompts: string[];
}

export const VOICE_LANGUAGES: VoiceLanguage[] = [
  {
    id: 'en-US',
    label: 'English (US)',
    name: 'English',
    flag: '🇺🇸',
    nativeLabel: 'English',
    placeholder: 'Or type a question to hear Gemini Voice reply...',
    listeningText: 'Listening to your question in English...',
    prompts: [
      'How does Akviora build and deploy custom AI agents?',
      'What tech stack do you recommend for a high-traffic B2B SaaS?',
      'How can AI automate repetitive WhatsApp & email inquiries?',
      'Explain your 8-step digital product delivery process.',
    ],
  },
  {
    id: 'es-ES',
    label: 'Spanish (Español)',
    name: 'Spanish',
    flag: '🇪🇸',
    nativeLabel: 'Español',
    placeholder: 'O escribe una pregunta para escuchar la respuesta de voz...',
    listeningText: 'Escuchando tu pregunta en español...',
    prompts: [
      '¿Cómo construye y despliega Akviora agentes de IA personalizados?',
      '¿Qué arquitectura técnica recomiendas para un SaaS empresarial?',
      '¿Cómo puede la IA automatizar consultas repetitivas en WhatsApp?',
      'Explica el proceso de entrega de software en 8 pasos.',
    ],
  },
  {
    id: 'hi-IN',
    label: 'Hindi (हिन्दी)',
    name: 'Hindi',
    flag: '🇮🇳',
    nativeLabel: 'हिन्दी',
    placeholder: 'या जेमिनी वॉइस से उत्तर सुनने के लिए प्रश्न टाइप करें...',
    listeningText: 'हिन्दी में आपका प्रश्न सुना जा रहा है...',
    prompts: [
      'अक्वियोरा हमारे व्यवसाय के लिए कस्टम AI एजेंट कैसे बनाता है?',
      'हाई-ट्रैफ़िक B2B SaaS के लिए कौन सा टेक स्टैक सबसे उपयुक्त है?',
      'व्हाट्सएप और ईमेल पूछताछ को AI कैसे स्वचालित कर सकता है?',
      'अपनी 8-चरणीय डिजिटल उत्पाद वितरण प्रक्रिया समझाइए।',
    ],
  },
  {
    id: 'fr-FR',
    label: 'French (Français)',
    name: 'French',
    flag: '🇫🇷',
    nativeLabel: 'Français',
    placeholder: 'Ou écrivez une question pour écouter la réponse vocale...',
    listeningText: 'Écoute de votre question en français...',
    prompts: [
      'Comment Akviora conçoit et déploie des agents IA sur mesure ?',
      'Quelle pile technologique recommandez-vous pour un SaaS B2B ?',
      'Comment l\'IA peut-elle automatiser les requêtes WhatsApp ?',
      'Expliquez votre processus de livraison en 8 étapes.',
    ],
  },
  {
    id: 'de-DE',
    label: 'German (Deutsch)',
    name: 'German',
    flag: '🇩🇪',
    nativeLabel: 'Deutsch',
    placeholder: 'Oder Frage eingeben, um Sprachantwort zu hören...',
    listeningText: 'Höre Ihre Frage auf Deutsch an...',
    prompts: [
      'Wie entwickelt Akviora maßgeschneiderte KI-Agenten?',
      'Welchen Tech-Stack empfehlen Sie für ein B2B-SaaS?',
      'Wie automatisiert KI wiederkehrende WhatsApp-Anfragen?',
      'Erklären Sie den 8-stufigen Akviora-Lieferprozess.',
    ],
  },
  {
    id: 'ja-JP',
    label: 'Japanese (日本語)',
    name: 'Japanese',
    flag: '🇯🇵',
    nativeLabel: '日本語',
    placeholder: 'または質問を入力して音声応答を聴く...',
    listeningText: '日本語で質問を聞き取っています...',
    prompts: [
      'AkvioraはどのようにカスタムAIエージェントを構築しますか？',
      '高トラフィックSaaSに最適な技術スタックは何ですか？',
      'AIでWhatsAppや問い合わせ業務を自動化する方法は？',
      '8ステップのプロダクト納品プロセスを教えてください。',
    ],
  },
  {
    id: 'ar-SA',
    label: 'Arabic (العربية)',
    name: 'Arabic',
    flag: '🇸🇦',
    nativeLabel: 'العربية',
    placeholder: 'أو اكتب سؤالاً للاستماع إلى الرد الصوتي بالذكاء الاصطناعي...',
    listeningText: 'جاري الاستماع إلى سؤالك باللغة العربية...',
    prompts: [
      'كيف تقوم ألكفيورا بتطوير وكلاء الذكاء الاصطناعي المخصصين؟',
      'ما هي أفضل تقنيات لتطوير منصة SaaS قابلة للتوسع؟',
      'كيف يمكن أتمتة استفسارات واتساب والبريد الإلكتروني بالذكاء الاصطناعي؟',
      'اشرح خطوات تسليم المنتجات الرقمية المكونة من 8 مراحل.',
    ],
  },
  {
    id: 'pt-BR',
    label: 'Portuguese (Brasil)',
    name: 'Portuguese',
    flag: '🇧🇷',
    nativeLabel: 'Português',
    placeholder: 'Ou digite uma pergunta para ouvir a resposta de voz...',
    listeningText: 'Ouvindo sua pergunta em português...',
    prompts: [
      'Como a Akviora desenvolve e implementa agentes de IA personalizados?',
      'Qual stack tecnológico você recomenda para um SaaS de alto tráfego?',
      'Como a IA pode automatizar atendimentos repetitivos no WhatsApp?',
      'Explique o processo de entrega de produtos digitais em 8 etapas.',
    ],
  },
];

const GEMINI_VOICES: {
  id: GeminiVoiceName;
  label: string;
  tone: string;
  description: string;
}[] = [
  {
    id: 'Zephyr',
    label: 'Zephyr',
    tone: 'Warm & Articulate',
    description: 'Natural conversational tone with balanced energy, ideal for strategic consulting.',
  },
  {
    id: 'Kore',
    label: 'Kore',
    tone: 'Calm & Strategic',
    description: 'Clear, reassuring executive presence, optimized for system architectures.',
  },
  {
    id: 'Puck',
    label: 'Puck',
    tone: 'Energetic & Dynamic',
    description: 'Vibrant, fast-paced tech advocate, perfect for sprint planning and SaaS demos.',
  },
  {
    id: 'Fenrir',
    label: 'Fenrir',
    tone: 'Deep & Authoritative',
    description: 'Commanding and grounded, suited for operational risk & enterprise governance.',
  },
];

interface GeminiVoiceAssistantProps {
  initialPersonaId?: AssistantPersonaId;
  onExploreServices?: () => void;
  className?: string;
}

export const GeminiVoiceAssistant: React.FC<GeminiVoiceAssistantProps> = ({
  initialPersonaId = 'customer',
  onExploreServices,
  className = '',
}) => {
  // Assistant states
  const [mode, setMode] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [selectedPersonaId, setSelectedPersonaId] = useState<AssistantPersonaId>(initialPersonaId);
  const [selectedVoice, setSelectedVoice] = useState<GeminiVoiceName>('Zephyr');
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>(VOICE_LANGUAGES[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [autoListen, setAutoListen] = useState(false); // Hands-free continuous conversation
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Audio & speech analysis
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(6));
  const [turns, setTurns] = useState<VoiceTurn[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: "Greetings. I'm the Akviora Gemini Voice Assistant. Tap the microphone or select a prompt below to speak with me in real time.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personaTitle: 'Customer Assistant',
      voiceName: 'Zephyr',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const isComponentMounted = useRef(true);

  const currentObjectUrlRef = useRef<string | null>(null);
  const responseSectionRef = useRef<HTMLDivElement | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const activePersona =
    AI_ASSISTANTS.find((a) => a.id === selectedPersonaId) || AI_ASSISTANTS[0];

  useEffect(() => {
    isComponentMounted.current = true;

    // Load and cache browser speech synthesis voices (crucial for Chrome/Edge async voice loading)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) {
            setAvailableVoices(v);
          }
        } catch {
          // ignore
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      isComponentMounted.current = false;
      stopAudioAnalysis();
      stopSpeechRecognition();
      stopAudioPlayback();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Cleanup helper
  const stopAudioAnalysis = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
  };

  const stopAudioPlayback = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current.src = '';
      currentAudioElementRef.current = null;
    }
    if (currentObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      } catch {
        // ignore
      }
      currentObjectUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Start real-time audio visualizer using Web Audio API
  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevels = () => {
        if (!analyserRef.current || !isComponentMounted.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Map to 20 visual bars
        const step = Math.floor(bufferLength / 20) || 1;
        const newBars: number[] = [];
        for (let i = 0; i < 20; i++) {
          const val = dataArray[i * step] || 0;
          // Scale between 4px and 48px
          const height = Math.max(4, Math.min(48, Math.round((val / 255) * 44 + 4)));
          newBars.push(height);
        }
        setAudioLevels(newBars);
        animFrameRef.current = requestAnimationFrame(updateLevels);
      };

      updateLevels();
    } catch (err) {
      console.warn('Microphone stream access not granted for visualizer:', err);
    }
  };

  // Browser Speech Synthesis Fallback
  const speakWithBrowserSynthesis = (
    text: string,
    onDone: () => void,
    phoneticText?: string
  ) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted) {
      onDone();
      return;
    }

    window.speechSynthesis.cancel();

    // Use cached voices or query live
    const voices =
      availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const langCode = selectedLanguage.id.toLowerCase();
    const isHindi = langCode.startsWith('hi') || selectedLanguage.name.toLowerCase() === 'hindi';

    let matchingVoice: SpeechSynthesisVoice | undefined;

    if (isHindi) {
      // Find native Hindi voices across Chrome, Windows, macOS, Android
      matchingVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.includes('हिन्दी') ||
            v.name.toLowerCase().includes('kalpana') ||
            v.name.toLowerCase().includes('hemant') ||
            v.name.toLowerCase().includes('swara') ||
            v.name.toLowerCase().includes('madhur') ||
            v.name.toLowerCase().includes('lekha')
        ) || voices.find((v) => v.lang.toLowerCase() === 'en-in');
    } else {
      matchingVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase() === langCode &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Neural') ||
              v.name.includes('Premium'))
        ) ||
        voices.find((v) => v.lang.toLowerCase() === langCode) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(selectedLanguage.id.slice(0, 2).toLowerCase()));
    }

    // If Hindi and no native Hindi voice is installed in the local OS:
    // Speak phonetic transliteration so the user actually hears speech instead of browser silence!
    let textToSpeak = text;
    let targetLang = selectedLanguage.id;

    if (isHindi && !matchingVoice) {
      if (phoneticText) {
        textToSpeak = phoneticText;
      }
      targetLang = 'en-IN';
      matchingVoice = voices.find((v) => v.lang.toLowerCase() === 'en-in') || voices[0];
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = isHindi ? 0.96 : 1.04;
    utterance.pitch = selectedVoice === 'Fenrir' ? 0.85 : selectedVoice === 'Puck' ? 1.15 : 1.0;
    utterance.lang = targetLang;

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      onDone();
    };
    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      onDone();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play assistant voice reply
  const playAssistantAudio = (
    text: string,
    audioBase64: string | null,
    onFinish: () => void,
    phoneticText?: string
  ) => {
    if (isMuted) {
      onFinish();
      return;
    }

    // Try Gemini TTS Audio first with Blob ObjectURL
    if (audioBase64) {
      try {
        const binaryString = window.atob(audioBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        currentObjectUrlRef.current = audioUrl;

        const audio = new Audio(audioUrl);
        currentAudioElementRef.current = audio;

        const cleanupAndFinish = () => {
          if (currentObjectUrlRef.current) {
            try {
              URL.revokeObjectURL(currentObjectUrlRef.current);
            } catch {
              // ignore
            }
            currentObjectUrlRef.current = null;
          }
          currentAudioElementRef.current = null;
          onFinish();
        };

        audio.onended = cleanupAndFinish;

        audio.onerror = (e) => {
          console.warn('Gemini audio playback error, falling back to speech synthesis:', e);
          cleanupAndFinish();
          speakWithBrowserSynthesis(text, onFinish, phoneticText);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio auto-play prevented or failed, using browser synthesis:', err);
            cleanupAndFinish();
            speakWithBrowserSynthesis(text, onFinish, phoneticText);
          });
        }
        return;
      } catch (err) {
        console.warn('Failed to initialize Audio from blob, fallback to browser synthesis:', err);
      }
    }

    // Fallback: Browser Web Speech Synthesis
    speakWithBrowserSynthesis(text, onFinish, phoneticText);
  };

  // Send query to Akviora Gemini Voice API
  const handleSendVoiceQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    stopAudioPlayback();
    stopAudioAnalysis();
    setAudioError(null);
    setMode('thinking');
    setTranscript(trimmed);
    setInterimTranscript('');

    const userTurn: VoiceTurn = {
      id: `turn-u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTurns((prev) => [...prev, userTurn]);

    try {
      const historyContext = turns.slice(-4).map((t) => ({
        role: t.role,
        content: t.text,
      }));

      const res = await fetch('/api/ai/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          personaId: selectedPersonaId,
          voiceName: selectedVoice,
          language: selectedLanguage.name,
          history: historyContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Voice server response ${res.status}`);
      }

      const data = await res.json();
      const isHindi =
        selectedLanguage.id === 'hi-IN' || selectedLanguage.name.toLowerCase() === 'hindi';
      const defaultHindiReply =
        'नमस्ते! अक्वियोरा आपके बिज़नेस के लिए कस्टम एआई एजेंट्स, वर्कफ़्लो ऑटोमेशन और आधुनिक वेब सॉफ़्टवेयर तैयार करता है। क्या आप किसी खास काम को ऑटोमेट करना चाहते हैं?';
      const defaultEnglishReply =
        `I have analyzed your request regarding ${trimmed}. Akviora builds tailored AI solutions and custom automation systems to eliminate this operational bottleneck.`;

      const replyText = data.reply || (isHindi ? defaultHindiReply : defaultEnglishReply);

      const assistantTurn: VoiceTurn = {
        id: `turn-a-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioUrl: data.audioData ? `data:audio/wav;base64,${data.audioData}` : null,
        personaTitle: data.personaTitle || activePersona.title,
        voiceName: data.voiceName || selectedVoice,
        language: selectedLanguage.name,
      };

      setTurns((prev) => [...prev, assistantTurn]);
      setMode('speaking');

      // Play audio response with phonetic fallback
      playAssistantAudio(
        replyText,
        data.audioData,
        () => {
          if (!isComponentMounted.current) return;
          setMode('idle');
          // If continuous auto-listen is enabled, automatically listen again!
          if (autoListen) {
            setTimeout(() => {
              if (isComponentMounted.current) {
                startListening();
              }
            }, 450);
          }
        },
        data.phoneticReply
      );
    } catch (err: any) {
      console.error('Voice assistant error:', err);
      const isHindi =
        selectedLanguage.id === 'hi-IN' || selectedLanguage.name.toLowerCase() === 'hindi';

      const fallbackReply = isHindi
        ? 'अक्वियोरा आपके बिज़नेस के लिए कस्टम एआई एजेंट्स, वर्कफ़्लो ऑटोमेशन और आधुनिक वेब सॉफ़्टवेयर तैयार करता है। यह आपके सीआरएम और व्हाट्सएप के साथ पूरी तरह जुड़ जाता है।'
        : `Akviora designs high-performance AI assistants and custom digital platforms. Our systems connect seamlessly with your CRM, databases, and customer workflows.`;

      const fallbackPhonetic = isHindi
        ? 'Akviora aapke business ke liye custom AI agents, workflow automation aur modern web software banate hain. Yeh aapke CRM aur WhatsApp ke saath jud jata hai.'
        : undefined;

      const fallbackTurn: VoiceTurn = {
        id: `turn-err-${Date.now()}`,
        role: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaTitle: activePersona.title,
        voiceName: selectedVoice,
        language: selectedLanguage.name,
      };

      setTurns((prev) => [...prev, fallbackTurn]);
      setMode('speaking');

      playAssistantAudio(
        fallbackReply,
        null,
        () => {
          if (isComponentMounted.current) {
            setMode('idle');
          }
        },
        fallbackPhonetic
      );
    }
  };

  // Start speech recognition
  const startListening = () => {
    stopAudioPlayback();
    setAudioError(null);

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setAudioError(
        selectedLanguage.id === 'hi-IN'
          ? 'इस ब्राउज़र में स्पीच रिकॉग्निशन उपलब्ध नहीं है। आप नीचे दिए गए बॉक्स में प्रश्न टाइप कर सकते हैं।'
          : 'Speech recognition is not supported in this browser. You can type your voice query in the box below.'
      );
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage.id;

      recognition.onstart = () => {
        setMode('listening');
        setInterimTranscript('');
        startAudioAnalysis();
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }
        if (final) {
          setTranscript(final);
          stopSpeechRecognition();
          stopAudioAnalysis();
          handleSendVoiceQuery(final);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        stopAudioAnalysis();
        const isHindi = selectedLanguage.id === 'hi-IN';

        if (event.error === 'not-allowed') {
          setAudioError(
            isHindi
              ? 'माइक्रोफ़ोन अनुमति अस्वीकृत हो गई। कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति दें।'
              : 'Microphone access was denied. Please allow microphone permissions.'
          );
        } else if (event.error === 'network') {
          setAudioError(
            isHindi
              ? 'ब्राउज़र में हिन्दी वॉइस रिकॉग्निशन नेटवर्क सीमा आई है। आप नीचे दिए गए त्वरित प्रश्नों (Suggested Prompts) पर टैप कर सकते हैं या लिखकर प्रश्न पूछ सकते हैं।'
              : 'Voice recognition network error. You can tap suggested inquiries below or type your question.'
          );
        } else if (event.error === 'language-not-supported') {
          setAudioError(
            isHindi
              ? 'इस ब्राउज़र में हिन्दी वॉइस इनपुट समर्थित नहीं है। आप नीचे दिए गए हिन्दी प्रश्नों पर टैप करें या लिखकर बात करें।'
              : `Language ${selectedLanguage.label} is not supported by this browser's speech engine. Try typing below.`
          );
        } else if (event.error !== 'no-speech') {
          setAudioError(`Voice input: ${event.error}`);
        }
        setMode('idle');
      };

      recognition.onend = () => {
        stopAudioAnalysis();
        if (mode === 'listening') {
          setMode('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setAudioError(
        selectedLanguage.id === 'hi-IN'
          ? 'माइक से कनेक्ट करने में विफल। कृपया नीचे दिए गए प्रश्नों पर टैप करें या टाइप करें।'
          : 'Failed to access microphone. Please try typing below.'
      );
      setMode('idle');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    stopAudioAnalysis();
  };

  // Interrupt assistant
  const handleInterrupt = () => {
    stopAudioPlayback();
    stopSpeechRecognition();
    setMode('idle');
  };

  const handleMicToggle = () => {
    if (mode === 'listening') {
      stopSpeechRecognition();
      setMode('idle');
    } else if (mode === 'speaking') {
      handleInterrupt();
    } else {
      startListening();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = textInput.trim();
    if (query) {
      setShowHistory(true);
      handleSendVoiceQuery(query);
      setTextInput('');
      setTimeout(() => {
        responseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  const handleCopyTurn = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReplayTurn = (turn: VoiceTurn) => {
    stopAudioPlayback();
    setMode('speaking');
    playAssistantAudio(turn.text, turn.audioUrl ? turn.audioUrl.replace('data:audio/wav;base64,', '') : null, () => {
      if (isComponentMounted.current) {
        setMode('idle');
      }
    });
  };

  const latestAssistantReply = [...turns].reverse().find((t) => t.role === 'assistant');

  return (
    <div
      className={`relative rounded-[20px] sm:rounded-[28px] lg:rounded-[32px] border border-[#5CE1E6]/30 bg-gradient-to-b from-[#091528] via-[#060B14] to-[#040810] p-3.5 xs:p-5 sm:p-7 lg:p-10 shadow-[0_24px_80px_rgba(6,11,20,0.9),0_0_60px_rgba(92,225,230,0.12)] overflow-hidden ${className}`}
    >
      {/* Background ambient aurora glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-full h-[340px] bg-gradient-to-br from-[#5CE1E6]/18 via-[#7A86FF]/15 to-transparent blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 right-0 w-[420px] max-w-full h-[260px] bg-[#5CE1E6]/08 blur-[80px] pointer-events-none rounded-full" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#5CE1E6]/25 to-[#7A86FF]/25 border border-[#5CE1E6]/40 text-[#5CE1E6] shrink-0">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#5CE1E6] ring-2 ring-[#060B14]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-mono text-[#5CE1E6] uppercase tracking-wider font-semibold truncate">
                Gemini Live Voice Engine
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#5CE1E6]/15 text-[#5CE1E6] border border-[#5CE1E6]/30 font-mono hidden xs:inline-block">
                Audio 24kHz · Low Latency
              </span>
            </div>
            <h3 className="font-display text-base xs:text-lg sm:text-2xl text-[#EAF4F8] font-bold truncate leading-tight mt-0.5">
              Akviora Interactive Voice Assistant
            </h3>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-start sm:justify-end w-full md:w-auto">
          {/* Language selector button */}
          <button
            type="button"
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-[#b8cdd8] hover:text-[#EAF4F8] transition-colors cursor-pointer shrink-0 max-w-full"
            title="Change conversation language"
          >
            <Globe className="w-3.5 h-3.5 text-[#5CE1E6] shrink-0" />
            <span className="truncate">{selectedLanguage.flag} {selectedLanguage.nativeLabel}</span>
            <ChevronDown className="w-3 h-3 text-[#8EA6B4] shrink-0" />
          </button>

          {/* Persona selector button */}
          <button
            type="button"
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-[#b8cdd8] hover:text-[#EAF4F8] transition-colors cursor-pointer shrink-0"
            title="Change voice profile or persona role"
          >
            <Sliders className="w-3.5 h-3.5 text-[#5CE1E6] shrink-0" />
            <span className="hidden xs:inline">Voice:</span> <span className="font-medium">{selectedVoice}</span>
            <ChevronDown className="w-3 h-3 text-[#8EA6B4] shrink-0" />
          </button>

          {/* Hands-Free Mode Toggle */}
          <button
            type="button"
            onClick={() => setAutoListen(!autoListen)}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer shrink-0 ${
              autoListen
                ? 'bg-[#5CE1E6]/20 border-[#5CE1E6]/60 text-[#5CE1E6]'
                : 'bg-white/[0.04] border-white/10 text-[#8EA6B4] hover:text-[#EAF4F8]'
            }`}
            title="Auto-listen allows hands-free back-and-forth dialogue"
          >
            <Headphones className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Hands-Free</span>
            <span className="text-[10px] uppercase font-bold">{autoListen ? 'ON' : 'OFF'}</span>
          </button>

          {/* Mute/Unmute */}
          <button
            type="button"
            onClick={() => {
              if (!isMuted && mode === 'speaking') {
                handleInterrupt();
              }
              setIsMuted(!isMuted);
            }}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isMuted
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-white/[0.04] border-white/10 text-[#8EA6B4] hover:text-[#EAF4F8]'
            }`}
            title={isMuted ? 'Unmute speech output' : 'Mute speech output'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Transcript History Toggle */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              showHistory
                ? 'bg-[#5CE1E6]/20 border-[#5CE1E6]/50 text-[#5CE1E6]'
                : 'bg-white/[0.04] border-white/10 text-[#8EA6B4] hover:text-[#EAF4F8]'
            }`}
            title="Show dialogue transcript"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice & Language Settings Popover */}
      <AnimatePresence>
        {showVoiceSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-20 border-b border-white/10 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs"
          >
            <div>
              <span className="font-mono text-[#8EA6B4] block mb-2 font-medium">
                1. SELECT GEMINI TTS VOICE
              </span>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-2.5">
                {GEMINI_VOICES.map((v) => {
                  const isSelected = selectedVoice === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVoice(v.id)}
                      className={`group relative p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#5CE1E6]/15 border-[#5CE1E6] text-[#EAF4F8] ring-1 ring-[#5CE1E6]/50 shadow-[0_0_20px_rgba(92,225,230,0.18)]'
                          : 'bg-white/[0.03] border-white/10 text-[#8EA6B4] hover:bg-white/[0.06] hover:border-white/25 hover:text-[#EAF4F8]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full">
                        <span
                          className={`font-semibold text-xs sm:text-sm truncate ${
                            isSelected
                              ? 'text-[#EAF4F8]'
                              : 'text-[#d0e0ea] group-hover:text-white'
                          }`}
                        >
                          {v.label}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6] shrink-0 shadow-[0_0_6px_#5CE1E6]" />
                        )}
                      </div>
                      <div
                        className={`text-[11px] sm:text-xs mt-1 truncate ${
                          isSelected
                            ? 'text-[#5CE1E6] font-medium'
                            : 'text-[#8EA6B4] group-hover:text-[#b0c8d6]'
                        }`}
                      >
                        {v.tone}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="font-mono text-[#8EA6B4] block mb-2 font-medium">
                2. ASSISTANT SPECIALIZATION ROLE
              </span>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-2.5">
                {AI_ASSISTANTS.slice(0, 4).map((a) => {
                  const isSelected = selectedPersonaId === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelectedPersonaId(a.id)}
                      className={`group relative p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#5CE1E6]/15 border-[#5CE1E6] text-[#EAF4F8] ring-1 ring-[#5CE1E6]/50 shadow-[0_0_20px_rgba(92,225,230,0.18)]'
                          : 'bg-white/[0.03] border-white/10 text-[#8EA6B4] hover:bg-white/[0.06] hover:border-white/25 hover:text-[#EAF4F8]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full">
                        <span
                          className={`font-semibold text-xs sm:text-sm truncate ${
                            isSelected
                              ? 'text-[#EAF4F8]'
                              : 'text-[#d0e0ea] group-hover:text-white'
                          }`}
                        >
                          {a.title}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6] shrink-0 shadow-[0_0_6px_#5CE1E6]" />
                        )}
                      </div>
                      <div
                        className={`text-[11px] sm:text-xs mt-1 truncate ${
                          isSelected
                            ? 'text-[#5CE1E6] font-medium'
                            : 'text-[#8EA6B4] group-hover:text-[#b0c8d6]'
                        }`}
                      >
                        {a.shortDesc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Conversation Language Options */}
            <div className="sm:col-span-2 pt-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                <span className="font-mono text-[#8EA6B4] font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#5CE1E6]" />
                  <span>3. SELECT CONVERSATION LANGUAGE</span>
                </span>
                <span className="text-[11px] font-mono text-[#5CE1E6]">
                  Active: {selectedLanguage.flag} {selectedLanguage.label}
                </span>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
                {VOICE_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage.id === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`group relative p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-w-0 ${
                        isSelected
                          ? 'bg-[#5CE1E6]/15 border-[#5CE1E6] text-[#EAF4F8] ring-1 ring-[#5CE1E6]/50 shadow-[0_0_20px_rgba(92,225,230,0.18)]'
                          : 'bg-white/[0.03] border-white/10 text-[#8EA6B4] hover:bg-white/[0.06] hover:border-white/25 hover:text-[#EAF4F8]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full min-w-0">
                        <span
                          className={`font-semibold text-xs sm:text-sm truncate ${
                            isSelected
                              ? 'text-[#EAF4F8]'
                              : 'text-[#d0e0ea] group-hover:text-white'
                          }`}
                        >
                          {lang.flag} {lang.nativeLabel}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6] shrink-0 shadow-[0_0_6px_#5CE1E6]" />
                        )}
                      </div>
                      <div
                        className={`text-[10px] sm:text-xs mt-1 truncate ${
                          isSelected
                            ? 'text-[#5CE1E6] font-medium'
                            : 'text-[#8EA6B4] group-hover:text-[#b0c8d6]'
                        }`}
                      >
                        {lang.label} ({lang.id})
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Stage: Gemini Orb & Soundwave */}
      <div className="relative z-10 py-6 sm:py-10 flex flex-col items-center justify-center text-center">
        {/* Dynamic Holographic Gemini Orb Container */}
        <div className="relative flex items-center justify-center w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 mb-4 sm:mb-6">
          {/* Animated concentric rings that react to mode */}
          <motion.div
            animate={{
              scale:
                mode === 'listening'
                  ? [1, 1.25, 1.05, 1.22]
                  : mode === 'speaking'
                  ? [1, 1.14, 1.02, 1.16]
                  : [1, 1.04, 1],
              opacity: mode === 'idle' ? 0.35 : 0.8,
            }}
            transition={{
              duration: mode === 'listening' ? 1.4 : mode === 'speaking' ? 1.8 : 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full border border-[#5CE1E6]/30 bg-gradient-to-tr from-[#5CE1E6]/10 to-[#7A86FF]/10 pointer-events-none"
          />

          <motion.div
            animate={{
              scale:
                mode === 'listening'
                  ? [1.08, 1.4, 1.18]
                  : mode === 'speaking'
                  ? [1.05, 1.25, 1.08]
                  : [1.02, 1.08, 1.02],
              rotate: mode === 'thinking' ? 360 : 0,
            }}
            transition={{
              duration: mode === 'thinking' ? 2.5 : 2.2,
              repeat: Infinity,
              ease: mode === 'thinking' ? 'linear' : 'easeInOut',
            }}
            className="absolute inset-2 rounded-full border border-dashed border-[#7A86FF]/40 pointer-events-none"
          />

          {/* Central Glowing Core Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleMicToggle}
            className={`relative z-10 w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 shadow-2xl ${
              mode === 'listening'
                ? 'bg-gradient-to-br from-[#5CE1E6] via-[#38bdf8] to-[#0284c7] text-[#06101a] shadow-[0_0_50px_rgba(92,225,230,0.8)] ring-4 ring-[#5CE1E6]/40'
                : mode === 'thinking'
                ? 'bg-gradient-to-br from-[#7A86FF] via-[#6366f1] to-[#4338ca] text-white shadow-[0_0_50px_rgba(122,134,255,0.8)] ring-4 ring-[#7A86FF]/40'
                : mode === 'speaking'
                ? 'bg-gradient-to-br from-[#10b981] via-[#06b6d4] to-[#3b82f6] text-white shadow-[0_0_50px_rgba(16,185,129,0.7)] ring-4 ring-[#10b981]/40'
                : 'bg-gradient-to-br from-[#0e1f3d] via-[#132649] to-[#0a1526] hover:from-[#13284f] hover:to-[#172f5d] text-[#5CE1E6] border-2 border-[#5CE1E6]/50 shadow-[0_0_35px_rgba(92,225,230,0.35)]'
            }`}
          >
            {mode === 'listening' ? (
              <>
                <Mic className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold mt-1 tracking-wider uppercase">
                  Listening
                </span>
              </>
            ) : mode === 'thinking' ? (
              <>
                <Sparkles className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 animate-spin" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold mt-1 tracking-wider uppercase">
                  Thinking
                </span>
              </>
            ) : mode === 'speaking' ? (
              <>
                <Square className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 fill-current" />
                <span className="text-[9px] sm:text-[10px] font-mono font-bold mt-1 tracking-wider uppercase">
                  Tap to Stop
                </span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] sm:text-[11px] font-mono font-medium mt-1 tracking-wider uppercase text-[#EAF4F8]">
                  Tap to Speak
                </span>
              </>
            )}
          </motion.button>
        </div>

        {/* Real-time Responsive Frequency Waveform Bars */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-11 w-full max-w-[240px] xs:max-w-[280px] sm:max-w-sm mb-3 sm:mb-4 px-2">
          {audioLevels.map((height, i) => (
            <motion.div
              key={i}
              animate={{
                height:
                  mode === 'listening'
                    ? `${height}px`
                    : mode === 'speaking'
                    ? `${Math.max(6, Math.sin(i * 0.4 + Date.now() * 0.005) * 28 + 18)}px`
                    : mode === 'thinking'
                    ? `${Math.max(4, Math.sin(i * 0.6) * 16 + 12)}px`
                    : '6px',
                backgroundColor:
                  mode === 'listening'
                    ? '#5CE1E6'
                    : mode === 'speaking'
                    ? '#10b981'
                    : mode === 'thinking'
                    ? '#7A86FF'
                    : 'rgba(255, 255, 255, 0.15)',
              }}
              transition={{ duration: 0.1 }}
              className="w-1 sm:w-1.5 md:w-2 rounded-full shadow-[0_0_8px_currentColor]"
            />
          ))}
        </div>

        {/* Dynamic Status & Interim Transcript Live Banner */}
        <div className="min-h-[48px] max-w-xl mx-auto px-4 flex flex-col items-center justify-center">
          {mode === 'listening' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <div className="text-xs font-mono text-[#5CE1E6] flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5CE1E6] animate-ping" />
                <span>{selectedLanguage.listeningText}</span>
              </div>
              <p className="text-sm sm:text-base text-[#EAF4F8] font-medium italic">
                {interimTranscript ? `“${interimTranscript}”` : `${selectedLanguage.flag} Speak naturally in ${selectedLanguage.nativeLabel}...`}
              </p>
            </motion.div>
          )}

          {mode === 'thinking' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-mono text-[#7A86FF] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Akviora Gemini AI is analyzing query in {selectedLanguage.nativeLabel}...</span>
            </motion.div>
          )}

          {mode === 'speaking' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5"
            >
              <div className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Speaking in {selectedLanguage.flag} {selectedLanguage.nativeLabel} ({selectedVoice} · {activePersona.title})</span>
              </div>
              <button
                type="button"
                onClick={handleInterrupt}
                className="text-xs text-[#8EA6B4] hover:text-white underline cursor-pointer"
              >
                Interrupt / Stop Audio
              </button>
            </motion.div>
          )}

          {mode === 'idle' && (
            <p className="text-xs sm:text-sm text-[#8EA6B4]">
              {selectedLanguage.flag} Language: <span className="text-[#5CE1E6] font-medium">{selectedLanguage.nativeLabel}</span> · Tap the central microphone to speak, choose a prompt below, or type your query.
            </p>
          )}

          {audioError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{audioError}</span>
            </motion.p>
          )}
        </div>

        {/* Latest Response Card Display (when speaking or just completed) */}
        {latestAssistantReply && (
          <motion.div
            key={latestAssistantReply.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left relative group backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono text-[#8EA6B4]">
              <span className="text-[#5CE1E6] font-semibold flex items-center gap-1.5">
                <span>{latestAssistantReply.personaTitle || 'Akviora AI'}</span>
                <span>·</span>
                <span>Voice {latestAssistantReply.voiceName || selectedVoice}</span>
                <span>·</span>
                <span>{selectedLanguage.flag} {latestAssistantReply.language || selectedLanguage.nativeLabel}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReplayTurn(latestAssistantReply)}
                  className="inline-flex items-center gap-1 text-[#8EA6B4] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                  title="Replay Audio"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyTurn(latestAssistantReply.id, latestAssistantReply.text)}
                  className="inline-flex items-center gap-1 text-[#8EA6B4] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                  title="Copy Text"
                >
                  {copiedId === latestAssistantReply.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#EAF4F8] leading-relaxed">
              {latestAssistantReply.text}
            </p>
          </motion.div>
        )}
      </div>

      {/* Quick Voice Prompt Chips in Selected Language */}
      <div className="relative z-10 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono text-[#8EA6B4] uppercase tracking-wider flex items-center gap-1.5">
            <span>Suggested Inquiries</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#5CE1E6]">
              {selectedLanguage.flag} {selectedLanguage.nativeLabel}
            </span>
          </span>
          <span className="text-xs text-[#5CE1E6]">Tap any prompt to speak</span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {selectedLanguage.prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={mode === 'listening' || mode === 'thinking'}
              onClick={() => handleSendVoiceQuery(prompt)}
              className="text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/[0.03] hover:bg-[#5CE1E6]/15 border border-white/10 hover:border-[#5CE1E6]/40 text-[#b8cdd8] hover:text-[#EAF4F8] transition-all cursor-pointer text-left disabled:opacity-50 break-words max-w-full leading-snug"
            >
              “{prompt}”
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input Form & Text Accessibility */}
      <div ref={responseSectionRef} className="relative z-10 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10">
        <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={selectedLanguage.placeholder}
            disabled={mode === 'listening' || mode === 'thinking'}
            className="w-full flex-1 bg-white/[0.03] border border-white/10 focus:border-[#5CE1E6]/60 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#EAF4F8] placeholder-[#8EA6B4]/60 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || mode === 'thinking'}
            className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#5CE1E6] to-[#7A86FF] hover:opacity-90 disabled:opacity-40 text-[#06101a] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            {mode === 'thinking' ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#06101a] border-t-transparent animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Ask Voice AI</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {mode === 'thinking' && (
          <div className="mt-2.5 flex items-center gap-2 text-xs text-[#5CE1E6] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#5CE1E6] animate-ping" />
            <span>Akviora AI is analyzing your question and generating answers...</span>
          </div>
        )}
      </div>

      {/* Expandable Conversation Transcript Log */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#8EA6B4]">
              <span>VOICE DIALOGUE TRANSCRIPT ({turns.length} turns)</span>
              <button
                type="button"
                onClick={() =>
                  setTurns([
                    {
                      id: `reset-${Date.now()}`,
                      role: 'assistant',
                      text: "Session cleared. What would you like to explore next?",
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                className="text-xs text-rose-400 hover:underline cursor-pointer"
              >
                Clear Log
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1.5 sm:pr-2 custom-scrollbar">
              {turns.map((turn) => (
                <div
                  key={turn.id}
                  className={`p-2.5 sm:p-3 rounded-xl text-xs space-y-1 ${
                    turn.role === 'user'
                      ? 'bg-[#5CE1E6]/10 border border-[#5CE1E6]/30 ml-2 xs:ml-4 sm:ml-8 text-[#EAF4F8]'
                      : 'bg-white/[0.03] border border-white/10 mr-2 xs:mr-4 sm:mr-8 text-[#b8cdd8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#8EA6B4]">
                    <span className="font-mono uppercase font-semibold">
                      {turn.role === 'user'
                        ? 'You (Voice In)'
                        : `${turn.personaTitle || 'Akviora AI'}${turn.language ? ` · ${turn.language}` : ''}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{turn.timestamp}</span>
                      {turn.role === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => handleReplayTurn(turn)}
                          className="hover:text-[#5CE1E6] transition-colors cursor-pointer"
                          title="Replay Audio"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="leading-relaxed">{turn.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
