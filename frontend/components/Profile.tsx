"use client"
import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Bell, Calendar, Activity, Heart, FileText, AlertCircle, ChevronRight, Mail, Phone, MapPin, Edit, UserPlus, Stethoscope, Pill, Hospital, Shield, Briefcase } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '@/Redux/LoginSlice';
import { useRouter } from 'next/navigation';
import { toast } from "@/components/hooks/use-toast";
import { Alert, AlertDescription } from './ui/alert';
import Image from 'next/image';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface MedicalHistory {
  conditions: string[];
  allergies: string[];
  medications: string[];
  surgeries: string[];
  familyHistory: string[];
  bloodType: string;
  height: string;
  weight: string;
  bmi: number;
  chronicConditions: string[];
  mentalHealth: string[];
}

interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  expiryDate: string;
  coverageType: string;
  deductible: number;
}

interface Lifestyle {
  smoking: boolean;
  alcohol: boolean;
  exercise: string;
  diet: string;
  sleepHours: number;
  stressLevel: string;
  occupation: string;
  hobbies: string[];
}

interface BasicInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  phoneNumber: string;
  email: string;
  bloodGroup: string;
  maritalStatus: string;
  nationality: string;
}

interface ProfileInfo {
  basic: BasicInfo;
  address: Address;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory;
  insuranceInfo: InsuranceInfo;
  lifestyle: Lifestyle;
  lastCheckup: string;
  vaccinations: string[];
  preferredLanguage: string;
  communicationPreferences: string[];
}

type EditableSection = keyof ProfileInfo;

type EditData = {
  [K in EditableSection]: ProfileInfo[K];
}[EditableSection];

const emptyProfile: ProfileInfo = {
  basic: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: 0,
    gender: '',
    phoneNumber: '',
    email: '',
    bloodGroup: '',
    maritalStatus: '',
    nationality: ''
  },
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: ''
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  },
  medicalHistory: {
    conditions: [],
    allergies: [],
    medications: [],
    surgeries: [],
    familyHistory: [],
    bloodType: '',
    height: '',
    weight: '',
    bmi: 0,
    chronicConditions: [],
    mentalHealth: []
  },
  insuranceInfo: {
    provider: '',
    policyNumber: '',
    groupNumber: '',
    expiryDate: '',
    coverageType: '',
    deductible: 0
  },
  lifestyle: {
    smoking: false,
    alcohol: false,
    exercise: '',
    diet: '',
    sleepHours: 0,
    stressLevel: '',
    occupation: '',
    hobbies: []
  },
  lastCheckup: '',
  vaccinations: [],
  preferredLanguage: '',
  communicationPreferences: []
};

