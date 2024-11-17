"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Ambulance, Clock, MapPin, AlertCircle, X, 
  Loader2, CheckCircle2, PhoneCall, Video, 
  Phone, PhoneOff, Shield, BellRing 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from "@/components/hooks/use-toast"

// Types
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface FormData {
  name: string;
  phone: string;
  location: string;
  coordinates: Coordinates | null;
  emergencyType: 'medical' | 'accident' | 'other';
  additionalNotes: string;
  timestamp : string | null ;
}

interface EmergencyResponse {
  success: boolean;
  estimatedTime: number;
  emergencyId?: string;
  nearestHospital?: string;
}

// Constants
const EMERGENCY_QUOTES = [
  "Every second counts - we're here for you.",
  "Help is on the way. Stay calm and breathe.",
  "Your safety is our priority.",
  "Professional care, coming to you.",
  "We're available 24/7, because emergencies don't wait."
];

const EMERGENCY_TYPES = [
  { value: 'medical', label: 'Medical Emergency' },
  { value: 'accident', label: 'Accident' },
  { value: 'other', label: 'Other Emergency' }
];

// Mock API call with better typing
const sendEmergencyRequest = async (data: FormData): Promise<EmergencyResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    success: true,
    estimatedTime: Math.floor(Math.random() * (12 - 5 + 1)) + 5,
    emergencyId: `EMG-${Math.random().toString(36).substr(2, 9)}`,
    nearestHospital: 'City General Hospital'
  };
};

