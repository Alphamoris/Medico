"use client"
import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Bell, Calendar, Activity, Heart, FileText } from 'lucide-react';
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
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoggedIn } from '@/Redux/LoginSlice';
import { useRouter } from 'next/navigation';

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

const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>, currentState: boolean) => {
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

const ProfileComponent: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector((state: any) => state.login.isLoggedIn);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [healthTracking, setHealthTracking] = useState(false);
  const [telemedicineEnabled, setTelemedicineEnabled] = useState(false);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>(initialMedicalInfo);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    dispatch(setIsLoggedIn(false));
    setShowLogoutDialog(false);
    router.push('/');
  };

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    lastVisit: "2024-03-15",
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

  return (
    <div className="min-h-screen bg-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Image width={50} height={50} src={"/logo.ico"} alt='logo' className="w-8 h-8 rounded-full" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-teal-700">Medico</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-teal-700 cursor-pointer hover:text-teal-800" />
            <LogOut 
              className="w-6 h-6 text-teal-700 cursor-pointer hover:text-teal-800" 
              onClick={handleLogout}
            />
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? You will need to log in again to access your profile.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-teal-600 text-teal-600 hover:bg-teal-50">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmLogout} className="bg-teal-600 hover:bg-teal-700">Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Profile Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <User className="w-5 h-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-teal-900">{user.name}</h3>
                  <p className="text-sm text-teal-600">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-teal-700">Last visit: {user.lastVisit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-teal-700">Profile completion: {user.profileComplete}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-teal-700">Health score: {user.healthScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Records Section */}
          <Card className="border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <FileText className="w-5 h-5" />
                Medical Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-teal-800">Allergies</span>
                  <span className="text-sm text-teal-600">{medicalInfo.allergies.length} recorded</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-teal-800">Medications</span>
                  <span className="text-sm text-teal-600">{medicalInfo.medications.length} active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-teal-800">Conditions</span>
                  <span className="text-sm text-teal-600">{medicalInfo.conditions.length} tracked</span>
                </div>
                <button
                  onClick={() => setShowMedicalForm(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Update Medical Info
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.appointments.map((appointment, index) => (
                  <div key={index} className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-teal-800">{appointment.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${appointment.virtual ? 'bg-teal-100 text-teal-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {appointment.virtual ? 'Virtual' : 'In-Person'}
                      </span>
                    </div>
                    <div className="text-sm text-teal-600">
                      <p>{appointment.doctor}</p>
                      <p>{appointment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Vitals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <Activity className="w-5 h-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-100">
                    <div>
                      <p className="font-medium text-teal-800">{activity.type}</p>
                      <p className="text-sm text-teal-600">{activity.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      activity.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <Heart className="w-5 h-5" />
                Current Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-sm text-teal-600">Blood Pressure</p>
                  <p className="text-lg font-semibold text-teal-800">{user.vitals.bloodPressure}</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-sm text-teal-600">Heart Rate</p>
                  <p className="text-lg font-semibold text-teal-800">{user.vitals.heartRate} bpm</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-sm text-teal-600">Temperature</p>
                  <p className="text-lg font-semibold text-teal-800">{user.vitals.temperature}°F</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-sm text-teal-600">Oxygen Level</p>
                  <p className="text-lg font-semibold text-teal-800">{user.vitals.oxygenLevel}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Section */}
        <Card className="border-teal-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-teal-800">Appointment Reminders</h3>
                  <p className="text-sm text-teal-600">Receive notifications about upcoming appointments</p>
                </div>
                <button
                  onClick={() => toggleSwitch(setAppointmentReminders, appointmentReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    appointmentReminders ? 'bg-teal-600' : 'bg-teal-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    appointmentReminders ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-teal-800">Email Notifications</h3>
                  <p className="text-sm text-teal-600">Receive updates via email</p>
                </div>
                <button
                  onClick={() => toggleSwitch(setEmailNotifications, emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    emailNotifications ? 'bg-teal-600' : 'bg-teal-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-teal-800">Health Tracking</h3>
                  <p className="text-sm text-teal-600">Enable continuous health monitoring</p>
                </div>
                <button
                  onClick={() => toggleSwitch(setHealthTracking, healthTracking)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    healthTracking ? 'bg-teal-600' : 'bg-teal-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    healthTracking ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-teal-800">Telemedicine</h3>
                  <p className="text-sm text-teal-600">Enable virtual consultations</p>
                </div>
                <button
                  onClick={() => toggleSwitch(setTelemedicineEnabled, telemedicineEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    telemedicineEnabled ? 'bg-teal-600' : 'bg-teal-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    telemedicineEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileComponent;