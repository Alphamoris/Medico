export interface SignupFormData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }

export interface LoginFormData{
    email : string ;
    password : string
}

export interface BearerToken {
    access_token : string ;
    token_type : string
}

export interface Coordinates {
    latitude: number;
    longitude: number;
  }

 export interface Medicine {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    description?: string;
    dosage?: string;
    requires_prescription: boolean;
    rating?: number;
    reviews?: number;
    discount?: number;
    expiry?: string;
    manufacturer?: string;
  }
  
export  interface CartItem extends Medicine {
    quantity: number;
  }
  
export interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
  }
  
  
export interface Appointment {
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    meetingType: 'online' | 'offline';
    roomCode?: string;
    roomPassword?: string;
  }

export interface FormData {
    name: string;
    phone: string;
    location: string;
    coordinates: Coordinates | null;
    emergencyType: 'medical' | 'accident' | 'other';
    additionalNotes: string;
    timestamp : string | null ;
  }
  
export interface EmergencyResponse {
    success: boolean;
    estimatedTime: number;
    emergencyId?: string;
    nearestHospital?: string;
  }
  

export interface Room {
    id: string;
    name: string;
    password: string;
    createdTime: string;
    createdDate: string;
    participants: number;
    quality: string;
    isPrivate: boolean;
    maxParticipants: number;
    dataUsage?: string;
    joinCode: string;
    lastActivity?: Date;
  }
  
export interface DecodedToken {
    exp: number;
    u_id: number;
  }
  
export interface RoomData {
    join_code: number;
    password: string;
    room_name: string;
    date: string;
    time: string;
  }
  
export interface RoomState {
    joinCode: string;
    password: string;
  }
  

export  interface Author {
    id: string;
    name: string;
    avatar: string;
    role: string;
    verified: boolean;
  }
  
export  interface Comment {
    id: string;
    author: Author;
    content: string;
    timestamp: string;
    likes: number;
  }
  
export  interface Post {
    id: string;
    author: Author;
    content: string;
    timestamp: string;
    likes: number;
    liked: boolean;
    comments: Comment[];
    shares: number;
    tags: string[];
    readTime: string;
    trending: boolean;
    image?: string;
    completedTime?: string; 
  }
  



export interface Doctor {
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

export interface DoctorCardProps {
    doctor: Doctor;
  }



export interface SocialLink {
    icon: React.ReactNode;
    href: string;
    label: string;
  }
  
export  interface QuickLink {
    label: string;
    href: string;
  }
  
export  interface ServiceLink {
    label: string;
    href: string;
  }

export  interface TestimonialProps {
    quote: string;
    author: string;
    role: string;
    image?: string;
  }
  
export    interface FeatureProps {
    Icon: React.ElementType;
    title: string;
    description: string;
  }
  
export  interface AnimatedCounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
  }
  
