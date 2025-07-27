// Integration with Retell API for the EduMate communication coach

interface RetellResponse {
  audio: ArrayBuffer;
  message: string;
}

// Retell agent configuration from Single-Prompt Agent.json
const AGENT_CONFIG = {
  "agent_name": "Single-Prompt Agent",
  "voice_id": "11labs-Cimo",
  "llm_id": "llm_ce5c91333a3d6c42c46c7de0f52d",
  "model": "gpt-4o",
  "language": "en-US"
};

/**
 * Process text through the Retell agent to get an AI response
 * For now, this simulates the agent's response based on the prompt in Single-Prompt Agent.json
 */
export async function getAgentResponse(userMessage: string): Promise<string> {
  // This would call the Retell API to get a response from your agent
  // For now, we'll simulate responses based on the EduMate prompt
  
  console.log('Processing message through EduMate agent:', userMessage);
  
  // Simple simulated responses based on keywords
  if (userMessage.toLowerCase().includes('nervous') || userMessage.toLowerCase().includes('anxious')) {
    return "Totally normal! Let's practice with a low-pressure scenario. Pretend I'm a coworker—pitch your idea in 3 sentences. Ready?";
  }
  
  if (userMessage.toLowerCase().includes('interview') || userMessage.toLowerCase().includes('job')) {
    return "For job interviews, remember the STAR method: Situation, Task, Action, Result. Let's practice a common question: Tell me about a time you overcame a challenge at work.";
  }
  
  if (userMessage.toLowerCase().includes('presentation') || userMessage.toLowerCase().includes('public speaking')) {
    return "Public speaking is a skill anyone can develop! The key is preparation and practice. Let's break down your presentation into sections and work on the introduction first.";
  }
  
  // Default response
  return "Great effort! Remember, communication is all about practice. Would you like to try a specific scenario, like a job interview or a presentation?";
}

/**
 * Speak text using the EduMate agent
 */
export async function speakWithAgent(text: string, onEnd?: () => void): Promise<void> {
  if (typeof window === 'undefined') {
    console.error('Cannot generate speech on server side');
    return;
  }

  console.log('EduMate agent speaking:', text.substring(0, 50) + '...');

  try {
    // Cancel any ongoing speech before starting a new one
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      console.log('Speech finished');
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      // Only log non-interrupted errors to console.error
      if (event.error !== 'interrupted') {
        console.error('Speech synthesis error:', event.error);
      }
      // Ignore the "interrupted" error as it's expected behavior
      if (event.error !== 'interrupted' && onEnd) {
        // Optionally call onEnd for other errors if needed
        // onEnd();
      }
      if (event.error === 'interrupted'){
        console.log('Speech was interrupted.');
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Error with speech synthesis:', error);
    // You might want to call onEnd here as well, depending on desired behavior
  }
}

/**
 * This function would be used to establish a WebSocket connection with the Retell agent
 * for real-time conversation - requires additional Retell API setup
 */
export function connectToAgent() {
  // This would establish a WebSocket connection with your Retell agent
  // For implementation, you would need:
  // 1. Retell API key
  // 2. Agent ID from your dashboard
  // 3. WebSocket connection setup
  console.log('Agent connection would be established here in production');
  
  // For a complete implementation, refer to Retell's documentation:
  // https://docs.retellai.com/
}

// In a full implementation, you would add functions to:
// 1. Start/stop conversations
// 2. Send user audio to the agent
// 3. Receive agent responses
// 4. Handle websocket events

/**
 * Generate speech using the Retell API with the EduMate agent
 * This connects directly to the agent configured in Single-Prompt Agent.json
 */
// export async function generateAgentSpeech(text: string): Promise<ArrayBuffer> {
//   try {
//     console.log('Connecting to EduMate agent via Retell API:', text.substring(0, 50) + '...');
//     
//     // For now, we'll use ElevenLabs directly with the proper voice ID
//     // In a production environment, you would use Retell's API to connect to your agent
//     // This would require your Retell API key and agent ID
//     
//     const API_KEY = process.env.ELEVENLABS_API_KEY;
//     const VOICE_ID = '29vD33N1CtxCmqQRPOHJ'; // You might want to make this configurable as well
//     
//     if (!API_KEY) {
//       console.error('ELEVENLABS_API_KEY not configured in environment variables.');
//       throw new Error('ElevenLabs API key not configured.');
//     }
//     
//     const response = await axios({
//       method: 'POST',
//       url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
//       headers: {
//         'Accept': 'audio/mpeg',
//         'Content-Type': 'application/json',
//         'xi-api-key': API_KEY,
//       },
//       data: {
//         text,
//         model_id: 'eleven_multilingual_v2',
//         voice_settings: {
//           stability: 0.6,
//           similarity_boost: 0.8
//         },
//       },
//       responseType: 'arraybuffer'
//     });
//
//     return response.data;
//   } catch (error) {
//     console.error('Error connecting to EduMate agent:', error);
//     throw error;
//   }
// }

// export async function playAgentAudio(audioBuffer: ArrayBuffer): Promise<void> {
//   return new Promise((resolve, reject) => {
//     try {
//       const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
//       const url = URL.createObjectURL(blob);
//       const audio = new Audio(url);
//       
//       audio.onended = () => {
//         URL.revokeObjectURL(url);
//         resolve();
//       };
//       
//       audio.onerror = (e) => {
//         console.error('Audio playback error:', e);
//         URL.revokeObjectURL(url);
//         reject(e);
//       };
//       
//       const playPromise = audio.play();
//       if (playPromise) {
//         playPromise.catch(error => {
//           console.error('Failed to play audio:', error);
//           reject(error);
//         });
//       }
//     } catch (error) {
//       console.error('Error playing agent audio:', error);
//       reject(error);
//     }
//   });
// } 