const EmergencyButton: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [needsDoctor, setNeedsDoctor] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [currentQuote, setCurrentQuote] = useState(EMERGENCY_QUOTES[0]);
  const [callType, setCallType] = useState<'video' | 'audio' | null>(null);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [emergencyId, setEmergencyId] = useState<string | null>(null);
  const [nearestHospital, setNearestHospital] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    location: '',
    coordinates: null,
    emergencyType: 'medical',
    additionalNotes: '',
    timestamp : null ,
  });

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => {
        const quotes = EMERGENCY_QUOTES.filter(quote => quote !== prev);
        return quotes[Math.floor(Math.random() * quotes.length)];
      });
    }, 3000);
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setPulseAnimation(prev => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  const getUserLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding using Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        location: data.display_name || 'Location detected (Please verify)',
        coordinates: { latitude, longitude }
      }));

      toast({
        title: "Location Updated",
        description: "Your location has been successfully detected",
      });
    } catch (error) {
      console.error('Location error:', error);
      toast({
        title: "Location Error",
        description: "Failed to detect location. Please enter address manually.",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      getUserLocation();
    }
  }, [isOpen, getUserLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await sendEmergencyRequest({
        ...formData,
        timestamp: new Date().toISOString(),
      });

      if (response.success) {
        setEstimatedTime(response.estimatedTime);
        setEmergencyId(String(response.emergencyId));
        setNearestHospital(String(response.nearestHospital));
        setShowSuccess(true);

        // Send emergency notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Emergency Services Dispatched', {
            body: `Help is on the way. ETA: ${response.estimatedTime} minutes`,
            icon: '/ambulance-icon.png'
          });
        }
      }
    } catch (error) {
      console.error('Emergency request failed:', error);
      toast({
        title: "Emergency Request Failed",
        description: "Please try again or call emergency services directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isSubmitting) {
      toast({
        title: "Warning",
        description: "Please wait while we process your emergency request",
        variant: "destructive"
      });
      return;
    }
    
    setShowSuccess(false);
    setIsOpen(false);
    setNeedsDoctor(false);
    setEstimatedTime(null);
    setCallType(null);
    setEmergencyId(null);
    setNearestHospital(null);
    setFormData({
      name: '',
      phone: '',
      location: '',
      coordinates: null,
      emergencyType: 'medical',
      additionalNotes: '',
      timestamp : " "
    });
  };

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-3 z-48 group bg-gradient-to-r from-red-500 to-red-600 
                 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                 transform hover:scale-105 focus:outline-none focus:ring-2 
                 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Open Emergency Services"
      >
        <div className={`absolute -inset-1 bg-red-500 rounded-full ${pulseAnimation ? 'animate-ping' : ''} opacity-20`} />
        <div className="relative px-4 py-2 flex items-center space-x-2">
          <span className="font-bold text-xs">EMERGENCY</span>
          <Ambulance className="w-5 h-5" />
        </div>
      </button>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white sticky top-0 z-10 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Ambulance className="w-6 h-6" />
              <h2 id="emergency-title" className="font-bold text-lg">Emergency Services</h2>
            </div>
            <button
              onClick={handleReset}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close emergency form"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm mt-2 text-white/90 italic">{currentQuote}</p>
        </div>

        <div className="p-6">
          {showSuccess ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
                <h3 className="font-bold text-xl text-gray-800">Help is on the way!</h3>
                
                <Alert>
                  <AlertDescription className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>ETA: {estimatedTime} minutes</span>
                    </div>
                    {emergencyId && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Shield className="w-5 h-5" />
                        <span>Emergency ID: {emergencyId}</span>
                      </div>
                    )}
                    {nearestHospital && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <BellRing className="w-5 h-5" />
                        <span>Nearest Hospital: {nearestHospital}</span>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </div>

              {!needsDoctor ? (
                <div className="space-y-4 mt-6">
                  <p className="text-gray-700 text-center font-medium">
                    Need medical consultation while waiting?
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setNeedsDoctor(true);
                        setCallType('video');
                      }}
                      className="flex items-center justify-center space-x-2 bg-blue-500 
                               text-white font-medium py-3 px-4 rounded-xl 
                               hover:bg-blue-600 transition-all duration-300"
                    >
                      <Video className="w-5 h-5" />
                      <span>Video Call</span>
                    </button>
                    <button
                      onClick={() => {
                        setNeedsDoctor(true);
                        setCallType('audio');
                      }}
                      className="flex items-center justify-center space-x-2 bg-green-500 
                               text-white font-medium py-3 px-4 rounded-xl 
                               hover:bg-green-600 transition-all duration-300"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Audio Call</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    {callType === 'video' ? (
                      <Video className="w-6 h-6 animate-pulse" />
                    ) : (
                      <PhoneCall className="w-6 h-6 animate-pulse" />
                    )}
                    <span className="font-medium">Connecting to doctor...</span>
                  </div>
                  <button
                    onClick={() => {
                      setNeedsDoctor(false);
                      setCallType(null);
                    }}
                    className="w-full flex items-center justify-center space-x-2 
                             bg-red-100 text-red-600 font-medium py-3 px-4 
                             rounded-xl hover:bg-red-200 transition-all duration-300"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>End Call</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert>
                <AlertDescription className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">
                    Our ambulances are equipped with advanced life support.
                    Average response time: 5-12 minutes.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {/* <div>
                  <label htmlFor="emergency-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Type
                  </label>
                  <select
                    id="emergency-type"
                    value={formData.emergencyType}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      emergencyType: e.target.value as FormData['emergencyType']
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-red-500 focus:border-red-500 
                             text-sm disabled:opacity-50"
                    disabled={isSubmitting}
                    required
                  >
                    {EMERGENCY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div> */}

                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-red-500 focus:border-red-500 
                             text-sm disabled:opacity-50"
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-red-500 focus:border-red-500 
                             text-sm disabled:opacity-50"
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl 
                               focus:ring-2 focus:ring-red-500 focus:border-red-500 
                               text-sm disabled:opacity-50"
                      placeholder="Enter your location"
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={getUserLocation}
                      className="absolute right-2 top-1/2 -translate-y-1/2 
                               text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      disabled={isSubmitting}
                      aria-label="Get current location"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-red-500 focus:border-red-500 
                             text-sm disabled:opacity-50 min-h-[100px] resize-y"
                    placeholder="Any additional information that might help emergency responders..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 
                         text-white font-medium py-3 px-4 rounded-xl
                         hover:from-red-600 hover:to-red-700 
                         focus:outline-none focus:ring-2 focus:ring-red-500 
                         focus:ring-offset-2 disabled:opacity-50 
                         transition-all duration-300 flex items-center 
                         justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Emergency Request...</span>
                  </>
                ) : (
                  <>
                    <Ambulance className="w-5 h-5" />
                    <span>Send Emergency Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyButton;