"use client";
import { useState, useEffect } from "react";
import { Plus, Video, Mic, MessageSquare, X, Users, Share2, Settings, Shield, Wifi, Clock, Users2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { postRoom, postJoinRoom } from "../apilib/ApiPost";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { selectJWTToken } from "@/Redux/jwtSlice";
import { getRoom, deleteRoom, getRoombyJoinCode } from "@/apilib/ApiGet";
import { setRooms, selectRooms } from "@/Redux/RoomSlice";
import { AppDispatch, RootState } from "@/Redux/Store";
import { Room, DecodedToken, RoomData, RoomState } from "@/interface";

const ChatRoom: React.FC = () => {
  const router = useRouter();
  const token = useSelector(selectJWTToken);
  const dispatch = useDispatch<AppDispatch>();
  const roomState = useSelector((state: RootState) => selectRooms(state));

  // State management
  const [rooms, setLocalRooms] = useState<Room[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [roomToDiscard, setRoomToDiscard] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Form states
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [networkQuality, setNetworkQuality] = useState("HD");
  const [joinCode, setJoinCode] = useState("");

  // Load existing rooms on component mount
  useEffect(() => {
    const loadExistingRooms = async () => {
      try {
        if (!token) return;
        
        const decoded: DecodedToken = jwtDecode(token);
        const roomDetails: RoomData[] = await getRoom(decoded.u_id);
        
        // Transform and set rooms if they exist
        if (roomDetails && roomDetails.length > 0) {
          const existingRooms = roomDetails.map(room => ({
            id: generateRoomId(),
            name: room.room_name,
            password: room.password,
            createdDate: room.date,
            createdTime: room.time,
            participants: 0,
            quality: networkQuality,
            isPrivate: isPrivate,
            maxParticipants: maxParticipants,
            dataUsage: qualitySettings[networkQuality as keyof typeof qualitySettings].dataUsage,
            joinCode: room.join_code.toString(),
            lastActivity: new Date()
          }));
          setLocalRooms(existingRooms);
        }
      } catch (err) {
        console.error("Error loading rooms:", err);
        setError("Failed to load existing rooms");
      }
    };

    loadExistingRooms();
  }, [token]);

  const qualitySettings = {
    'HD': {
      resolution: '1920x1080',
      dataUsage: '~2.5GB/hr',
      minBandwidth: '5 Mbps'
    },
    'SD': {
      resolution: '854x480',
      dataUsage: '~800MB/hr',
      minBandwidth: '2 Mbps'
    },
    'Auto': {
      resolution: 'Adaptive',
      dataUsage: 'Variable',
      minBandwidth: 'Adaptive'
    }
  };

  const generateRoomId = () => Math.random().toString(36).substring(2, 8);
  const generateJoinCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const validateRoomCreation = () => {
    if (rooms.length >= 3) {
      setError("You can only create up to 3 rooms simultaneously");
      return false;
    }
    if (!roomName.trim()) {
      setError("Room name is required");
      return false;
    }
    if (!roomPassword.trim()) {
      setError("Room password is required");
      return false;
    }
    return true;
  };

  const createRoom = async () => {
    if (!validateRoomCreation()) return;

    try {
      const uniqueJoinCode = generateJoinCode();
      const roomId = generateRoomId();
      
      if (!token) {
        setError("Authentication required");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      await postRoom(decoded.u_id, roomName, parseInt(uniqueJoinCode), roomPassword);
      const roomDetails: RoomData[] = await getRoom(decoded.u_id);
      const latestRoom = roomDetails[roomDetails.length - 1];

      const newRoom: Room = {
        id: roomId,
        name: latestRoom.room_name,
        password: latestRoom.password,
        createdDate: latestRoom.date,
        createdTime: latestRoom.time,
        participants: 0,
        quality: networkQuality,
        isPrivate: isPrivate,
        maxParticipants: maxParticipants,
        dataUsage: qualitySettings[networkQuality as keyof typeof qualitySettings].dataUsage,
        joinCode: uniqueJoinCode,
        lastActivity: new Date()
      };

      setLocalRooms(prevRooms => [...prevRooms, newRoom]);
      resetFormAndCloseModal();
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Failed to create room. Please try again.");
    }
  };

  const resetFormAndCloseModal = () => {
    setShowCreateModal(false);
    setRoomName("");
    setRoomPassword("");
    setError("");
  };

  const joinRoom = async (joinCode: string) => {
    try {
      if (!joinCode || !joinPassword) {
        setError("Join code and password are required");
        return;
      }

      const roomResponse = await getRoombyJoinCode(parseInt(joinCode));
      
      if (!roomResponse) {
        setError("Room not found. Please check your join code.");
        return;
      }

      if (roomResponse.password !== joinPassword) {
        setError("Incorrect password");
        return;
      }

      // Save join code and password to Redux state
      const roomState: RoomState = {
        joinCode: joinCode,
        password: joinPassword
      };
      
      dispatch(setRooms(roomState));

      // Generate random room ID and redirect
      const randomRoomId = generateRoomId();
      await postJoinRoom(parseInt(joinCode));
      router.push(`/websockets/${randomRoomId}`);
      
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Failed to join room. Please try again.");
    }
  };

  const handleDiscardRoom = (roomId: string) => {
    setRoomToDiscard(roomId);
    setShowDiscardConfirm(true);
  };

  const confirmDiscard = async () => {
    if (roomToDiscard) {
      try {
        const room = rooms.find(r => r.id === roomToDiscard);
        if (room) {
          await deleteRoom(parseInt(room.joinCode));
          setLocalRooms(prevRooms => prevRooms.filter(room => room.id !== roomToDiscard));
        }
        setShowDiscardConfirm(false);
        setRoomToDiscard(null);
      } catch (err) {
        console.error("Error deleting room:", err);
        setError("Failed to delete room. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Image
              src="/logo.ico"
              alt="Medico Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-teal-700">Medico Interactive Rooms</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Room
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              Join Room
            </button>
          </div>
        </div>

        {/* Room List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Video className="w-16 h-16 text-teal-600" />
                <h3 className="text-xl font-semibold text-gray-800">No Rooms Available</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Create a room to start collaborating with others. You can have up to 3 active rooms at once.
                </p>
                <div className="space-y-3 mt-2">
                  <h4 className="font-medium text-gray-700">Available Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <Video className="w-4 h-4" /> HD/SD Video Quality
                    </li>
                    <li className="flex items-center gap-2">
                      <Mic className="w-4 h-4" /> Crystal Clear Audio
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Real-time Chat
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Private Room Options
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Room
                </button>
              </div>
            </div>
          ) : (
            rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">{room.name}</h3>
                  <button
                    title="button"
                    onClick={() => handleDiscardRoom(room.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Join Code : {room.joinCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Password : {room.password}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Created Date : {room.createdDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Created Time : {room.createdTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4" />
                    <span>{room.participants}/{room.maxParticipants} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span>{room.quality} Quality ({room.dataUsage})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>{room.isPrivate ? 'Private' : 'Public'} Room</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 text-sm"
                  >
                    <Users className="w-4 h-4" />
                    Join
                  </button>
                  <button title="button" className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button title="button" className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Room</h2>
                <button onClick={() => setShowCreateModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Room Name</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter room name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter room password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Max Participants</label>
                  <input 
                    title="button"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                    min="2"
                    max="50"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Network Quality</label>
                  <select
                    title="Network Quality"
                    value={networkQuality}
                    onChange={(e) => setNetworkQuality(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="HD">HD</option>
                    <option value="SD">SD</option>
                    <option value="Auto">Auto</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  <label htmlFor="isPrivate" className="text-sm">Make room private</label>
                </div>

                <button
                  onClick={createRoom}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Join Room Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Join Room</h2>
                <button onClick={() => setShowJoinModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Join Code</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter 6-digit join code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter room password"
                  />
                </div>

                <button
                  onClick={() => joinRoom(joinCode)}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discard Confirmation Modal */}
        {showDiscardConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold">Confirm Discard</h2>
              </div>
              <p className="mb-6 text-gray-600">Are you sure you want to discard this room? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDiscardConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDiscard}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