const ProfileComponent: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(emptyProfile);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editSection, setEditSection] = useState<EditableSection | ''>('');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [tempEditData, setTempEditData] = useState<EditData>({} as EditData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const mockData = await getMockProfileData();
        setProfileInfo(mockData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile data';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadProfileData();
  }, []);

  useEffect(() => {
    const calculateProfileCompletion = () => {
      let totalFields = 0;
      let filledFields = 0;

      const countFields = (obj: any) => {
        Object.entries(obj).forEach(([_, value]) => {
          if (typeof value === 'object' && value !== null) {
            if (!Array.isArray(value)) {
              countFields(value);
            } else {
              totalFields++;
              if (value.length > 0) filledFields++;
            }
          } else {
            totalFields++;
            if (value !== '' && value !== null && value !== undefined && value !== false && value !== 0) {
              filledFields++;
            }
          }
        });
      };

      countFields(profileInfo);
      setProfileCompletion((filledFields / totalFields) * 100);
    };

    calculateProfileCompletion();
  }, [profileInfo]);

  const getMockProfileData = async (): Promise<ProfileInfo> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (Math.random() > 0.8) {
      throw new Error('Random error simulation');
    }

    return {
      basic: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: '1992-07-15',
        age: 31,
        gender: 'Female',
        phoneNumber: '(555) 123-4567',
        email: 'sarah.johnson@email.com',
        bloodGroup: 'O+',
        maritalStatus: 'Single',
        nationality: 'American'
      },
      address: {
        street: '123 Health Street',
        city: 'Wellness City',
        state: 'CA',
        zipCode: '90210'
      },
      emergencyContact: {
        name: 'John Johnson',
        relationship: 'Brother',
        phone: '(555) 987-6543'
      },
      medicalHistory: {
        conditions: ['Asthma', 'Seasonal Allergies'],
        allergies: ['Pollen', 'Penicillin'],
        medications: ['Albuterol', 'Zyrtec'],
        surgeries: ['Appendectomy (2015)'],
        familyHistory: ['Heart Disease', 'Diabetes'],
        bloodType: 'O+',
        height: '5\'6"',
        weight: '135 lbs',
        bmi: 21.8,
        chronicConditions: ['Mild Asthma'],
        mentalHealth: ['None']
      },
      insuranceInfo: {
        provider: 'Blue Cross',
        policyNumber: 'BC123456789',
        groupNumber: 'GRP987654',
        expiryDate: '2024-12-31',
        coverageType: 'HMO',
        deductible: 1500
      },
      lifestyle: {
        smoking: false,
        alcohol: false,
        exercise: 'Regular - 3 times per week',
        diet: 'Balanced',
        sleepHours: 7.5,
        stressLevel: 'Moderate',
        occupation: 'Teacher',
        hobbies: ['Yoga', 'Reading', 'Hiking']
      },
      lastCheckup: '2023-11-15',
      vaccinations: ['COVID-19', 'Flu (2023)', 'HPV'],
      preferredLanguage: 'English',
      communicationPreferences: ['Email', 'Phone']
    };
  };

  const handleLogout = () => {
    dispatch(setIsLoggedIn(false));
    router.push('/login');
  };

  const handleEditSection = (section: EditableSection) => {
    setEditSection(section);
    setTempEditData(profileInfo[section]);
    setShowEditDialog(true);
  };

  const handleInputChange = <T extends keyof EditData>(
    field: T | string,
    value: EditData[T] | string
  ) => {
    setTempEditData(prev => {
      const updatedData = prev ;
      if (typeof field === 'string') {
        (updatedData as any)[field] = value;
      }
      return updatedData;
    });
  };

  const handleSaveEdit = async () => {
    if (!editSection) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileInfo(prev => ({
        ...prev,
        [editSection]: tempEditData
      }));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a valid image file (JPEG, PNG, or GIF)",
        variant: "destructive"
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderEditFields = () => {
    switch(editSection) {
      case 'basic':
        const basicData = tempEditData as BasicInfo;
        return (
          <div className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input 
                value={basicData?.firstName || ''} 
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                aria-label="First Name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input 
                value={basicData?.lastName || ''} 
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                aria-label="Last Name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={basicData?.email || ''} 
                onChange={(e) => handleInputChange('email',e.target.value)}
                aria-label="Email"
              />
            </div>
            <div>
              <Label>Blood Group</Label>
              <Input 
                value={basicData?.bloodGroup || ''} 
                onChange={(e) => handleInputChange('bloodGroup',e.target.value)}
                aria-label="Blood Group"
              />
            </div>
            <div>
              <Label>Age</Label>
              <Input 
                type="number"
                value={basicData?.age || 0} 
                onChange={(e) => handleInputChange('age', e.target.value)}
                aria-label="Age"
              />
            </div>
            <div>
              <Label>Marital Status</Label>
              <Input 
                value={basicData?.maritalStatus || ''} 
                onChange={(e) => handleInputChange('maritalStatus',e.target.value)}
                aria-label="Marital Status"
              />
            </div>
            <div>
              <Label>Nationality</Label>
              <Input 
                value={basicData?.nationality || ''} 
                onChange={(e) => handleInputChange('nationality',e.target.value)}
                aria-label="Nationality"
              />
            </div>
          </div>
        );
      case 'address':
        const addressData = tempEditData as Address;
        return (
          <div className="space-y-4">
            <div>
              <Label>Street</Label>
              <Input 
                value={addressData?.street || ''} 
                onChange={(e) => handleInputChange('street', e.target.value)}
                aria-label="Street"
              />
            </div>
            <div>
              <Label>City</Label>
              <Input 
                value={addressData?.city || ''} 
                onChange={(e) => handleInputChange('city', e.target.value)}
                aria-label="City"
              />
            </div>
            <div>
              <Label>State</Label>
              <Input 
                value={addressData?.state || ''} 
                onChange={(e) => handleInputChange('state', e.target.value)}
                aria-label="State"
              />
            </div>
            <div>
              <Label>Zip Code</Label>
              <Input 
                value={addressData?.zipCode || ''} 
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                aria-label="Zip Code"
              />
            </div>
          </div>
        );
      // Add cases for other sections as needed
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.ico" alt="Medico Logo" width={40} height={40} />
            <h1 className="text-3xl font-bold text-teal-700">Medico</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex gap-6">
            <div className="w-72 bg-white rounded-lg shadow-lg p-6 h-[calc(100vh-2rem)] sticky top-4">
              <div className="mb-8 text-center">
                <div className="relative mx-auto w-32 h-32 mb-4 group">
                  <Avatar className="w-32 h-32 border-4 border-teal-100">
                    <AvatarImage src="/avatar-placeholder.png" alt={`${profileInfo.basic.firstName} ${profileInfo.basic.lastName}`} />
                    <AvatarFallback className="text-2xl bg-teal-100 text-teal-700">
                      {profileInfo.basic.firstName[0]}{profileInfo.basic.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-teal-500/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Label htmlFor="profile-picture" className="cursor-pointer">
                      <Edit className="w-6 h-6 text-white" />
                      <Input 
                        id="profile-picture" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                      />
                    </Label>
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-teal-500/40 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1 text-teal-800">
                  {`${profileInfo.basic.firstName} ${profileInfo.basic.lastName}`}
                </h3>
                <p className="text-teal-600 mb-2">{profileInfo.basic.email}</p>
                <Badge variant="outline" className="mb-4 bg-teal-50 text-teal-700">
                  {profileInfo.lifestyle.occupation}
                </Badge>
                
                <div className="mb-4">
                  <Progress value={profileCompletion} className="h-2 bg-teal-100"/>
                  <p className="text-sm text-teal-600 mt-2">Profile Completion: {Math.round(profileCompletion)}%</p>
                </div>
              </div>
            
              <div className="pt-4 border-t mt-4">
                <Button variant="destructive" className="w-full bg-red-500 hover:bg-red-600" onClick={() => setShowLogoutDialog(true)}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <Card className="border-teal-100">
                <CardHeader className="bg-teal-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-teal-800">Basic Information</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleEditSection('basic')} className="text-teal-600 border-teal-600 hover:bg-teal-50" aria-label="Edit Basic Information">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>First Name</Label>
                    <p>{profileInfo.basic.firstName}</p>
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <p>{profileInfo.basic.lastName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{profileInfo.basic.email}</p>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <p>{profileInfo.basic.phoneNumber}</p>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <p>{profileInfo.basic.age}</p>
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <p>{profileInfo.basic.bloodGroup}</p>
                  </div>
                  <div>
                    <Label>Marital Status</Label>
                    <p>{profileInfo.basic.maritalStatus}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p>{profileInfo.basic.nationality}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to log in again to access your profile.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-teal-600 text-teal-600">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-teal-600 hover:bg-teal-700">Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-teal-800">Edit {editSection}</DialogTitle>
            </DialogHeader>
            {renderEditFields()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-teal-600 text-teal-600">Cancel</Button>
              <Button onClick={handleSaveEdit} className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfileComponent;