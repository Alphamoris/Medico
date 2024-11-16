"use client"
import React, { useState } from 'react';
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
  X
} from 'lucide-react';

const DoctorShowcase = () => {
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('about');

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      speciality: "Cardiologist",
      rating: 4.9,
      reviews: 127,
      experience: "15+ years",
      image: "/logo.ico",
      nextAvailable: "Today",
      location: "New York Medical Center",
      patients: "2000+",
      education: "Harvard Medical School",
      languages: [
        { id: "1", name: "English" },
        { id: "2", name: "Spanish" }
      ],
      consultationFee: "$150",
      availability: ["Mon", "Wed", "Fri"],
      verified: true,
      awards: 3,
      bio: "Dr. Wilson is a board-certified cardiologist with extensive experience in treating complex cardiac conditions.",
      timeSlots: [
        { time: "9:00 AM", available: true },
        { time: "10:00 AM", available: false },
        { time: "11:00 AM", available: true },
        { time: "2:00 PM", available: true }
      ]
    },
    {
      id: 2,
      name: "Dr. James Chen",
      speciality: "Neurologist",
      rating: 4.8,
      reviews: 98,
      experience: "12+ years",
      image: "/logo.ico",
      nextAvailable: "Tomorrow",
      location: "Central Hospital",
      patients: "1500+",
      education: "Stanford Medical School",
      languages: [
        { id: "1", name: "English" },
        { id: "3", name: "Mandarin" }
      ],
      consultationFee: "$180",
      availability: ["Tue", "Thu", "Sat"],
      verified: true,
      awards: 2,
      bio: "Dr. Chen specializes in neurological disorders and innovative treatment approaches.",
      timeSlots: [
        { time: "9:00 AM", available: true },
        { time: "10:00 AM", available: true },
        { time: "11:00 AM", available: false },
        { time: "2:00 PM", available: true }
      ]
    }
  ];

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
    consultationFee: string;
    availability: string[];
    verified: boolean;
    awards: number;
    bio: string;
    timeSlots: Array<{ time: string; available: boolean }>;
  }
  
  interface DoctorCardProps {
    doctor: Doctor;
  }
  
  interface ModalProps {
    doctor: Doctor;
    onClose: () => void;
  }

  const specialities = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician'];

  const toggleFavorite = (doctorId: number): void => {
    setFavoriteIds((prev: number[]) => 
      prev.includes(doctorId)
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  const DoctorCard = ({ doctor } : DoctorCardProps | any) => (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-1"
      onClick={() => setSelectedDoctor(doctor)}
    >
      <div className="relative">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-72 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />
        <button 
         aria-label="button"
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(doctor.id);
          }}
        >
          <Heart 
            className={`w-5 h-5 ${
              favoriteIds.includes(doctor.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400" />
              <span>{doctor.awards} Awards</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">{doctor.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {doctor.name}
            </h3>
            {doctor.verified && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p className="text-blue-600 font-medium mt-1">{doctor.speciality}</p>
          <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{doctor.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center text-blue-700">
              <Users className="w-4 h-4 mr-2" />
              <span className="font-medium">{doctor.patients}</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">Patients</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl">
            <div className="flex items-center text-purple-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">{doctor.reviews}</span>
            </div>
            <p className="text-sm text-purple-600 mt-1">Reviews</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
            <div className="flex items-center text-green-700">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Next Available</span>
            </div>
            <span className="font-medium text-green-700">{doctor.nextAvailable}</span>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Book Now
            </button>
            <button aria-label="button" className="px-4 py-3 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-all duration-300">
              <Phone className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = ({ doctor , onClose } : ModalProps) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">{doctor.name}</h2>
          <button 
           aria-label="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-6 mb-8">
            <img 
              src={doctor.image} 
              alt={doctor.name}
              className="w-32 h-32 rounded-xl object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{doctor.name}</h3>
                {doctor.verified && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-blue-600 font-medium mb-2">{doctor.speciality}</p>
              <p className="text-gray-600">{doctor.bio}</p>
            </div>
          </div>

          <div className="flex gap-4 border-b mb-6">
            {['about', 'schedule', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors relative ${
                  activeTab === tab ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'about' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-medium mb-2">Education</h4>
                  <p className="text-gray-600">{doctor.education}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-medium mb-2">Consultation Fee</h4>
                  <p className="text-gray-600">{doctor.consultationFee}</p>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="grid grid-cols-2 gap-4">
                {doctor.timeSlots.map((slot: { available: any; time: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, i: React.Key | null | undefined) => (
                  <button
                    key={i}
                    disabled={!slot.available}
                    className={`p-4 rounded-xl text-left transition-all ${
                      slot.available
                        ? 'bg-white border-2 border-blue-200 hover:border-blue-600'
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={slot.available ? 'text-gray-900' : 'text-gray-400'}>
                        {slot.time}
                      </span>
                      {slot.available ? (
                        <span className="text-green-600 text-sm">Available</span>
                      ) : (
                        <span className="text-gray-400 text-sm">Booked</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t mt-6 p-4 flex gap-4">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
            <button aria-label="button" className="px-6 py-3 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
              <Video className="w-4 h-4 text-blue-600" />
            </button>
            <button aria-label="button" className="px-6 py-3 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 pt-14 ">
        <div className="text-center mb-3">
          <h1 className="text-5xl font-bold text-gray-800 mb-1">Find Your Perfect Doctor</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with top-rated healthcare professionals in your area
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, speciality, or location..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Sliders className="w-5 h-5" />
              Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {specialities.map((speciality) => (
              <button
                key={speciality}
                onClick={() => setSelectedSpeciality(speciality)}
                className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  selectedSpeciality === speciality
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {speciality}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {doctors
            .filter(doctor => 
              (selectedSpeciality === 'All' || doctor.speciality === selectedSpeciality) &&
              (searchQuery === '' || 
                doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
              )
            )
            .map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
        </div>

        {doctors.filter(doctor => 
          (selectedSpeciality === 'All' || doctor.speciality === selectedSpeciality) &&
          (searchQuery === '' || 
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
          )
        ).length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {selectedDoctor && (
        <Modal 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
      )}
    </div>
  );
};

export default DoctorShowcase;