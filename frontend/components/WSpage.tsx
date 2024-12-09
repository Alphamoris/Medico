"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactPlayer from 'react-player';
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, Phone,
  PhoneOff, Settings, Users, Share, StopCircle, 
  ScreenShare, ScreenShareOff, Hand, MoreVertical,
  Camera, LogOut, Maximize, Minimize, Send,
  Layout, X, ChevronDown, Volume2, VolumeX
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { selectRooms } from "@/Redux/RoomSlice";
import { RootState } from '@/Redux/Store';

// WebRTC configuration
const configuration = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302'] },
    { urls: ['stun:stun1.l.google.com:19302'] }
  ]
};

// Interfaces
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface Participant {
  id: string;
  name: string;
  stream: MediaStream | null;
  peerConnection: RTCPeerConnection;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
  videoRef: React.RefObject<HTMLDivElement>;
}

// Control Button Component
const ControlButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'danger';
}> = ({
  onClick,
  icon,
  label,
  active = false,
  disabled = false,
  className = '',
  variant = 'default'
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-full transition-all duration-200
      ${active ? 'bg-teal-600' : variant === 'danger' ? 'bg-red-600' : 'bg-teal-800'} 
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700 hover:scale-105'}
      ${className}`}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

// Chat Component
const Chat: React.FC<{
  messages: Message[];
  onSend: (content: string) => void;
  onClose: () => void;
}> = ({ messages, onSend, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (newMessage.trim()) {
      onSend(newMessage.trim());
      setNewMessage('');
      inputRef.current?.focus();
    }
  }, [newMessage, onSend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-teal-900/95 p-4 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Image src="/logo.ico" alt="Medico Logo" width={30} height={30} priority />
          <h3 className="text-lg font-semibold text-white ml-2">Medico Chat</h3>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-teal-800 p-1 rounded-full transition-colors"
          aria-label="Close chat"
        >
          <X className="text-white w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-teal-700">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`rounded-lg p-3 ${
              msg.type === 'system' ? 'bg-teal-700/30' : 'bg-teal-800/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-teal-200">{msg.sender}</span>
              <span className="text-xs text-teal-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-teal-100 mt-1 break-words">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="flex-1"
          maxLength={500}
        />
        <Button 
          onClick={handleSend} 
          disabled={!newMessage.trim()}
          variant="secondary"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Main VideoConference Component
const VideoConference: React.FC = () => {
  const router = useRouter();
  const roomState = useSelector((state: RootState) => selectRooms(state));
  const joinCode = roomState.joinCode;
  const password = roomState.password;
  
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:8000/websockets/ws/${joinCode}/${password}`;
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'speaker'>('grid');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket(WS_URL);
        
        wsRef.current.onopen = () => {
          console.log('WebSocket Connected');
          setIsConnectionEstablished(true);
          setIsReconnecting(false);
          
          // Send initial user data
          wsRef.current?.send(JSON.stringify({
            user_id: Date.now().toString(),
            username: 'User_' + Math.random().toString(36).substr(2, 5)
          }));

          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
        };

        wsRef.current.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        wsRef.current.onerror = (error) => {
          console.log('WebSocket error:', error);
          setIsConnectionEstablished(false);
        };

        wsRef.current.onclose = () => {
          setIsConnectionEstablished(false);
          if (!isReconnecting) {
            setIsReconnecting(true);
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
          }
        };
      } catch (err) {
        console.error('Error creating WebSocket connection:', err);
        if (!isReconnecting) {
          setIsReconnecting(true);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        }
      }
    };

    connectWebSocket();

    return () => {
      wsRef.current?.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [WS_URL]);

  // Initialize media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAudioInputDevices(devices.filter(device => device.kind === 'audioinput'));
        setVideoInputDevices(devices.filter(device => device.kind === 'videoinput'));
      } catch (err) {
        console.error('Error getting media devices:', err);
      }
    };

    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  // Initialize media stream
  useEffect(() => {
    const initStream = async () => {
      try {
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
          video: isVideoEnabled ? { deviceId: selectedVideoDevice || undefined } : false,
          audio: isAudioEnabled ? { 
            deviceId: selectedAudioDevice || undefined,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } : false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);

        // Update all peer connections with new stream
        participants.forEach(participant => {
          stream.getTracks().forEach(track => {
            const sender = participant.peerConnection
              .getSenders()
              .find(s => s.track?.kind === track.kind);
            if (sender) {
              sender.replaceTrack(track);
            }
          });
        });

      } catch (err) {
        console.error('Failed to get media stream:', err);
        toast({
          title: "Media Access Error",
          description: "Could not access camera or microphone",
          variant: "destructive"
        });
      }
    };

    initStream();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [isVideoEnabled, isAudioEnabled, selectedAudioDevice, selectedVideoDevice]);

  // Handle WebSocket messages
  const handleWebSocketMessage = async (data: any) => {
    switch (data.type) {
      case 'user_joined':
        await handleUserJoined(data.client_id, data.username);
        break;
      case 'user_left':
        handleUserLeft(data.client_id);
        break;
      case 'offer':
        await handleOffer(data.offer, data.client_id);
        break;
      case 'answer':
        await handleAnswer(data.answer, data.client_id);
        break;
      case 'ice_candidate':
        handleIceCandidate(data.candidate, data.client_id);
        break;
      case 'chat':
        handleChatMessage(data);
        break;
      case 'media_state_update':
        handleParticipantMediaState(data);
        break;
      case 'ping':
        wsRef.current?.send(JSON.stringify({ type: 'pong' }));
        break;
    }
  };

  // WebRTC connection handlers
  const handleUserJoined = async (clientId: string, username: string) => {
    const peerConnection = new RTCPeerConnection(configuration);
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current?.send(JSON.stringify({
          type: 'ice_candidate',
          candidate: event.candidate,
          to_client: clientId
        }));
      }
    };

    peerConnection.ontrack = (event) => {
      const participant = participants.get(clientId);
      if (participant) {
        participant.stream = event.streams[0];
        setParticipants(new Map(participants));
      }
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    wsRef.current?.send(JSON.stringify({
      type: 'offer',
      offer,
      to_client: clientId
    }));

    const newParticipant: Participant = {
      id: clientId,
      name: username,
      stream: null,
      peerConnection,
      isAudioEnabled: true,
      isVideoEnabled: true,
      isScreenSharing: false,
      isSpeaking: false,
      videoRef: React.createRef()
    };

    setParticipants(prev => new Map(prev.set(clientId, newParticipant)));
    addSystemMessage(`${username} joined the meeting`);
  };

  const handleUserLeft = (clientId: string) => {
    const participant = participants.get(clientId);
    if (participant) {
      participant.peerConnection.close();
      participants.delete(clientId);
      setParticipants(new Map(participants));
      addSystemMessage(`${participant.name} left the meeting`);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit, clientId: string) => {
    const participant = participants.get(clientId);
    if (participant) {
      try {
        await participant.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await participant.peerConnection.createAnswer();
        await participant.peerConnection.setLocalDescription(answer);
        
        wsRef.current?.send(JSON.stringify({
          type: 'answer',
          answer,
          to_client: clientId
        }));
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit, clientId: string) => {
    const participant = participants.get(clientId);
    if (participant) {
      try {
        await participant.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    }
  };

  const handleIceCandidate = (candidate: RTCIceCandidateInit, clientId: string) => {
    const participant = participants.get(clientId);
    if (participant) {
      participant.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(err => {
          console.error('Error adding ICE candidate:', err);
        });
    }
  };

  const handleParticipantMediaState = (data: { 
    client_id: string, 
    isAudioEnabled: boolean, 
    isVideoEnabled: boolean 
  }) => {
    const participant = participants.get(data.client_id);
    if (participant) {
      participant.isAudioEnabled = data.isAudioEnabled;
      participant.isVideoEnabled = data.isVideoEnabled;
      setParticipants(new Map(participants));
    }
  };

  const addSystemMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'System',
      content,
      timestamp: new Date(),
      type: 'system'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleChatMessage = (data: { sender: string; content: string }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: data.sender,
      content: data.content,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (!isChatOpen) {
      toast({
        title: "New Message",
        description: `${data.sender}: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
      });
    }
  };

  const sendChatMessage = (content: string) => {
    wsRef.current?.send(JSON.stringify({
      type: 'chat',
      content
    }));

    handleChatMessage({
      sender: 'You',
      content
    });
  };

  // Media control handlers
 const toggleVideo = useCallback(() => {
  if (localStream) {
    localStream.getVideoTracks().forEach(track => {
      track.enabled = !isVideoEnabled;
    });
    setIsVideoEnabled(!isVideoEnabled);

    // Update the localStream object
    if (isVideoEnabled) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          setLocalStream(stream);
        })
        .catch(error => {
          console.error('Error getting user media:', error);
        });
    } else {
      setLocalStream(null);
    }

    // ...
  }
}, [localStream, isVideoEnabled]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
      
      wsRef.current?.send(JSON.stringify({
        type: 'audioVideoState',
        isVideoEnabled,
        isAudioEnabled: !isAudioEnabled
      }));
    }
  }, [localStream, isVideoEnabled, isAudioEnabled]);

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });

        screenStream.getVideoTracks()[0].onended = () => {
          handleStopScreenShare();
        };

        participants.forEach(participant => {
          const sender = participant.peerConnection
            .getSenders()
            .find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });

        setIsScreenSharing(true);
      } else {
        handleStopScreenShare();
      }
    } catch (err) {
      console.error('Screen sharing error:', err);
      toast({
        title: "Screen Sharing Error",
        description: "Failed to start screen sharing",
        variant: "destructive"
      });
    }
  };

  const handleStopScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { deviceId: selectedVideoDevice || undefined } 
      });
      
      participants.forEach(participant => {
        const sender = participant.peerConnection
          .getSenders()
          .find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(stream.getVideoTracks()[0]);
        }
      });
      
      setIsScreenSharing(false);
    } catch (err) {
      console.error('Error reverting to camera:', err);
    }
  };

  const handleLeaveMeeting = useCallback(() => {
    // Close the localStream object
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    wsRef.current?.close();
    router.push('/chat');
  }, [localStream, router, wsRef]);

  // Render functions
  const renderParticipantVideo = (participant: Participant) => (
    <div key={participant.id} className="relative rounded-lg overflow-hidden h-full" ref={participant.videoRef}>
      {participant.stream && participant.isVideoEnabled && (
        <ReactPlayer
          url={participant.stream}
          playing
          muted={participant.id === 'local'}
          height="100%"
          width="100%"
          playsinline
          config={{
            file: {
              attributes: {
                style: { objectFit: 'contain' }
              }
            }
          }}
        />
      )}
      
      {!participant.isVideoEnabled && (
        <div className="absolute inset-0 bg-teal-800 flex items-center justify-center">
          <div className="rounded-full bg-teal-700 p-6">
            <Users className="w-12 h-12 text-teal-200" />
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="text-white bg-black/50 px-2 py-1 rounded flex items-center gap-2">
          <span>{participant.name}</span>
          {!participant.isAudioEnabled && (
            <MicOff className="w-4 h-4 text-red-500" />
          )}
        </div>
        {participant.isScreenSharing && (
          <div className="text-white bg-black/50 px-2 py-1 rounded">
            <ScreenShare className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-teal-950 flex flex-col overflow-hidden">
      {!isConnectionEstablished && (
        <Alert variant="destructive" className="m-1 w-1/3">
          <AlertDescription>
            Connection lost. {isReconnecting ? 'Attempting to reconnect...' : 'Please check your internet connection.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 relative">
        <div className={`grid gap-4 p-4 h-full ${
          layout === 'grid' 
            ? `grid-cols-${Math.min(Math.ceil(Math.sqrt(participants.size + 1)), 4)}`
            : 'grid-cols-1'
        }`}>
          {/* Local video */}
          <div className="relative rounded-lg overflow-hidden h-full" ref={localVideoRef}>
            {localStream && isVideoEnabled && (
              <ReactPlayer
                url={localStream}
                playing
                muted
                height="100%"
                width="100%"
                playsinline
                config={{
                  file: {
                    attributes: {
                      style: { objectFit: 'contain' }
                    }
                  }
                }}
              />
            )}
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-teal-800 flex items-center justify-center">
                <div className="rounded-full bg-teal-700 p-6">
                  <Users className="w-12 h-12 text-teal-200" />
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="text-white bg-black/50 px-2 py-1 rounded flex items-center gap-2">
                <span>You</span>
                {!isAudioEnabled && (
                  <MicOff className="w-4 h-4 text-red-500" />
                )}
              </div>
              {isScreenSharing && (
                <div className="text-white bg-black/50 px-2 py-1 rounded">
                  <ScreenShare className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
          
          {/* Remote participants */}
          {Array.from(participants.values()).map(renderParticipantVideo)}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 bg-teal-900/90 p-2 rounded-lg shadow-lg">
          <ControlButton
            onClick={toggleVideo}
            icon={isVideoEnabled ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-red-500" />}
            label={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
            active={isVideoEnabled}
          />
          
          <ControlButton
            onClick={toggleAudio}
            icon={isAudioEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-red-500" />}
            label={isAudioEnabled ? "Mute" : "Unmute"}
            active={isAudioEnabled}
          />

          <ControlButton
            onClick={toggleScreenShare}
            icon={isScreenSharing ? <ScreenShareOff className="w-5 h-5 text-white" /> : <ScreenShare className="w-5 h-5 text-white" />}
            label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
            active={isScreenSharing}
          />

          <ControlButton
            onClick={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
            icon={<Layout className="w-5 h-5 text-white" />}
            label="Change Layout"
            active={layout === 'speaker'}
          />

          <ControlButton
            onClick={() => setIsChatOpen(!isChatOpen)}
            icon={<MessageSquare className="w-5 h-5 text-white" />}
            label="Chat"
            active={isChatOpen}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-teal-700 bg-teal-800 transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Participants ({participants.size})</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ControlButton
            onClick={handleLeaveMeeting}
            icon={<PhoneOff className="w-5 h-5" />}
            label="Leave Meeting"
            variant="danger"
            className="ml-2"
          />
        </div>
      </div>

      {isChatOpen && (
        <div className="absolute right-4 top-4 bottom-24 w-80">
          <Chat
            messages={messages}
            onSend={sendChatMessage}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Microphone</Label>
              <select   
                title="Microphone"
                value={selectedAudioDevice}
                onChange={(e) => setSelectedAudioDevice(e.target.value)}
                className="w-full p-2 rounded-md border border-teal-600 bg-teal-950 text-white"
              >
                {audioInputDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.substring(0, 5)}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Camera</Label>
              <select
                title="Camera"
                value={selectedVideoDevice}
                onChange={(e) => setSelectedVideoDevice(e.target.value)}
                className="w-full p-2 rounded-md border border-teal-600 bg-teal-950 text-white"
              >
                {videoInputDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.substring(0, 5)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoConference;