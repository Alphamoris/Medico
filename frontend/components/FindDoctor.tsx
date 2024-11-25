"use client"
import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { getDoctors } from '@/apilib/ApiGet';

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
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        
        // Transform the API data to match our interface
        const transformedData = data.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          speciality: doc.speciality,
          rating: doc.rating,
          reviews: doc.reviews,
          experience: doc.experience,
          image: doc.image,
          nextAvailable: doc.next_available,
          location: doc.location,
          patients: doc.patients,
          education: doc.education,
          languages: doc.languages.map((lang: string) => ({ 
            id: lang.toLowerCase(),
            name: lang 
          })),
          consultationFee: doc.consultation_fee,
          availability: doc.availability,
          verified: doc.verified,
          awards: doc.awards,
          bio: doc.bio,
          timeSlots: {
            morning: doc.time_slots
              .filter((time: string) => parseInt(time) < 12)
              .map((time: string) => ({
                time,
                available: true
              })),
            evening: doc.time_slots
              .filter((time: string) => parseInt(time) >= 12)
              .map((time: string) => ({
                time,
                available: true
              }))
          },
          specializations: doc.specializations,
          insuranceAccepted: doc.insurance_accepted,
          hospitalAffiliations: doc.hospital_affiliations
        }));

        setDoctors(transformedData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to fetch doctors data');
      }
    };

    fetchDoctors();
  }, []);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPatientNotes(e.target.value);
  }, []);

  const nextFourteenDays = useMemo(() => 
    Array.from({length: 14}, (_, i) => addDays(new Date(), i)),
    []
  );

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


// INSERT INTO doctors (name, speciality, rating, reviews, experience, image, next_available, location, patients, education, languages, consultation_fee, availability, verified, awards, bio, time_slots, specializations, insurance_accepted, hospital_affiliations) VALUES
// ('Dr. Benjamin Foster', 'Cardiologist', 4.9, 425, '22 years', '/logo.ico', 'Today', 'Cleveland Clinic', '5000+', 'MD - Cardiology, Yale School of Medicine', ARRAY['English', 'German'], 450.00, ARRAY['Mon', 'Wed', 'Thu'], true, 8, 'Pioneer in advanced cardiac imaging and minimally invasive procedures. Former Chief of Cardiology at Mayo Clinic.', ARRAY['08:00', '10:00', '14:00', '16:00'], ARRAY['Interventional Cardiology', 'Advanced Heart Failure', 'Cardiac Imaging'], ARRAY['Blue Cross', 'Aetna', 'United Healthcare', 'Cigna'], ARRAY['Cleveland Clinic', 'Johns Hopkins']),

// ('Dr. Alexandra Chen', 'Neurologist', 4.95, 380, '20 years', '/logo.ico', 'Tomorrow', 'Massachusetts General Hospital', '4500+', 'MD - Neurology, Harvard Medical School', ARRAY['English', 'Mandarin', 'French'], 500.00, ARRAY['Tue', 'Thu', 'Fri'], true, 6, 'Leading researcher in neurodegenerative diseases. Published over 100 peer-reviewed papers.', ARRAY['09:00', '11:00', '15:00', '17:00'], ARRAY['Movement Disorders', 'Neurodegenerative Diseases', 'Neuro-oncology'], ARRAY['Blue Shield', 'Medicare', 'Humana'], ARRAY['Mass General', 'Brigham and Women''s Hospital']),

// ('Dr. Victoria Reynolds', 'Pediatrician', 4.9, 520, '18 years', '/logo.ico', 'Today', 'Boston Children''s Hospital', '6000+', 'MD - Pediatrics, Stanford University', ARRAY['English', 'Spanish'], 350.00, ARRAY['Mon', 'Tue', 'Wed', 'Fri'], true, 5, 'Specializes in pediatric developmental disorders. Former president of American Academy of Pediatrics.', ARRAY['08:30', '10:30', '14:30', '16:30'], ARRAY['Developmental Pediatrics', 'Behavioral Health', 'Chronic Disease Management'], ARRAY['Aetna', 'United Healthcare', 'Cigna'], ARRAY['Boston Children''s Hospital', 'Dana-Farber Cancer Institute']),

// ('Dr. Richard Martinez', 'Orthopedic', 4.95, 450, '25 years', '/logo.ico', 'Next Week', 'Hospital for Special Surgery', '4800+', 'MD - Orthopedic Surgery, Johns Hopkins', ARRAY['English', 'Spanish'], 600.00, ARRAY['Mon', 'Wed', 'Thu'], true, 7, 'Pioneering surgeon in joint replacement. Team physician for multiple professional sports teams.', ARRAY['07:30', '09:30', '13:30', '15:30'], ARRAY['Sports Medicine', 'Joint Replacement', 'Spine Surgery'], ARRAY['Blue Cross', 'Cigna', 'Oxford'], ARRAY['HSS', 'NewYork-Presbyterian']),

// ('Dr. Sarah Thompson', 'Dermatologist', 4.85, 390, '16 years', '/logo.ico', 'Tomorrow', 'Stanford Dermatology Center', '3500+', 'MD - Dermatology, University of Pennsylvania', ARRAY['English'], 400.00, ARRAY['Tue', 'Thu', 'Fri'], true, 4, 'Leading expert in melanoma treatment and cosmetic dermatology. NIH-funded researcher.', ARRAY['09:00', '11:00', '14:00', '16:00'], ARRAY['Skin Cancer', 'Cosmetic Dermatology', 'Laser Surgery'], ARRAY['Aetna', 'Blue Shield', 'United Healthcare'], ARRAY['Stanford Hospital', 'UCSF Medical Center']),

// ('Dr. James Harrison', 'Cardiologist', 4.9, 480, '24 years', '/logo.ico', 'Today', 'Mount Sinai Heart', '5500+', 'MD - Cardiology, Columbia University', ARRAY['English', 'Italian'], 475.00, ARRAY['Mon', 'Wed', 'Fri'], true, 9, 'Renowned expert in structural heart disease. Pioneer in TAVR procedures.', ARRAY['08:00', '10:00', '13:00', '15:00'], ARRAY['Structural Heart Disease', 'Interventional Cardiology', 'Heart Failure'], ARRAY['Empire', 'United Healthcare', 'Aetna'], ARRAY['Mount Sinai', 'NYU Langone']),

// ('Dr. Michelle Park', 'Neurologist', 4.85, 360, '19 years', '/logo.ico', 'Tomorrow', 'UCSF Medical Center', '4000+', 'MD - Neurology, Stanford University', ARRAY['English', 'Korean'], 450.00, ARRAY['Tue', 'Thu', 'Fri'], true, 5, 'Specializes in multiple sclerosis and neuroimmunology. Leading clinical researcher.', ARRAY['09:30', '11:30', '14:30', '16:30'], ARRAY['Multiple Sclerosis', 'Neuroimmunology', 'Headache Medicine'], ARRAY['Blue Shield', 'Anthem', 'United Healthcare'], ARRAY['UCSF Medical Center', 'Stanford Hospital']),

// ('Dr. Robert Williams', 'Orthopedic', 4.9, 410, '21 years', '/logo.ico', 'Next Week', 'Mayo Clinic', '4200+', 'MD - Orthopedic Surgery, Duke University', ARRAY['English'], 550.00, ARRAY['Mon', 'Tue', 'Thu'], true, 6, 'Internationally recognized spine surgeon. Developer of minimally invasive techniques.', ARRAY['08:00', '10:00', '14:00', '16:00'], ARRAY['Spine Surgery', 'Minimally Invasive Surgery', 'Complex Reconstruction'], ARRAY['Blue Cross', 'United Healthcare', 'Medica'], ARRAY['Mayo Clinic', 'Methodist Hospital']),

// ('Dr. Emily Anderson', 'Pediatrician', 4.95, 490, '17 years', '/logo.ico', 'Today', 'Nationwide Children''s Hospital', '5800+', 'MD - Pediatrics, Washington University', ARRAY['English', 'French'], 375.00, ARRAY['Mon', 'Wed', 'Thu', 'Fri'], true, 4, 'Expert in pediatric critical care. Published author on childhood development.', ARRAY['08:30', '10:30', '13:30', '15:30'], ARRAY['Critical Care', 'Neonatal Care', 'Emergency Medicine'], ARRAY['Anthem', 'United Healthcare', 'Cigna'], ARRAY['Nationwide Children''s', 'Ohio State Medical Center']),

// ('Dr. Daniel Kim', 'Dermatologist', 4.9, 370, '18 years', '/logo.ico', 'Tomorrow', 'UCLA Dermatology', '3800+', 'MD - Dermatology, Harvard Medical School', ARRAY['English', 'Korean', 'Spanish'], 425.00, ARRAY['Tue', 'Wed', 'Fri'], true, 5, 'Leading authority in ethnic skin care and advanced laser treatments. UCLA Clinical Professor.', ARRAY['09:00', '11:00', '14:00', '16:00'], ARRAY['Cosmetic Dermatology', 'Laser Surgery', 'Ethnic Skin Care'], ARRAY['Blue Shield', 'Cigna', 'Kaiser'], ARRAY['UCLA Medical Center', 'Cedars-Sinai']);
