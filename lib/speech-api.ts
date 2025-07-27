// Client-side speech functionality for the EduMate platform
import axios from 'axios';

interface SpeechRequest {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
}

interface SpeechResponse {
  audio: string; // Base64 encoded audio
  phonemes?: Array<{
    phoneme: string;
    startTime: number;
    endTime: number;
  }>;
  success: boolean;
  error?: string;
}

// ElevenLabs Voice Settings
interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

/**
 * Convert text to speech using ElevenLabs API with EduMate voice model
 * @param text Text to convert to speech
 * @returns Promise with audio ArrayBuffer
 */
export async function generateElevenLabsSpeech(text: string): Promise<ArrayBuffer> {
  try {
    // Hard-coding the values here for direct access
    const API_KEY = 'sk_384ebc1eeacab4f9b34f46ef536db76fb17beee805e46195';
    
    // Using the updated voice ID
    const VOICE_ID = '29vD33N1CtxCmqQRPOHJ';
    
    console.log('EduMate: Generating speech for text:', text.substring(0, 50) + '...');
    
    // EduMate voice settings - adjusted for a warm, encouraging teaching style
    const voiceSettings: VoiceSettings = {
      stability: 0.6,       // More stable for clear teaching
      similarity_boost: 0.8, // Higher similarity to maintain EduMate character
    };

    // Format the text to sound more conversational and EduMate-like
    const formattedText = formatTextForEduMate(text);

    console.log('Making API request to ElevenLabs with voice ID:', VOICE_ID);
    
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      data: {
        text: formattedText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: voiceSettings,
      },
      responseType: 'arraybuffer'
    });

    console.log('EduMate: Received response with status:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error generating speech with EduMate voice:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      console.error('Status text:', error.response?.statusText);
      console.error('Error message:', error.message);
      
      // Convert ArrayBuffer to text if present
      if (error.response?.data instanceof ArrayBuffer) {
        try {
          const decoder = new TextDecoder();
          const text = decoder.decode(error.response.data);
          console.error('Error response as text:', text);
        } catch (e) {
          console.error('Could not decode error response:', e);
        }
      }
    }
    throw error;
  }
}

/**
 * Format text to sound more like EduMate voice assistant
 * Adds some conversational elements and teaching style to the text
 */
function formatTextForEduMate(text: string): string {
  // Don't modify the text if it's too short
  if (text.length < 30) return text;
  
  // Don't add intros for very short texts
  if (text.length < 100) {
    return text;
  }
  
  // For longer content, add some EduMate style markers
  // Randomly select an intro phrase for variety
  const introExpressions = [
    "Here's what I've found. ",
    "Let me explain this. ",
    "This is interesting. ",
    "Let's discuss this. ",
    "Here's what you need to know. "
  ];
  
  // Randomly select a conclusion phrase
  const conclusionExpressions = [
    " That should give you a good understanding.",
    " Let me know if you have any questions about this.",
    " What do you think about that?",
    " I hope that helps you understand better.",
    " Let's practice with this concept."
  ];
  
  // Only add these phrases if the text doesn't already have them or similar ones
  const randomIntro = introExpressions[Math.floor(Math.random() * introExpressions.length)];
  const randomConclusion = conclusionExpressions[Math.floor(Math.random() * conclusionExpressions.length)];
  
  // Check if text already has a similar beginning
  const hasIntro = /^(hi|hello|hey|alright|so,|okay|well,|here's|let's|now,)/i.test(text.trim());
  
  // Check if text already has a conclusion
  const hasConclusion = /(questions|understand|thoughts|think|hope that helps|let me know|what do you think)/i.test(
    text.substring(text.length - 50)
  );
  
  // Apply formatting conditionally
  let formattedText = text;
  if (!hasIntro) {
    formattedText = randomIntro + formattedText;
  }
  
  if (!hasConclusion && text.length > 200) {
    formattedText = formattedText + randomConclusion;
  }
  
  return formattedText;
}

/**
 * Play audio from an ArrayBuffer
 * @param audioBuffer The audio buffer to play
 * @returns Promise that resolves when audio ends
 */
