"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Search, Filter, X } from 'lucide-react';
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

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const AppointmentComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-02-15',
      time: '10:00 AM',
      location: 'Health Center Main Branch',
      status: 'upcoming'
    },
    {
      id: '2', 
      doctorName: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      date: '2024-02-20',
      time: '2:30 PM',
      location: 'Downtown Clinic',
      status: 'upcoming'
    },
    {
      id: '3',
      doctorName: 'Dr. Emily Brown',
      specialty: 'Pediatrician',
      date: '2024-01-30',
      time: '3:45 PM',
      location: 'Children\'s Medical Center',
      status: 'completed'
    },
    {
      id: '4',
      doctorName: 'Dr. James Wilson',
      specialty: 'Orthopedist',
      date: '2024-02-10',
      time: '11:30 AM',
      location: 'Sports Medicine Clinic',
      status: 'cancelled'
    }
  ]);

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    if (selectedAppointmentId) {
      setAppointments(appointments.map(appointment => 
        appointment.id === selectedAppointmentId 
          ? {...appointment, status: 'cancelled'}
          : appointment
      ));
      setShowCancelDialog(false);
      setSelectedAppointmentId(null);
    }
  };

  const filteredAppointments = appointments
    .filter(appointment => 
      filterStatus === 'all' ? true : appointment.status === filterStatus
    )
    .filter(appointment =>
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming':
        return 'bg-teal-100 text-teal-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-teal-100 text-teal-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.ico"
                alt="Healthcare Logo"
                width={40}
                height={40}
                className="mr-3"
              />
              <h1 className="text-2xl font-bold text-teal-700">HealthCare Hub</h1>
            </div>
            <Link href="/appointment/finddoctor">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-200 shadow-sm"
              >
                Book New Appointment
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-semibold text-teal-800 mb-4 md:mb-0">Your Appointments</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search doctor or specialty"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
                />
                {searchTerm && (
                  <button
                    title="Clear search"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <select
                title="Filter by status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {filteredAppointments.length === 0 ? (
            <Card className="bg-white p-8 text-center shadow-sm border border-teal-100">
              <p className="text-gray-500">No appointments found</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white hover:shadow-lg transition-shadow duration-200 border border-teal-100">
                  <CardHeader className="border-b bg-teal-50">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-teal-700">{appointment.doctorName}</h3>
                      <span className="text-sm font-medium text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
                        {appointment.specialty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-teal-600" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 p-4">
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <div className="flex gap-3">
                        <Link href={`/appointments/${appointment.id}`}>
                          <Button variant="outline" size="sm" className="text-teal-600 hover:bg-teal-50 border-teal-200">
                            View Details
                          </Button>
                        </Link>
                        {appointment.status === 'upcoming' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:bg-red-50 border-red-200"
                            onClick={() => handleCancelClick(appointment.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep appointment</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentComponent;
