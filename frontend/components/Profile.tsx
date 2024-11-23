"use client"
import React, { useState } from 'react';
import { User, Settings, LogOut, Bell, Edit, AlertCircle, Calendar, Activity, Heart, FileText, Pill, Stethoscope, ClipboardList } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from 'next/image';

interface MedicalInfo {
  allergies: string[];
  medications: string[];
  conditions: string[];
  bloodType: string;
  height: string;
  weight: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  vaccinations: string[];
  lastCheckup: string;
  insuranceInfo: {
    provider: string;
    policyNumber: string;
  };
}

const toggleSwitch = (setter: { (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }, currentState: boolean) => {
  setter(!currentState);
};

const initialMedicalInfo: MedicalInfo = {
  allergies: [],
  medications: [],
  conditions: [],
  bloodType: '',
  height: '',
  weight: '',
  emergencyContact: {
    name: '',
    phone: '',
    relation: ''
  },
  vaccinations: [],
  lastCheckup: '',
  insuranceInfo: {
    provider: '',
    policyNumber: ''
  }
};

const ProfileComponent = () => {
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [healthTracking, setHealthTracking] = useState(false);
  const [telemedicineEnabled, setTelemedicineEnabled] = useState(false);
  const [isLoggedIn] = useState(true);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>(initialMedicalInfo);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    lastVisit: "2024-03-15",
    medicalHistory: false,
    profileComplete: 40,
    healthScore: 85,
    appointments: [
      { date: '2024-04-01', doctor: 'Dr. Smith', type: 'General Checkup', virtual: false },
      { date: '2024-04-15', doctor: 'Dr. Johnson', type: 'Dental Cleaning', virtual: true }
    ],
    recentActivities: [
      { date: '2024-03-20', type: 'Blood Test', status: 'Completed' },
      { date: '2024-03-18', type: 'Prescription Renewal', status: 'Pending' },
      { date: '2024-03-15', type: 'Vaccination', status: 'Completed' }
    ],
    vitals: {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6',
      oxygenLevel: '98'
    }
  });

  const calculateProfileCompletion = (medInfo: MedicalInfo) => {
    let totalFields = 0;
    let completedFields = 0;

    // Check arrays
    if (medInfo.allergies.length > 0) completedFields++;
    if (medInfo.medications.length > 0) completedFields++;
    if (medInfo.conditions.length > 0) completedFields++;
    if (medInfo.vaccinations.length > 0) completedFields++;
    totalFields += 4;

    // Check strings
    if (medInfo.bloodType) completedFields++;
    if (medInfo.height) completedFields++;
    if (medInfo.weight) completedFields++;
    if (medInfo.lastCheckup) completedFields++;
    totalFields += 4;

    // Check emergency contact
    if (medInfo.emergencyContact.name) completedFields++;
    if (medInfo.emergencyContact.phone) completedFields++;
    if (medInfo.emergencyContact.relation) completedFields++;
    totalFields += 3;

    // Check insurance info
    if (medInfo.insuranceInfo.provider) completedFields++;
    if (medInfo.insuranceInfo.policyNumber) completedFields++;
    totalFields += 2;

    const percentage = Math.round((completedFields / totalFields) * 100);

    setUser(prev => ({
      ...prev,
      profileComplete: percentage,
      medicalHistory: percentage === 100
    }));

    return percentage;
  };

  const handleMedicalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedMedicalInfo = {
      ...medicalInfo,
      allergies: formData.get('allergies')?.toString().split(',').filter(Boolean) || [],
      medications: formData.get('medications')?.toString().split(',').filter(Boolean) || [],
      conditions: formData.get('conditions')?.toString().split(',').filter(Boolean) || [],
      bloodType: formData.get('bloodType')?.toString() || '',
      height: formData.get('height')?.toString() || '',
      weight: formData.get('weight')?.toString() || '',
      emergencyContact: {
        name: formData.get('emergencyName')?.toString() || '',
        phone: formData.get('emergencyPhone')?.toString() || '',
        relation: formData.get('emergencyRelation')?.toString() || ''
      },
      vaccinations: formData.get('vaccinations')?.toString().split(',').filter(Boolean) || [],
      lastCheckup: formData.get('lastCheckup')?.toString() || '',
      insuranceInfo: {
        provider: formData.get('insuranceProvider')?.toString() || '',
        policyNumber: formData.get('policyNumber')?.toString() || ''
      }
    };

    setMedicalInfo(updatedMedicalInfo);
    const completionPercentage = calculateProfileCompletion(updatedMedicalInfo);
    
    if (completionPercentage === 100) {
      alert('Medical profile completed successfully!');
    }
    
    setShowMedicalForm(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Image width={50} height={50} src={"/logo.ico"} alt='logo' className="w-8 h-8 rounded-full"></Image>
            <span className="text-2xl font-bold text-transparent text-teal-600 bg-clip-text bg-gradient-to-r from-teal-500 via-teal-400 to-teal-600">Medico</span>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Please Log In</CardTitle>
              <CardDescription>
                You need to be logged in to view your profile
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Image width={50} height={50} src={"/logo.ico"} alt='logo' className="w-8 h-8 rounded-full"></Image>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-teal-400 to-teal-600">Medico</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-teal-600 cursor-pointer hover:text-teal-700" />
            <LogOut className="w-6 h-6 text-teal-600 cursor-pointer hover:text-teal-700" />
          </div>
        </div>

        {/* Main Profile Section */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column - Profile Overview */}
          <div className="md:col-span-3">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-teal-600">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
                      <User className="w-12 h-12 text-teal-600" />
                    </div>
                    <button aria-label='edit' className="absolute bottom-0 right-0 bg-teal-600 p-1 rounded-full text-white hover:bg-teal-700">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="mt-4 font-semibold text-lg text-teal-700">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>

                  <div className="w-full mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-teal-600">Profile Completion</span>
                      <span className="text-teal-600">{user.profileComplete}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${user.profileComplete}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-teal-600">
                      <Activity className="w-4 h-4" />
                      <span>Last Active: Today</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-teal-600">
                      <Heart className="w-4 h-4" />
                      <span>Health Score: {user.healthScore}/100</span>
                    </div>
                  </div>

                  {/* Vital Signs Section */}
                  <div className="w-full mt-6 p-4 bg-teal-50 rounded-lg">
                    <h4 className="font-medium text-teal-700 mb-3">Current Vitals</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Blood Pressure:</span>
                        <span className="text-teal-600">{user.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Heart Rate:</span>
                        <span className="text-teal-600">{user.vitals.heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Temperature:</span>
                        <span className="text-teal-600">{user.vitals.temperature}°F</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Oxygen Level:</span>
                        <span className="text-teal-600">{user.vitals.oxygenLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Medical Information */}
          <div className="md:col-span-6 space-y-6">
            {!user.medicalHistory && (
              <Alert variant="default" className="border-teal-600 bg-teal-50">
                <AlertCircle className="h-4 w-4 text-teal-600" />
                <AlertTitle className="text-teal-600">Update Required</AlertTitle>
                <AlertDescription>
                  Please update your medical history to help us provide better care.
                </AlertDescription>
              </Alert>
            )}

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-teal-600">Medical Information</CardTitle>
                <CardDescription>
                  Manage your health information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={showMedicalForm} onOpenChange={setShowMedicalForm}>
                  <DialogTrigger asChild>
                    <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 mb-4">
                      Update Medical Information
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-white p-6 rounded-lg">
                    <DialogHeader>
                      <DialogTitle>Update Medical Information</DialogTitle>
                      <DialogDescription>
                        Please provide your medical details below
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleMedicalInfoSubmit} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Allergies</label>
                          <input
                            name="allergies"
                            className="w-full p-2 border rounded"
                            placeholder="Separate with commas"
                            defaultValue={medicalInfo.allergies.join(',')}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Blood Type</label>
                          <select aria-label='blood-type' name="bloodType" className="w-full p-2 border rounded" defaultValue={medicalInfo.bloodType}>
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Height</label>
                          <input
                            name="height"
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Height in cm"
                            defaultValue={medicalInfo.height}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Weight</label>
                          <input
                            name="weight"
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Weight in kg"
                            defaultValue={medicalInfo.weight}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Current Medications</label>
                        <input
                          name="medications"
                          className="w-full p-2 border rounded"
                          placeholder="Separate with commas"
                          defaultValue={medicalInfo.medications.join(',')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Medical Conditions</label>
                        <input
                          name="conditions"
                          className="w-full p-2 border rounded"
                          placeholder="Separate with commas"
                          defaultValue={medicalInfo.conditions.join(',')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Vaccinations</label>
                        <input
                          name="vaccinations"
                          className="w-full p-2 border rounded"
                          placeholder="Separate with commas"
                          defaultValue={medicalInfo.vaccinations.join(',')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Last Checkup Date</label>
                        <input
                          name="lastCheckup"
                          type="date"
                          className="w-full p-2 border rounded"
                          defaultValue={medicalInfo.lastCheckup}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Insurance Provider</label>
                          <input
                            name="insuranceProvider"
                            className="w-full p-2 border rounded"
                            placeholder="Provider name"
                            defaultValue={medicalInfo.insuranceInfo.provider}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Policy Number</label>
                          <input
                            name="policyNumber"
                            className="w-full p-2 border rounded"
                            placeholder="Policy number"
                            defaultValue={medicalInfo.insuranceInfo.policyNumber}
                          />
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Emergency Contact</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            name="emergencyName"
                            className="p-2 border rounded"
                            placeholder="Name"
                            defaultValue={medicalInfo.emergencyContact.name}
                          />
                          <input
                            name="emergencyPhone"
                            className="p-2 border rounded"
                            placeholder="Phone"
                            defaultValue={medicalInfo.emergencyContact.phone}
                          />
                          <input
                            name="emergencyRelation"
                            className="p-2 border rounded"
                            placeholder="Relation"
                            defaultValue={medicalInfo.emergencyContact.relation}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowMedicalForm(false)}
                          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-teal-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      <div>
                        <h4 className="font-medium text-teal-700">Next Appointment</h4>
                        <p className="text-sm text-teal-600">
                          {user.appointments[0]?.date} - {user.appointments[0]?.type}
                          {user.appointments[0]?.virtual && " (Virtual)"}
                        </p>
                      </div>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700">
                      View All
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-teal-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-teal-600" />
                      <div>
                        <h4 className="font-medium text-teal-700">Medical Records</h4>
                        <p className="text-sm text-teal-600">Last updated: {user.lastVisit}</p>
                      </div>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700">
                      Download
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-teal-600">Recent Activities</CardTitle>
                <CardDescription>Your latest health-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.recentActivities.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-teal-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-teal-600" />
                        <div>
                          <h4 className="font-medium text-teal-700">{activity.type}</h4>
                          <p className="text-sm text-teal-600">{activity.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${activity.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Preferences */}
          <div className="md:col-span-3">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-teal-600">Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Appointment Reminders Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-teal-600" />
                      <span className="text-sm">Appointment Reminders</span>
                    </div>
                    <div
                      className="relative inline-block w-12 h-6 transition-all duration-300 ease-in-out"
                      onClick={() => toggleSwitch(setAppointmentReminders, appointmentReminders)}
                    >
                      <input
                        type="checkbox"
                        checked={appointmentReminders}
                        readOnly
                        className="sr-only"
                      />
                      <div
                        className={`
                          w-12 h-6 rounded-full absolute top-0 left-0 cursor-pointer
                          ${appointmentReminders ? 'bg-teal-500' : 'bg-gray-300'}
                          transition-colors duration-300 ease-in-out
                        `}
                      />
                      <div
                        className={`
                          absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full 
                          transform transition-transform duration-300 ease-in-out
                          ${appointmentReminders ? 'translate-x-6' : 'translate-x-0'}
                        `}
                      />
                    </div>
                  </div>

                  {/* Email Notifications Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-teal-600" />
                      <span className="text-sm">Email Notifications</span>
                    </div>
                    <div
                      className="relative inline-block w-12 h-6 transition-all duration-300 ease-in-out"
                      onClick={() => toggleSwitch(setEmailNotifications, emailNotifications)}
                    >
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        readOnly
                        className="sr-only"
                      />
                      <div
                        className={`
                          w-12 h-6 rounded-full absolute top-0 left-0 cursor-pointer
                          ${emailNotifications ? 'bg-teal-500' : 'bg-gray-300'}
                          transition-colors duration-300 ease-in-out
                        `}
                      />
                      <div
                        className={`
                          absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full 
                          transform transition-transform duration-300 ease-in-out
                          ${emailNotifications ? 'translate-x-6' : 'translate-x-0'}
                        `}
                      />
                    </div>
                  </div>

                  {/* Health Tracking Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-teal-600" />
                      <span className="text-sm">Health Tracking</span>
                    </div>
                    <div
                      className="relative inline-block w-12 h-6 transition-all duration-300 ease-in-out"
                      onClick={() => toggleSwitch(setHealthTracking, healthTracking)}
                    >
                      <input
                        type="checkbox"
                        checked={healthTracking}
                        readOnly
                        className="sr-only"
                      />
                      <div
                        className={`
                          w-12 h-6 rounded-full absolute top-0 left-0 cursor-pointer
                          ${healthTracking ? 'bg-teal-500' : 'bg-gray-300'}
                          transition-colors duration-300 ease-in-out
                        `}
                      />
                      <div
                        className={`
                          absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full 
                          transform transition-transform duration-300 ease-in-out
                          ${healthTracking ? 'translate-x-6' : 'translate-x-0'}
                        `}
                      />
                    </div>
                  </div>

                  {/* Telemedicine Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-teal-600" />
                      <span className="text-sm">Telemedicine</span>
                    </div>
                    <div
                      className="relative inline-block w-12 h-6 transition-all duration-300 ease-in-out"
                      onClick={() => toggleSwitch(setTelemedicineEnabled, telemedicineEnabled)}
                    >
                      <input
                        type="checkbox"
                        checked={telemedicineEnabled}
                        readOnly
                        className="sr-only"
                      />
                      <div
                        className={`
                          w-12 h-6 rounded-full absolute top-0 left-0 cursor-pointer
                          ${telemedicineEnabled ? 'bg-teal-500' : 'bg-gray-300'}
                          transition-colors duration-300 ease-in-out
                        `}
                      />
                      <div
                        className={`
                          absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full 
                          transform transition-transform duration-300 ease-in-out
                          ${telemedicineEnabled ? 'translate-x-6' : 'translate-x-0'}
                        `}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium mb-4 text-teal-700">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Request Medical Records
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Schedule Appointment
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      View Health Report
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Prescription Refill
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" />
                      Lab Results
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;