export function playAudioBuffer(audioBuffer: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        URL.revokeObjectURL(url);
        reject(e);
      };
      
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.error('Failed to play audio:', error);
          reject(error);
        });
      }
    } catch (error) {
      console.error('Error playing audio buffer:', error);
      reject(error);
    }
  });
}

/**
 * Convert text to speech with optional lip sync data
 * @param params Speech generation parameters
 * @returns Audio data and phoneme timing for lip sync
 */
export async function generateSpeech(params: SpeechRequest): Promise<SpeechResponse> {
  const { text, voice = 'en-US', rate = 1, pitch = 1 } = params;
  
  try {
    // In a production environment, you would call an actual TTS API here
    // such as Azure, Google, or Amazon Polly that supports lip sync or viseme data
    
    // For demonstration purposes, we'll simulate the response
    // In a real implementation, you would replace this with an actual API call
    
    console.log(`Generating speech for: "${text}"`);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate fake phoneme data for lip sync (normally provided by the TTS API)
    const words = text.split(' ');
    const phonemes = [];
    let currentTime = 0;
    
    for (const word of words) {
      // Each word gets approximately 0.3 seconds
      const wordDuration = 0.3;
      const phonemesPerWord = Math.max(1, Math.floor(word.length / 2));
      
      for (let i = 0; i < phonemesPerWord; i++) {
        // Split the word duration among phonemes
        const phonemeDuration = wordDuration / phonemesPerWord;
        
        phonemes.push({
          phoneme: word.charAt(i % word.length),
          startTime: currentTime,
          endTime: currentTime + phonemeDuration
        });
        
        currentTime += phonemeDuration;
      }
      
      // Add a short pause between words
      currentTime += 0.1;
    }
    
    // Return a simulated response
    // In a real implementation, you would get actual audio and phoneme data
    return {
      success: true,
      audio: "data:audio/mp3;base64,SIMULATED_AUDIO_DATA", // This would be real base64 audio
      phonemes
    };
    
  } catch (error) {
    console.error("Error generating speech:", error);
    return {
      success: false,
      audio: "",
      error: "Failed to generate speech"
    };
  }
}

/**
 * Play text as speech using EduMate voice model
 * @param text The text to speak
 * @param onEnd Callback when speech ends
 */
export async function speakText(
  text: string, 
  onEnd?: () => void
): Promise<void> {
  if (typeof window === 'undefined') {
    console.error('Cannot generate speech on server side');
    return;
  }

  console.log('EduMate: Starting speech synthesis for:', text.substring(0, 50) + '...');

  try {
    // Try using ElevenLabs API with EduMate voice
    console.log('Calling ElevenLabs API with EduMate voice...');
    const audioBuffer = await generateElevenLabsSpeech(text);
    console.log('Received audio buffer, size:', audioBuffer.byteLength);
    
    try {
      await playAudioBuffer(audioBuffer);
      console.log('EduMate audio playback completed');
      if (onEnd) onEnd();
    } catch (playbackError) {
      console.error('Audio playback failed:', playbackError);
      // Fallback to browser's built-in speech synthesis
      console.log('Falling back to browser speech synthesis');
      fallbackSpeakText(text, onEnd);
    }
  } catch (error) {
    console.error('Failed to use EduMate voice, falling back to Web Speech API:', error);
    
    // Fallback to browser's built-in speech synthesis
    fallbackSpeakText(text, onEnd);
  }
}

/**
 * Fallback text-to-speech using browser's built-in speech synthesis
 * @param text The text to speak
 * @param onEnd Callback when speech ends
 */
function fallbackSpeakText(
  text: string, 
  onEnd?: () => void
): void {
  // This function needs to be called from client components
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }

  console.log('Using browser speech synthesis fallback');
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Get available voices and use a good English voice if available
  let voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // Some browsers need a small delay to load voices
    setTimeout(() => {
      voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
      if (englishVoice) {
        console.log('Selected voice:', englishVoice.name);
        utterance.voice = englishVoice;
      }
    }, 100);
  } else {
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
    if (englishVoice) {
      console.log('Selected voice:', englishVoice.name);
      utterance.voice = englishVoice;
    }
  }
  
  // Set speech parameters
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  // Set event handlers
  if (onEnd) utterance.onend = onEnd;
  
  // Start speaking
  window.speechSynthesis.speak(utterance);
} 