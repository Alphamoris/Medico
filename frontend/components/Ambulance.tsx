"use client"
import React, { useState, useEffect } from 'react';
import { 
  Ambulance, 
  Clock,
  MapPin, 
  AlertCircle, 
  X, 
  Loader2, 
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

const EmergencyButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [needsDoctor, setNeedsDoctor] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [userLocation, setUserLocation] = useState('');
  const [pulseAnimation, setPulseAnimation] = useState(true);

  // Periodically toggle pulse animation for attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Get user's location on component mount and when modal opens
  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            const locationText = data.display_name || 'Location detected';
            setUserLocation(locationText);
            setFormData(prev => ({ ...prev, location: locationText }));
          } catch (error) {
            console.error('Error fetching location:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      getUserLocation();
    }
  }, [isOpen]);

  const calculateEstimatedTime = () => {
    // In a real application, this would use actual distance/traffic data
    const minTime = 5;
    const maxTime = 12;
    return Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call - replace with actual emergency service API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const estimatedMinutes = calculateEstimatedTime();
      setEstimatedTime(estimatedMinutes);
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setShowSuccess(false);
    setIsOpen(false);
    setNeedsDoctor(false);
    setEstimatedTime(null);
    setFormData({ name: '', phone: '', location: '' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 group bg-gradient-to-r 
                   from-red-500 to-red-600 text-white rounded-full shadow-lg 
                   hover:shadow-xl transition-all duration-300 transform 
                   hover:scale-105 ${pulseAnimation ? 'animate-pulse-strong' : ''}`}
      >
        {/* Ripple Effect */}
        <div className="absolute -inset-1 bg-red-500 rounded-full animate-ping opacity-20" />
        <div className="absolute -inset-2 bg-red-500 rounded-full animate-ping opacity-10 delay-150" />
        
        <div className="relative px-6 py-3 flex items-center space-x-2">
          <Ambulance className="w-6 h-6 animate-wiggle" />
          <span className="font-bold text-sm whitespace-nowrap">EMERGENCY AMBULANCE</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Ambulance className="w-6 h-6" />
              <h2 className="font-bold text-lg">Emergency Ambulance</h2>
            </div>
            <button
              onClick={() => !isSubmitting && handleReset()}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showSuccess ? (
          // Success Message with Doctor Option
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce-gentle" />
              <h3 className="font-bold text-lg text-gray-800">Ambulance Dispatched!</h3>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>Estimated arrival time: {estimatedTime} minutes</span>
              </div>
              <p className="text-gray-600 text-sm">
                Our emergency response team is on the way. Please ensure the entrance is accessible.
              </p>
            </div>

            {!needsDoctor && (
              <div className="border-t pt-4">
                <p className="text-gray-700 mb-3 text-center">
                  Do you need immediate medical consultation while waiting?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setNeedsDoctor(true)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 
                             text-white font-semibold py-2 px-4 rounded-lg 
                             hover:shadow-lg transition-all duration-300"
                  >
                    Connect to Doctor
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-100 text-gray-600 font-semibold 
                             py-2 px-4 rounded-lg hover:bg-gray-200 
                             transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {needsDoctor && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                  <span>Connecting to doctor...</span>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Please stay on this screen. A doctor will join the call shortly.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Booking Form
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">
                Our ambulances are equipped with advanced life support and typically arrive within 5-12 minutes.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 
                           text-sm disabled:opacity-50"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  disabled={isSubmitting}
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 
                           text-sm disabled:opacity-50"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Location
                </label>
                <div className="relative">
                  <textarea
                    required
                    disabled={isSubmitting}
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-red-500 focus:border-red-500 
                             text-sm disabled:opacity-50 min-h-[80px]"
                    placeholder="Detecting your location..."
                  />
                  <button
                    type="button"
                    aria-label='button'
                    onClick={getUserLocation}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 
                             rounded-full transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 
                       text-white font-semibold py-3 px-4 rounded-lg 
                       hover:shadow-lg transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       flex justify-center items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Dispatching Ambulance...</span>
                </>
              ) : (
                <>
                  <Ambulance className="w-5 h-5" />
                  <span>Send Emergency Ambulance</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Add required keyframes
const styles = `
  @keyframes bounce-gentle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes pulse-strong {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default EmergencyButton;