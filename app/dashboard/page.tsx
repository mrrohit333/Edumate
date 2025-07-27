"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  Copy,
  CheckCircle,
  User,
  Loader2,
  Mic,
  AlertCircle,
  Upload,
  Paperclip
} from "lucide-react"
import PDFUploader from "@/components/pdf-uploader"
import { speakText } from "@/lib/speech-api"
import { speakWithAgent, getAgentResponse } from "@/lib/retell-api"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

const videoStyles = `
  .hideControls::-webkit-media-controls {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-panel {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-play-button {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-timeline {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-current-time-display {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-time-remaining-display {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-time-remaining-display {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-mute-button {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-toggle-closed-captions-button {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-volume-slider {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-fullscreen-button {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-start-playback-button {
    display: none !important;
  }
  .hideControls::-webkit-media-controls-enclosure {
    display: none !important;
  }
`;

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'practice'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [pdfSummary, setPdfSummary] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null)
  const [processingPdf, setProcessingPdf] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentSpeech, setCurrentSpeech] = useState("")
  const [displayText, setDisplayText] = useState<string>("")
  const [lipMovementActive, setLipMovementActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [userResponse, setUserResponse] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai', fileUrl?: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isChatActive, setIsChatActive] = useState(false)
  const [isTextInputEnabled, setIsTextInputEnabled] = useState(false)
  const [voiceInputTimeoutId, setVoiceInputTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Add event listeners to video element
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);

  // Test the speech API on component mount (temporary for debugging)
  useEffect(() => {
    const testVoiceAPI = async () => {
      try {
        console.log("Testing voice API with a short phrase...");
        await speakText("Hello, I am your AI English tutor.", () => {
          console.log("Test speech completed successfully");
        });
      } catch (error) {
        console.error("Voice API test failed:", error);
        setErrorMessage("Voice API test failed. Check console for details.");
      }
    };
  }, []);

  // Predefined practice phrases
  const practiceOptions = [
    { title: "Job Interview Practice", text: "Tell me about your work experience and skills. Why do you think you're a good fit for this position?" },
    { title: "Daily Conversation", text: "Hello! How are you today? What are your plans for the weekend? I'm thinking about going to the park." },
    { title: "Business Meeting", text: "Let's discuss our quarterly results. I believe we can improve our performance by focusing on customer satisfaction." }
  ]

  const handlePdfUpload = async (file: File) => {
    setUploadedPdf(file)
    setProcessingPdf(true)

    // Simulate PDF processing
    setTimeout(() => {
      setProcessingPdf(false)
      setPdfSummary(`# Summary of ${file.name}

## Key Points

1. English language proficiency is essential in today's global economy.
2. Regular practice with a native speaker is the most effective way to improve.
3. AI-powered language tutors can provide personalized feedback on pronunciation and grammar.
4. The document outlines a structured approach to learning English in 3 months.

## Grammar Highlights

- Present perfect tense is used to describe experiences that are connected to the present.
- Modal verbs (can, could, should) express possibility, ability, or necessity.
- Articles (a, an, the) are often challenging for non-native speakers.

## Vocabulary

- **Proficiency**: A high degree of skill or expertise
- **Fluency**: The ability to express oneself easily and articulately
- **Colloquial**: Language used in ordinary or familiar conversation
- **Articulate**: Expressing oneself readily, clearly, and effectively

## Recommended Practice

- Engage in daily conversations with native speakers
- Read English news articles and summarize them
- Watch English movies with subtitles
- Practice interview scenarios with common questions

This document provides a comprehensive guide to improving English speaking skills with practical exercises and methodologies.`)
    }, 3000)
  }

  const copyToClipboard = () => {
    if (pdfSummary) {
      navigator.clipboard.writeText(pdfSummary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Test voice API functionality with the agent
  const testVoiceAPI = async () => {
    setErrorMessage(null);
    
    const introMessage = "Hi there! I'm EduMate, your communication sidekick. Whether you want to ace interviews, speak confidently, or just chat smoother, I'm here to help. Which speaking practice would you like to try today?";
    
    // Set the display text
    setDisplayText(introMessage);
    
    try {
      setIsSpeaking(true);
      setLipMovementActive(true);
      
      // Start playing the video immediately
      if (videoRef.current) {
        console.log("Starting video for test voice...");
        try {
          videoRef.current.currentTime = 0; // Reset to beginning
          videoRef.current.muted = false;
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Video playback error during test:", err);
          // Continue with speech even if video fails
        }
      }
      
      // Use the agent to speak the intro message
      await speakWithAgent(introMessage, () => {
        setIsSpeaking(false);
        setLipMovementActive(false);
        
        // Clear display text when done speaking
        setTimeout(() => {
          setDisplayText("");
        }, 1000);
        
        // Pause video when speech ends
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
          }
        }, 500); // Half-second delay before stopping
      });
    } catch (error) {
      console.error("Voice API test failed:", error);
      setErrorMessage("Voice API test failed. Check console for details.");
      setIsSpeaking(false);
      setLipMovementActive(false);
      setDisplayText(""); // Clear display text on error
      
      // Make sure video stops if there's an error
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle AI speaking through EduMate agent
  const handleSpeak = async (text: string) => {
    if (!isSpeaking) {
      setCurrentSpeech(text);
      setIsSpeaking(true);
      setLipMovementActive(true);
      setErrorMessage(null);
      
      // Set the display text
      setDisplayText(text);
      
      console.log("Starting speech process...");
      
      // Play the video first for visual feedback
      if (videoRef.current) {
        console.log("Attempting to play video...");
        try {
          videoRef.current.currentTime = 0; // Reset video to beginning
          
          // Unmute video to ensure audio plays
          videoRef.current.muted = false;
          
          // Start playing video immediately
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Video playing successfully");
                setIsPlaying(true);
              })
              .catch(error => {
                console.error("Video play promise error:", error);
                console.log("Attempting to play video again after user interaction");
                
                // Still proceed with speech even if video fails
                setIsPlaying(true); 
              });
          }
        } catch (err) {
          console.error("Video playback error:", err);
          // Continue with speech even if video fails
        }
      }
      
      try {
        // Use the agent to speak the text
        console.log("Generating agent speech...");
        await speakWithAgent(text, () => {
          console.log("Agent speech playback finished");
          setIsSpeaking(false);
          setLipMovementActive(false);
          
          // Clear display text when done speaking
          setTimeout(() => {
            setDisplayText("");
          }, 1000);
          
          // Keep video playing briefly after speech ends for a smoother experience
          setTimeout(() => {
            if (videoRef.current) {
              console.log("Pausing video after speech");
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
              setIsPlaying(false);
              console.log("Video paused and reset after speech timeout.");
            }
          }, 500); // Half-second delay before stopping video
        });
      } catch (error) {
        console.error("Error speaking text:", error);
        setErrorMessage("Failed to generate speech. Please try again.");
        setIsSpeaking(false);
        setLipMovementActive(false);
        setDisplayText(""); // Clear display text on error
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  const handlePracticeOptionClick = (text: string) => {
    setCurrentSpeech(text);
    handleSpeak(text);
  }

  // Start recording user's voice
  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          console.log("MediaRecorder dataavailable event.");
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        console.log("MediaRecorder stopped event fired. Current isRecording:", isRecording);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Here you could send the audioBlob to a speech-to-text service
        // For now, we'll just simulate a response
        setUserResponse("I understood your response. That's a great point about...");
        
        // Cleanup is now handled in stopRecording
        // stream.getTracks().forEach(track => track.stop());

        // Set recording state to false after stopping - this is already handled by stopRecording now
        // setIsRecording(false);
        console.log("MediaRecorder stop event listener finished. isRecording after potential update:", isRecording);

        // The state updates (setIsRecording(false), setIsTextInputEnabled(true) if timeout) are handled in stopRecording
      });
      
      mediaRecorder.start();
      setIsRecording(true);
      console.log("setIsRecording(true) called after mediaRecorder.start(). Current isRecording:", isRecording);
      setIsTextInputEnabled(false); // Ensure text input is hidden when recording starts
      console.log("setIsTextInputEnabled(false) called after mediaRecorder.start(). Current isTextInputEnabled:", isTextInputEnabled);

      // Clear any existing timeout before setting a new one
      if (voiceInputTimeoutId) {
        clearTimeout(voiceInputTimeoutId);
        console.log("Cleared previous timeout.");
      }

      // Set a timeout to stop recording if no audio input is detected
      const id = setTimeout(() => {
        console.log("Voice input timeout reached in startRecording.");
        console.log("State before calling stopRecording from timeout: isChatActive:", isChatActive, "isRecording:", isRecording);
        // Attempt to stop the recording - stopRecording will handle state updates
        if (mediaRecorderRef.current && isRecording) {
           console.log("Attempting to stop recording due to timeout.");
           stopRecording(); // Call stopRecording to handle the stop and state updates
        } else if (mediaRecorderRef.current && !isRecording) {
           console.log("Timeout reached, but isRecording is already false. MediaRecorder might have stopped earlier. Calling stopRecording anyway for state cleanup.");
           stopRecording(); // Call stopRecording for state cleanup even if already stopped
        } else if (!mediaRecorderRef.current) {
           console.log("Timeout reached, but mediaRecorderRef.current is null.");
        }

        // We don't directly set isTextInputEnabled(true) here anymore, stopRecording handles it
        setVoiceInputTimeoutId(null); // Clear the timeout ID state
        console.log("voiceInputTimeoutId set to null in timeout.");
      }, 10000); // 10 seconds timeout
      setVoiceInputTimeoutId(id); // Store the timeout ID
      console.log("New voiceInputTimeoutId set:", id);

    } catch (error) {
      console.error("Error starting recording:", error);
      setErrorMessage("Could not access microphone. Please check permissions.");
    }
  }
  
  // Handle user recording and response
  const stopRecording = () => {
    console.log("stopRecording function called. Current isRecording:", isRecording);
    if (mediaRecorderRef.current) { // Check if mediaRecorder is available
      // Only stop if it's currently recording or paused
      if (mediaRecorderRef.current.state !== 'inactive') {
         console.log("Stopping mediaRecorder from stopRecording. Current state:", mediaRecorderRef.current.state);
         mediaRecorderRef.current.stop(); // This will trigger the 'stop' event
      } else {
         console.log("mediaRecorder is already inactive in stopRecording.");
      }

      // Explicitly set isRecording to false and enable text input here
      // This ensures the state is updated even if the 'stop' event is delayed or missed.
      setIsRecording(false);
      console.log("setIsRecording(false) called in stopRecording.");

      // Also ensure isSpeaking is false when recording stops
      setIsSpeaking(false);
      console.log("setIsSpeaking(false) called in stopRecording.");

      setIsTextInputEnabled(true); // Enable text input whenever stopRecording is called
      console.log("setIsTextInputEnabled(true) called in stopRecording.");

      // Clear the timeout if recording is stopped manually or by timeout
      if (voiceInputTimeoutId) {
        clearTimeout(voiceInputTimeoutId);
        setVoiceInputTimeoutId(null);
        console.log("Timeout cleared in stopRecording.");
      }

      // Cleanup stream tracks
      if (mediaRecorderRef.current.stream) {
         mediaRecorderRef.current.stream.getTracks().forEach(track => {
            console.log("Stopping stream track:", track.kind);
            track.stop();
         });
         console.log("Stream tracks stopped in stopRecording.");
      }

    } else {
      console.log("stopRecording called but mediaRecorderRef.current is null.");
      // If mediaRecorderRef is null, just ensure states are reset
      setIsRecording(false);
      setIsTextInputEnabled(true);
      if (voiceInputTimeoutId) {
        clearTimeout(voiceInputTimeoutId);
        setVoiceInputTimeoutId(null);
      }
    }
  };
  
  // Clean up speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Use an improved useEffect to preload the video and set up autoplay
  useEffect(() => {
    // Function to prepare the video element
    const prepareVideo = async () => {
      if (!videoRef.current) return;
      
      console.log("Preparing video element...");
      
      // Load the video
      videoRef.current.load();
      
      try {
        // Try to play a frame to prepare for autoplay
        await videoRef.current.play();
        console.log("Video preloaded successfully");
        
        // Immediately pause
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (e) {
        console.log("Preloading requires user interaction:", e);
        // This is expected in many browsers
      }
      
      // Add metadata loaded event listener
      videoRef.current.addEventListener('loadedmetadata', () => {
        console.log("Video metadata loaded");
      });
      
      // Add playing event listener
      videoRef.current.addEventListener('playing', () => {
        console.log("Video is now playing");
      });
    };
    
    prepareVideo().catch(err => {
      console.log("Error preparing video:", err);
    });
    
    // Cleanup
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', () => {});
        videoRef.current.removeEventListener('playing', () => {});
      }
    };
  }, []);

  // Update active tab based on URL changes (e.g., browser back/forward)
  useEffect(() => {
    const tab = searchParams.get('tab') || 'practice'
    setActiveTab(tab)
  }, [searchParams])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile || isSending) return; // Allow sending if only a file is selected

    // Add user message/file to display
    const userMessage = {
        text: inputMessage.trim() ? inputMessage.trim() : (selectedFile ? `Uploaded: ${selectedFile.name}` : ''),
        sender: 'user' as const
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    setInputMessage(''); // Clear text input after sending
    setIsSending(true);
    setSelectedFile(null); // Clear selected file after sending

    try {
      // Add a thinking message while waiting for AI response
      const thinkingMessage = { text: 'Thinking...', sender: 'ai' as const }
      setMessages(prevMessages => [...prevMessages, thinkingMessage]);

      const formData = new FormData();
      formData.append('message', inputMessage);
      if (selectedFile) {
          formData.append('file', selectedFile);
      }

      const response = await fetch('/api/edumate', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' }, // FormData handles Content-Type
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Remove the thinking message and add the actual AI response
      setMessages(prevMessages => [
        ...prevMessages.filter(msg => msg.text !== 'Thinking...'),
        { text: data.text, sender: 'ai' as const },
      ])

      // Play the AI response using the handleSpeak function
      handleSpeak(data.text);

    } catch (error) {
      console.error('Error sending message:', error)
      setErrorMessage('Failed to get response from AI.')
      // Remove thinking message on error
      setMessages(prevMessages => prevMessages.filter(msg => msg.text !== 'Thinking...'))
    } finally {
      setIsSending(false)

      // After sending a text message, ensure chat is active, recording is off, and text input is enabled
      setIsChatActive(true); // Ensure chat is marked as active
      setIsRecording(false);
      setIsTextInputEnabled(true);
      console.log("State after sending text message: isChatActive:", isChatActive, "isRecording:", isRecording, "isTextInputEnabled:", isTextInputEnabled);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
  }

  const handleQuickMessage = (message: string) => {
    setInputMessage(message)
    // Optionally send immediately
    // handleSendMessage(); 
  }

  // Placeholder for stop functionality (if API supports streaming later)
  const handleToggleChat = async () => {
    console.log("handleToggleChat called. Current isChatActive:", isChatActive, "isRecording:", isRecording);
    if (isChatActive) { // Currently Active, so Stop the chat entirely
      console.log("handleToggleChat called: Stopping chat.");
      setIsChatActive(false);
      // setIsTextInputEnabled(false); // This will be handled by stopRecording potentially enabling it

      // Stop any ongoing speech or recording
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      // Calling stopRecording will handle mediaRecorder and state updates
      stopRecording();

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset video to the beginning
        setIsPlaying(false);
      }
      setIsSending(false); // Ensure send button is enabled after stopping

      // Clear any lingering timeout just in case - stopRecording handles this now
      // if (voiceInputTimeoutId) {
      //   clearTimeout(voiceInputTimeoutId);
      //   setVoiceInputTimeoutId(null);
      //   console.log("Timeout cleared during full chat stop.");
      // }

    } else { // Currently Inactive, so Start the chat
      console.log("handleToggleChat called: Starting chat.");
      setIsChatActive(true);
      setIsTextInputEnabled(false); // Disable text input initially (voice mode)
      setMessages([]); // Clear previous messages on start
      setInputMessage(''); // Clear input message
      setErrorMessage(null); // Clear any previous errors

      // Start recording for voice input - startRecording handles its own timeout
      startRecording();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      console.log("File selected:", file.name);
      // You might want to show the selected file name in the UI here
    }
  };

  console.log("Rendering DashboardPage. isChatActive:", isChatActive, "isRecording:", isRecording, "isTextInputEnabled:", isTextInputEnabled);
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Main content area: flex row */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left/Center Area: Welcome Back and 3D Model */}
        <div className="w-2/3 p-6 flex flex-col">
          {/* Welcome Back Section */}
          <div className="pb-4">
            <h1 className="text-3xl font-bold">Welcome Back! 👋</h1>
            {/* Placeholder for user info if needed */}
            {/* <p className="text-sm text-muted-foreground">{user?.name} ({user?.email})</p> */}
          </div>

          {/* 3D Model Area */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
            {/* Placeholder for 3D model or video */}
            <video
              ref={videoRef}
              src="/assets/3d/3D Demo.mp4"
              className="w-full h-full object-cover hideControls"
              playsInline
              muted={false}
              autoPlay={false}
              controls={false}
              preload="auto"
              controlsList="nodownload nofullscreen noremoteplayback noremotecontrolls"
              disablePictureInPicture
              poster=""
              onPlay={() => {
                console.log("Video play event fired");
                setIsPlaying(true);
              }}
              onPause={() => {
                console.log("Video pause event fired");
                setIsPlaying(false);
              }}
              onEnded={() => {
                console.log("Video ended event fired");
                setIsPlaying(false);
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0; // Reset to beginning
                  console.log("Video paused and reset on ended.");
                }
              }}
              onError={(e) => {
                console.error("Model error:", e);
                setErrorMessage("Failed to load Model. Please refresh the page.");
              }}
              style={{
                pointerEvents: 'none',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
            />
          </div>
        </div>

        {/* Chat Interface */}
        <div className="w-1/3 p-6 border-l flex flex-col bg-card rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Chat</h2>
          {/* Message Display Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[70%] text-white ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-green-400 to-green-600'
                      : 'bg-gradient-to-r from-purple-400 to-purple-600'
                  }`}
                >
                  {msg.text}
                  {/* Display download link for user messages with a fileUrl */}
                  {msg.sender === 'user' && msg.fileUrl && (
                    <a
                      href={msg.fileUrl}
                      download={msg.text.replace('Uploaded: ', '')} // Use file name from text for download attribute
                      className="block mt-2 text-blue-200 hover:text-blue-100 underline"
                      onClick={(e) => e.stopPropagation()} // Prevent chat bubble click from interfering
                      target="_blank" // Open link in new tab
                      rel="noopener noreferrer" // Security best practice for target="_blank"
                    >
                      Download {msg.text.replace('Uploaded: ', '')}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="pt-4 border-t flex items-center gap-2">
            {/* Quick message button removed */}
            {/* {!isChatActive && (
              <Button variant="outline" size="sm" onClick={() => handleQuickMessage('hi')}>hi</Button>
            )} */}
            {/* Text Input (conditionally displayed) */}
            {isTextInputEnabled && (
            <Input
              placeholder="Type your message..."
              className="flex-1"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (isTextInputEnabled) handleSendMessage();
                  else console.log("Text input is disabled during voice recording.");
                }
              }}
              disabled={!isTextInputEnabled || isSending}
            />
            )}
            {/* Send Button (conditionally displayed) */}
            {isTextInputEnabled && (
              <Button onClick={handleSendMessage} disabled={isSending}>
                Send
              </Button>
            )}
            {/* Toggle Chat Button */}
            <Button variant={isChatActive && isRecording ? "destructive" : "default"} onClick={handleToggleChat}>
              {isChatActive ? (isRecording ? "Listening..." : "Stop") : "Start"}
            </Button>
            {/* Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending} // Disable upload button while sending message
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

