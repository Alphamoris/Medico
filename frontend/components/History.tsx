"use client"

import React, { useState } from 'react';
import { 
  FileDown,
  Activity,
  Stethoscope,
  Syringe,
  Thermometer,
  Heart,
  FileText,
  Share2,
  Printer
} from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import Image from 'next/image';

interface VitalRecord {
  id: string;
  date: string;
  type: 'Blood Pressure' | 'Heart Rate' | 'Temperature' | 'Blood Sugar';
  value: string;
  notes?: string;
}

interface LabTest {
  id: string;
  name: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Processing';
  results?: string;
  lab: string;
  reportUrl?: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
  notes?: string;
  location?: string;
}

interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    notes?: string;
  }>;
  diagnosis?: string;
}

const MedicoHistoryDashboard: React.FC = () => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const { toast } = useToast();

  // Dummy data
  const vitals: VitalRecord[] = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Blood Pressure',
      value: '120/80',
      notes: 'Normal reading'
    },
    {
      id: '2', 
      date: '2024-01-14',
      type: 'Heart Rate',
      value: '72 bpm'
    }
  ];

  const labTests: LabTest[] = [
    {
      id: '1',
      name: 'Complete Blood Count',
      date: '2024-01-10',
      status: 'Completed',
      results: 'All parameters within normal range',
      lab: 'City Labs',
      reportUrl: '/reports/cbc.pdf'
    }
  ];

  const appointments = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Smith',
      speciality: 'Cardiologist',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'Upcoming',
      location: 'City Hospital'
    }
  ];

  const prescriptions = [
    {
      id: '1',
      date: '2024-01-05',
      doctorName: 'Dr. John Doe',
      diagnosis: 'Common Cold',
      medicines: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Twice daily',
          notes: 'After meals'
        }
      ]
    }
  ];

  const handleExport = (format: 'pdf' | 'csv') => {
    toast({
      title: "Exporting records",
      description: `Your records will be exported as ${format.toUpperCase()}`,
      className: "bg-teal-50 border-teal-500"
    });
    setShowExportOptions(false);
  };

  const handleShare = () => {
    toast({
      title: "Share records",
      description: "Share link generated and copied to clipboard",
      className: "bg-teal-50 border-teal-500"
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const renderVitals = () => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-teal-700 flex items-center">
          <Activity className="mr-2 text-teal-500" /> Vital Signs
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vitals.map((vital) => (
          <div key={vital.id} className="p-3 sm:p-4 bg-teal-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {vital.type === 'Blood Pressure' ? <Heart className="text-teal-500 w-4 h-4 sm:w-5 sm:h-5" /> :
               vital.type === 'Temperature' ? <Thermometer className="text-teal-500 w-4 h-4 sm:w-5 sm:h-5" /> :
               <Activity className="text-teal-500 w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="font-medium text-sm sm:text-base">{vital.type}</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-teal-700">{vital.value}</p>
            <p className="text-xs sm:text-sm text-gray-600">{vital.date}</p>
            {vital.notes && <p className="text-xs sm:text-sm text-teal-600 mt-1">{vital.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLabTests = () => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-teal-700 flex items-center">
          <Syringe className="mr-2 text-teal-500" /> Lab Tests
        </h3>
      </div>
      {labTests.map((test) => (
        <div key={test.id} className="p-3 sm:p-4 mb-3 bg-teal-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-sm sm:text-base">{test.name}</h4>
              <p className="text-xs sm:text-sm text-gray-600">{test.date} - {test.lab}</p>
            </div>
            {test.reportUrl && (
              <FileDown className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 cursor-pointer" />
            )}
          </div>
          {test.results && (
            <p className="mt-2 text-xs sm:text-sm text-teal-600">{test.results}</p>
          )}
        </div>
      ))}
    </div>
  );

  const renderAppointments = () => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-teal-700 flex items-center">
          <Stethoscope className="mr-2 text-teal-500" /> Appointments
        </h3>
      </div>
      {appointments.map((appointment) => (
        <div key={appointment.id} className="p-3 sm:p-4 mb-3 bg-teal-50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div>
              <h4 className="font-semibold text-sm sm:text-base">{appointment.doctorName}</h4>
              <p className="text-xs sm:text-sm text-gray-600">{appointment.speciality}</p>
              <p className="text-xs sm:text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
              <p className="text-xs sm:text-sm text-teal-600">{appointment.location}</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs sm:text-sm self-start sm:self-center">
              {appointment.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPrescriptions = () => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-teal-700 flex items-center">
          <FileText className="mr-2 text-teal-500" /> Prescriptions
        </h3>
      </div>
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="p-3 sm:p-4 mb-3 bg-teal-50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
            <div>
              <h4 className="font-semibold text-sm sm:text-base">{prescription.doctorName}</h4>
              <p className="text-xs sm:text-sm text-gray-600">{prescription.date}</p>
              {prescription.diagnosis && (
                <p className="text-xs sm:text-sm text-teal-600">Diagnosis: {prescription.diagnosis}</p>
              )}
            </div>
            <FileDown className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 cursor-pointer self-end sm:self-start" />
          </div>
          <div className="mt-3">
            {prescription.medicines.map((medicine, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-medium text-sm sm:text-base">{medicine.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {medicine.dosage} - {medicine.frequency}
                </p>
                {medicine.notes && (
                  <p className="text-xs sm:text-sm text-teal-600">{medicine.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-indigo-100 p-4 sm:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image
                src="/logo.ico"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-teal-800">
                Medical History
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Review your medical journey and activities</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <button 
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="w-full sm:w-auto bg-white text-teal-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-teal-50 transition flex items-center justify-center"
              >
                <FileDown className="mr-2" size={18} /> Export
              </button>
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10">
                  <button 
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-4 py-2 hover:bg-teal-50 rounded-lg text-sm"
                  >
                    Export as PDF
                  </button>
                  <button 
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2 hover:bg-teal-50 rounded-lg text-sm"
                  >
                    Export as CSV
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={handleShare}
              className="flex-1 sm:flex-none bg-white text-teal-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-teal-50 transition flex items-center justify-center"
            >
              <Share2 className="mr-2" size={18} /> Share
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 sm:flex-none bg-white text-teal-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-teal-50 transition flex items-center justify-center"
            >
              <Printer className="mr-2" size={18} /> Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="space-y-4 sm:space-y-8">
            {renderVitals()}
            {renderAppointments()}
          </div>
          <div className="space-y-4 sm:space-y-8">
            {renderLabTests()}
            {renderPrescriptions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicoHistoryDashboard;