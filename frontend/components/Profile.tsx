"use client"
import React, { useState } from 'react';
import { User, Settings, LogOut, Bell, Edit, AlertCircle, Calendar, Activity, Heart, FileText } from 'lucide-react';
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
  }
};

const ProfileComponent = () => {
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [healthTracking, setHealthTracking] = useState(false);
  const [isLoggedIn] = useState(true);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>(initialMedicalInfo);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    lastVisit: "2024-03-15",
    medicalHistory: false,
    profileComplete: 40,
    appointments: [
      { date: '2024-04-01', doctor: 'Dr. Smith', type: 'General Checkup' },
      { date: '2024-04-15', doctor: 'Dr. Johnson', type: 'Dental Cleaning' }
    ],
    recentActivities: [
      { date: '2024-03-20', type: 'Blood Test', status: 'Completed' },
      { date: '2024-03-18', type: 'Prescription Renewal', status: 'Pending' }
    ]
  });

  const calculateProfileCompletion = (medInfo: MedicalInfo) => {
    const fields = [
      medInfo.allergies.length > 0,
      medInfo.medications.length > 0,
      medInfo.conditions.length > 0,
      medInfo.bloodType,
      medInfo.height,
      medInfo.weight,
      medInfo.emergencyContact.name,
      medInfo.emergencyContact.phone,
      medInfo.emergencyContact.relation
    ];

    const completedFields = fields.filter(field => field).length;
    const percentage = Math.round((completedFields / fields.length) * 100);

    setUser(prev => ({
      ...prev,
      profileComplete: percentage,
      medicalHistory: percentage === 100
    }));
  };

  const handleMedicalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const updatedMedicalInfo = {
      ...medicalInfo,
      allergies: formData.get('allergies')?.toString().split(',') || [],
      medications: formData.get('medications')?.toString().split(',') || [],
      conditions: formData.get('conditions')?.toString().split(',') || [],
      bloodType: formData.get('bloodType')?.toString() || '',
      height: formData.get('height')?.toString() || '',
      weight: formData.get('weight')?.toString() || '',
      emergencyContact: {
        name: formData.get('emergencyName')?.toString() || '',
        phone: formData.get('emergencyPhone')?.toString() || '',
        relation: formData.get('emergencyRelation')?.toString() || ''
      }
    };

    setMedicalInfo(updatedMedicalInfo);
    calculateProfileCompletion(updatedMedicalInfo);
    setShowMedicalForm(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Image width={50} height={50} src={"/logo.ico"} alt='logo' className="w-8 h-8 rounded-full"></Image>
            <span className="text-2xl font-bold text-transparent text-teal-600 bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400  to-blue-600">Medico</span>
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Image width={50} height={50} src={"/logo.ico"} alt='logo' className="w-8 h-8 rounded-full"></Image>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400  to-blue-600">Medico</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-teal-600" />
            <LogOut className="w-6 h-6 text-gray-600 cursor-pointer hover:text-teal-600" />
          </div>
        </div>

        {/* Main Profile Section */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column - Profile Overview */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
                      <User className="w-12 h-12 text-teal-600" />
                    </div>
                    <button aria-label='fe' className="absolute bottom-0 right-0 bg-teal-600 p-1 rounded-full text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>

                  <div className="w-full mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span>{user.profileComplete}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${user.profileComplete}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Activity className="w-4 h-4" />
                      <span>Last Active: Today</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span>Health Score: 85/100</span>
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

            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
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
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Update Medical Information</DialogTitle>
                      <DialogDescription>
                        Please provide your medical details below
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleMedicalInfoSubmit} className="space-y-4">
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
                          <select aria-label='fe' name="bloodType" className="w-full p-2 border rounded" defaultValue={medicalInfo.bloodType}>
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
                          className="px-4 py-2 border rounded-lg"
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
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      <div>
                        <h4 className="font-medium">Next Appointment</h4>
                        <p className="text-sm text-gray-500">
                          {user.appointments[0]?.date} - {user.appointments[0]?.type}
                        </p>
                      </div>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700">
                      View All
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-teal-600" />
                      <div>
                        <h4 className="font-medium">Medical Records</h4>
                        <p className="text-sm text-gray-500">Last updated: {user.lastVisit}</p>
                      </div>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700">
                      Download
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest health-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.recentActivities.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-teal-600" />
                        <div>
                          <h4 className="font-medium">{activity.type}</h4>
                          <p className="text-sm text-gray-500">{activity.date}</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Appointment Reminders Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-600" />
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
                      <Settings className="w-5 h-5 text-gray-600" />
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
                      <Activity className="w-5 h-5 text-gray-600" />
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
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Request Medical Records
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Schedule Appointment
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      View Health Report
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