"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, Phone, 
  PhoneOff, Settings, Users, Share, Mic2Icon , StopCircle,
  Smile, PlusCircle, Send, Volume2, VolumeX, MoreVertical,
  Grid, Maximize, Minimize, ScreenShare, ScreenShareOff,
  UserPlus, Lock, Camera
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/hooks/use-toast";

// Types
interface ParticipantStream {
  id: string;
  name: string;
  stream: MediaStream;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
  audioLevel: number;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
}

interface DeviceSetting {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

interface RoomConfig {
  roomId: string;
  isPrivate: boolean;
  password?: string;
  maxParticipants: number;
  allowChat: boolean;
  allowScreenShare: boolean;
  allowRecording: boolean;
  videoQuality: 'low' | 'medium' | 'high';
  audioOnly: boolean;
}

const VideoConference: React.FC = () => {
  // State for local media
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // State for room and participants
  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    roomId: crypto.randomUUID(),
    isPrivate: false,
    maxParticipants: 12,
    allowChat: true,
    allowScreenShare: true,
    allowRecording: true,
    videoQuality: 'high',
    audioOnly: false
  });
  const [participants, setParticipants] = useState<Map<string, ParticipantStream>>(new Map());
  const [activeParticipant, setActiveParticipant] = useState<string | null>(null);

  // UI state
  const [isConnected, setIsConnected] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [layout, setLayout] = useState<'speaker' | 'grid'>('speaker');
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Device settings
  const [availableDevices, setAvailableDevices] = useState<DeviceSetting[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<{
    audioInput: string;
    audioOutput: string;
    videoInput: string;
  }>({
    audioInput: '',
    audioOutput: '',
    videoInput: ''
  });

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const participantVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const chatEndRef = useRef<HTMLDivElement>(null);

  // WebRTC configuration
  const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: 'turn:your-turn-server.com',
        username: 'username',
        credential: 'password'
      }
    ],
    iceCandidatePoolSize: 10
  };

  // Initialize media devices and permissions
  useEffect(() => {
    const initializeDevices = async () => {
      try {
        await requestMediaPermissions();
        await enumDevices();
      } catch (err) {
        handleError('Failed to initialize devices', err);
      }
    };

    initializeDevices();
    return () => cleanup();
  }, []);

  // Initialize audio analyzer for voice detection
  useEffect(() => {
    if (localStream) {
      initAudioAnalyzer(localStream);
    }
  }, [localStream]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Helper Functions

  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        }
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      handleError('Media permissions denied', err);
    }
  };

  const enumDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const formattedDevices: DeviceSetting[] = devices.map(device => ({
        deviceId: device.deviceId,
        label: device.label || `${device.kind} (${device.deviceId})`,
        kind: device.kind
      }));
      setAvailableDevices(formattedDevices);
    } catch (err) {
      handleError('Failed to enumerate devices', err);
    }
  };

  const initAudioAnalyzer = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    source.connect(analyser);
    audioAnalyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const checkAudioLevel = () => {
      if (audioAnalyserRef.current) {
        audioAnalyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        requestAnimationFrame(checkAudioLevel);
      }
    };
    checkAudioLevel();
  };

  const handleDeviceChange = async (type: keyof typeof selectedDevices, deviceId: string) => {
    try {
      const newConstraints: MediaStreamConstraints = {
        audio: type === 'audioInput' ? { deviceId: { exact: deviceId } } : isAudioEnabled,
        video: type === 'videoInput' ? { deviceId: { exact: deviceId } } : isVideoEnabled
      };

      const newStream = await navigator.mediaDevices.getUserMedia(newConstraints);
      setLocalStream(newStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }

      setSelectedDevices(prev => ({
        ...prev,
        [type]: deviceId
      }));

      // Update all peer connections with new stream
      updatePeerConnections(newStream);
    } catch (err) {
      handleError('Failed to switch device', err);
    }
  };

  const updatePeerConnections = (newStream: MediaStream) => {
    peerConnectionsRef.current.forEach((pc, peerId) => {
      const senders = pc.getSenders();
      newStream.getTracks().forEach(track => {
        const sender = senders.find(s => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track);
        }
      });
    });
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
        broadcastMediaState('audio', !isAudioEnabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
        broadcastMediaState('video', !isVideoEnabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        setScreenShareStream(screenStream);
        setIsScreenSharing(true);

        // Replace video track in all peer connections
        peerConnectionsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });

        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } else {
        stopScreenShare();
      }
    } catch (err) {
      handleError('Failed to toggle screen share', err);
    }
  };

  const stopScreenShare = () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
      setScreenShareStream(null);
      setIsScreenSharing(false);

      // Restore video track in all peer connections
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        peerConnectionsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender && videoTrack) {
            sender.replaceTrack(videoTrack);
          }
        });
      }
    }
  };

  const startRecording = () => {
    try {
      if (!localStream) return;

      const mediaStream = new MediaStream();
      
      // Add all participant streams
      participants.forEach(participant => {
        participant.stream.getTracks().forEach(track => {
          mediaStream.addTrack(track);
        });
      });

      // Add local stream
      localStream.getTracks().forEach(track => {
        mediaStream.addTrack(track);
      });

      mediaRecorderRef.current = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: BlobPart[] = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conference-${new Date().toISOString()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      addSystemMessage('Recording started');
    } catch (err) {
      handleError('Failed to start recording', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      addSystemMessage('Recording stopped');
    }
  };

  const addSystemMessage = (text: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'System',
      timestamp: new Date(),
      type: 'system'
    };
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: crypto.randomUUID(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    broadcastMessage(message);
  };

  const broadcastMediaState = (type: 'audio' | 'video', enabled: boolean) => {
    // Implement WebSocket broadcast
  };

  const broadcastMessage = (message: Message) => {
    // Implement WebSocket broadcast
  };

  const handleError = (message: string, error: any) => {
    console.error(message, error);
    setError(`${message}: ${error.message}`);
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };

  const cleanup = () => {
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();

    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }

    // Clear state
    setLocalStream(null);
    setScreenShareStream(null);
    setParticipants(new Map());
    setMessages([]);
  };

  // UI Components
  const ControlButton: React.FC<{
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    icon: React.ReactNode;
    label: string;
  }> = ({ onClick, active = true, disabled = false, icon, label }) => (
    <Button
      variant={active ? "default" : "secondary"}
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className="relative group"
    >
      {icon}
      <span className="sr-only">{label}</span>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded p-1 whitespace-nowrap">
        {label}
      </div>
    </Button>
  );

  const ParticipantVideo: React.FC<{
    participant: ParticipantStream;
    isLocal?: boolean;
  }> = ({ participant, isLocal = false }) => (
    <div className="relative rounded-lg overflow-hidden bg-gray-900">
      <video
        ref={el => {
          if (el && !isLocal) {
            participantVideosRef.current.set(participant.id, el);
            el.srcObject = participant.stream;
          }
        }}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${participant.isVideoEnabled ? '' : 'hidden'}`}
      />
      {!participant.isVideoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <Users className="w-16 h-16 text-gray-400" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">
            {isLocal ? 'You' : participant.name}
            {participant.isSpeaking && ' 🔊'}
          </span>
          <div className="flex gap-1">
            {!participant.isAudioEnabled && <MicOff className="w-4 h-4 text-red-500" />}
            {participant.isScreenSharing && <ScreenShare className="w-4 h-4 text-blue-500" />}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Video grid */}
        <div className={`flex-1 p-4 grid gap-4 ${
          layout === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {/* Active speaker or local video */}
          {layout === 'speaker' && (
            <div className="col-span-full aspect-video">
              <ParticipantVideo
                participant={activeParticipant ? participants.get(activeParticipant)! : {
                  id: 'local',
                  name: 'You',
                  stream: localStream!,
                  isAudioEnabled,
                  isVideoEnabled,
                  isSpeaking: audioLevel > 30,
                  isScreenSharing,
                  audioLevel
                }}
                isLocal={!activeParticipant}
              />
            </div>
          )}
          
          {/* Participant videos */}
          {Array.from(participants.values()).map(participant => (
            <ParticipantVideo
              key={participant.id}
              participant={participant}
            />
          ))}

          {/* Local video */}
          {layout === 'grid' && localStream && (
            <ParticipantVideo
              participant={{
                id: 'local',
                name: 'You',
                stream: localStream,
                isAudioEnabled,
                isVideoEnabled,
                isSpeaking: audioLevel > 30,
                isScreenSharing,
                audioLevel
              }}
              isLocal
            />
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-white border-t">
          <div className="flex justify-center items-center gap-2">
            <ControlButton
              onClick={toggleAudio}
              active={isAudioEnabled}
              icon={isAudioEnabled ? <Mic /> : <MicOff />}
              label={isAudioEnabled ? "Mute" : "Unmute"}
            />
            <ControlButton
              onClick={toggleVideo}
              active={isVideoEnabled}
              icon={isVideoEnabled ? <Video /> : <VideoOff />}
              label={isVideoEnabled ? "Stop Video" : "Start Video"}
            />
            <ControlButton
              onClick={toggleScreenShare}
              active={isScreenSharing}
              icon={isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
              label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
              disabled={!roomConfig.allowScreenShare}
            />
            <ControlButton
              onClick={() => setIsChatOpen(!isChatOpen)}
              active={isChatOpen}
              icon={<MessageSquare />}
              label="Chat"
              disabled={!roomConfig.allowChat}
            />
            <ControlButton
              onClick={() => isRecording ? stopRecording() : startRecording()}
              active={isRecording}
              icon={isRecording ? <StopCircle /> : <Mic2Icon />}
              label={isRecording ? "Stop Recording" : "Start Recording"}
              disabled={!roomConfig.allowRecording}
            />
            <ControlButton
              onClick={() => setIsSettingsOpen(true)}
              icon={<Settings />}
              label="Settings"
            />
            <ControlButton
              onClick={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
              icon={layout === 'grid' ? <Maximize /> : <Grid />}
              label={layout === 'grid' ? "Speaker View" : "Grid View"}
            />
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      {isChatOpen && (
        <div className="w-80 border-l bg-white flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map(message => (
              <div key={message.id} className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.sender}</span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-1">{message.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button type="submit">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Settings dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Audio Input</Label>
              <select
                title="Audio Input"
                value={selectedDevices.audioInput}
                onChange={e => handleDeviceChange('audioInput', e.target.value)}
                className="w-full"
              >
                {availableDevices
                  .filter(device => device.kind === 'audioinput')
                  .map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-4">
              <Label>Video Input</Label>
              <select
                title="Video Input"
                value={selectedDevices.videoInput}
                onChange={e => handleDeviceChange('videoInput', e.target.value)}
                className="w-full"
              >
                {availableDevices
                  .filter(device => device.kind === 'videoinput')
                  .map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="fixed bottom-4 right-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VideoConference;