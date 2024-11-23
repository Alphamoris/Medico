"use client"
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Star,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Heart,
  Award,
  Users,
  MessageCircle,
  Search,
  Sliders,
  CheckCircle2,
  Video,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertCircle,
  Stethoscope,
  GraduationCap,
  Languages,
  Building,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isSameDay } from 'date-fns';
import toast from 'react-hot-toast';
import Image from 'next/image';

const FindDoctor = () => {
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{time: string, period: string} | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [patientNotes, setPatientNotes] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'in-person'>('in-person');

  // Memoize the notes change handler
  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPatientNotes(e.target.value);
  }, []);

  // Memoize next 14 days calculation
  const nextFourteenDays = useMemo(() => 
    Array.from({length: 14}, (_, i) => addDays(new Date(), i)),
    []
  );

  const doctors = useMemo(() => [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      speciality: "Cardiologist",
      rating: 4.8,
      reviews: 125,
      experience: "15 years",
      image: "/doctors/doctor1.jpg",
      nextAvailable: "Today",
      location: "New York Medical Center",
      patients: "2000+",
      education: "MD - Cardiology, MBBS",
      languages: [
        { id: "en", name: "English" },
        { id: "es", name: "Spanish" }
      ],
      consultationFee: 1500,
      availability: ["Mon", "Wed", "Fri"],
      verified: true,
      awards: 3,
      bio: "Experienced cardiologist specializing in preventive cardiology and heart disease management.",
      timeSlots: {
        morning: [
          { time: "09:00", available: true },
          { time: "10:00", available: false },
          { time: "11:00", available: true }
        ],
        evening: [
          { time: "16:00", available: true },
          { time: "17:00", available: true },
          { time: "18:00", available: false }
        ]
      },
      specializations: ["Interventional Cardiology", "Heart Failure"],
      insuranceAccepted: ["Blue Cross", "Aetna", "Cigna"],
      hospitalAffiliations: ["New York Medical Center", "City Hospital"]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      speciality: "Orthopedic Surgeon", 
      rating: 4.9,
      reviews: 180,
      experience: "12 years",
      image: "/doctors/doctor2.jpg",
      nextAvailable: "Tomorrow",
      location: "City Hospital",
      patients: "1500+",
      education: "MD - Orthopedics, MBBS",
      languages: [
        { id: "en", name: "English" },
        { id: "zh", name: "Chinese" }
      ],
      consultationFee: 2000,
      availability: ["Tue", "Thu", "Sat"],
      verified: true,
      awards: 2,
      bio: "Specialized in joint replacement surgery and sports medicine.",
      timeSlots: {
        morning: [
          { time: "09:30", available: true },
          { time: "10:30", available: true },
          { time: "11:30", available: false }
        ],
        evening: [
          { time: "15:30", available: false },
          { time: "16:30", available: true },
          { time: "17:30", available: true }
        ]
      },
      specializations: ["Joint Replacement", "Sports Medicine"],
      insuranceAccepted: ["United Healthcare", "Aetna"],
      hospitalAffiliations: ["City Hospital", "Sports Medicine Center"]
    }
  ], []);

  interface Doctor {
    id: number;
    name: string;
    speciality: string;
    rating: number;
    reviews: number;
    experience: string;
    image: string;
    nextAvailable: string;
    location: string;
    patients: string;
    education: string;
    languages: Array<{ id: string; name: string }>;
    consultationFee: number;
    availability: string[];
    verified: boolean;
    awards: number;
    bio: string;
    timeSlots: {
      morning: Array<{ time: string; available: boolean }>;
      evening: Array<{ time: string; available: boolean }>;
    };
    specializations: string[];
    insuranceAccepted: string[];
    hospitalAffiliations: string[];
  }

  interface DoctorCardProps {
    doctor: Doctor;
  }

  const toggleFavorite = useCallback((doctorId: number): void => {
    setFavoriteIds(prev => 
      prev.includes(doctorId)
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
  }, []);

  const sortDoctors = useCallback((doctors: Doctor[]) => {
    if (sortBy === 'price-low') {
      return [...doctors].sort((a, b) => a.consultationFee - b.consultationFee);
    } else if (sortBy === 'price-high') {
      return [...doctors].sort((a, b) => b.consultationFee - a.consultationFee);
    } else if (sortBy === 'rating') {
      return [...doctors].sort((a, b) => b.rating - a.rating);
    }
    return doctors;
  }, [sortBy]);

  const filterByTime = useCallback((doctors: Doctor[]) => {
    if (!timeFilter) return doctors;
    return doctors.filter(doctor => {
      const hasAvailableSlot = [...doctor.timeSlots.morning, ...doctor.timeSlots.evening]
        .some(slot => slot.available);
      return hasAvailableSlot;
    });
  }, [timeFilter]);

  const handleBooking = useCallback((doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
    setBookingStep(1);
  }, []);

  const BookingModal = React.memo(({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) => {
    const handleConfirmBooking = () => {
      if (!selectedSlot) return;
      
      toast.success(
        <div>
          <h3 className="font-bold">Booking Confirmed!</h3>
          <p>Appointment with {doctor.name}</p>
          <p>Date: {format(selectedDate, 'PPP')}</p>
          <p>Time: {selectedSlot.time}</p>
          <p>Type: {consultationType === 'video' ? 'Video Consultation' : 'In-person Visit'}</p>
          <p className="text-sm mt-2">Check your email for details</p>
        </div>,
        {
          duration: 5000,
          position: 'top-center',
        }
      );
      
      onClose();
      setBookingStep(1);
      setSelectedSlot(null);
      setPatientNotes('');
      setConsultationType('in-person');
    };

    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
                <p className="text-gray-600">Step {bookingStep} of 3</p>
              </div>
              <button aria-label="Close" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            {bookingStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl">
                  <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.speciality}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Select Consultation Type</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setConsultationType('video')}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        consultationType === 'video' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                      }`}
                    >
                      <Video className="w-6 h-6 text-teal-600" />
                      <span>Video Call</span>
                      <span className="text-sm text-gray-600">₹{doctor.consultationFee * 0.8}</span>
                    </button>
                    <button
                      onClick={() => setConsultationType('in-person')}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        consultationType === 'in-person' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                      }`}
                    >
                      <Users className="w-6 h-6 text-teal-600" />
                      <span>In-person</span>
                      <span className="text-sm text-gray-600">₹{doctor.consultationFee}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setBookingStep(2)}
                  className="w-full py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Select Date</h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {nextFourteenDays.map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 p-3 rounded-xl border-2 transition-all ${
                          isSameDay(selectedDate, date)
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-200'
                        }`}
                      >
                        <p className="text-sm font-medium">{format(date, 'EEE')}</p>
                        <p className="text-lg font-bold">{format(date, 'd')}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Available Slots</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Morning</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {doctor.timeSlots.morning.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot({ time: slot.time, period: 'morning' })}
                            className={`p-2 rounded-lg border-2 transition-all ${
                              selectedSlot?.time === slot.time && selectedSlot?.period === 'morning'
                                ? 'border-teal-500 bg-teal-50'
                                : slot.available
                                ? 'border-gray-200 hover:border-teal-200'
                                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Evening</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {doctor.timeSlots.evening.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot({ time: slot.time, period: 'evening' })}
                            className={`p-2 rounded-lg border-2 transition-all ${
                              selectedSlot?.time === slot.time && selectedSlot?.period === 'evening'
                                ? 'border-teal-500 bg-teal-50'
                                : slot.available
                                ? 'border-gray-200 hover:border-teal-200'
                                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => selectedSlot && setBookingStep(3)}
                    disabled={!selectedSlot}
                    className={`flex-1 px-6 py-3 rounded-xl text-white ${
                      selectedSlot ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-xl space-y-2">
                  <h4 className="font-semibold">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium">{format(selectedDate, 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-medium">{selectedSlot?.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-medium">{consultationType === 'video' ? 'Video Call' : 'In-person'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fee</p>
                      <p className="font-medium">₹{consultationType === 'video' ? doctor.consultationFee * 0.8 : doctor.consultationFee}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Please arrive 10 minutes before your appointment time. Bring any relevant medical records or test results.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  });

  const DoctorCard = React.memo<DoctorCardProps>(({ doctor }) => {
    const isFavorite = favoriteIds.includes(doctor.id);

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-xl object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                {doctor.verified && (
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                )}
              </div>
              <p className="text-gray-600">{doctor.speciality}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{doctor.rating}</span>
                <span className="text-gray-600">({doctor.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-teal-600" />
                <span className="text-gray-600">{doctor.patients} patients</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => toggleFavorite(doctor.id)}
            className={`p-2 rounded-full ${isFavorite ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Heart className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-600" />
              <div>
                <p className="text-sm text-gray-600">Education</p>
                <p className="font-medium">{doctor.education}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium">{doctor.experience}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <span className="font-medium">Specializations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {doctor.specializations.map((spec, index) => (
              <span key={index} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">{doctor.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-sm text-gray-600">Next Available</p>
              <p className="font-medium">{doctor.nextAvailable}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between p-4 bg-teal-50 rounded-xl">
          <div>
            <p className="text-sm text-gray-600">Consultation Fee</p>
            <p className="text-xl font-bold text-teal-700">₹{doctor.consultationFee}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleBooking(doctor)}
              className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors"
            >
              Book Appointment
            </button>
            <button aria-label="Chat with doctor" className="p-2 border-2 border-teal-600 rounded-xl hover:bg-teal-50 transition-colors">
              <MessageCircle className="w-5 h-5 text-teal-600" />
            </button>
          </div>
        </div>
      </div>
    );
  });

  const filteredDoctors = useMemo(() => 
    sortDoctors(filterByTime(doctors.filter(doctor => 
      (selectedSpeciality === 'All' || doctor.speciality === selectedSpeciality) &&
      (doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()))
    ))),
    [doctors, selectedSpeciality, searchQuery, sortDoctors, filterByTime]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <Image
              src="/logo.ico"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
            <p className="text-gray-600 mt-1 text-sm">Book appointments with the best doctors</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors, specialities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <button
              title="Filters"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Sliders className="w-5 h-5" />
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort by</label>
                    <select
                      title="Sort by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200"
                    >
                      <option value="">Relevance</option>
                      <option value="rating">Rating</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Availability</label>
                    <select
                      title="Availability"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200"
                    >
                      <option value="">Any time</option>
                      <option value="today">Available today</option>
                      <option value="tomorrow">Available tomorrow</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
        {['All', 'Cardiologist', 'Dermatologist', 'Orthopedic', 'Pediatrician', 'Neurologist'].map((speciality) => (
          <button
            key={speciality}
            onClick={() => setSelectedSpeciality(speciality)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedSpeciality === speciality
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {speciality}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {selectedDoctor && showBookingModal && (
        <BookingModal doctor={selectedDoctor} onClose={() => setShowBookingModal(false)} />
      )}
    </div>
  );
};

export default FindDoctor;
