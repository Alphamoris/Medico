"use client"

import React, { useState } from 'react';
import { 
  Calendar, 
  Pill, 
  FileText, 
  Clock, 
  ArrowRight, 
  User, 
  Receipt,  
  RefreshCw, 
  Download 
} from 'lucide-react';

// Typescript Interfaces for Type Safety
interface Appointment {
  id: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
}

interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
}

interface Purchase {
  id: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

const MedicoHistoryDashboard: React.FC = () => {
  // Mock Data (In real app, this would come from backend)
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt1',
      doctorName: 'Dr. Emily Rodriguez',
      speciality: 'Cardiology',
      date: '2024-03-15',
      time: '10:30 AM',
      status: 'Completed'
    },
    {
      id: 'apt2',
      doctorName: 'Dr. Michael Chen',
      speciality: 'Neurology',
      date: '2024-04-22',
      time: '02:45 PM',
      status: 'Upcoming'
    }
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'presc1',
      date: '2024-03-15',
      doctorName: 'Dr. Emily Rodriguez',
      medicines: [
        {
          name: 'Metoprolol',
          dosage: '50mg',
          frequency: 'Twice Daily'
        },
        {
          name: 'Aspirin',
          dosage: '100mg',
          frequency: 'Once Daily'
        }
      ]
    }
  ]);

  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: 'pur1',
      date: '2024-04-10',
      items: [
        {
          name: 'Vitamin D3 Supplement',
          quantity: 2,
          price: 15.99
        },
        {
          name: 'First Aid Kit',
          quantity: 1,
          price: 29.99
        }
      ],
      total: 61.97
    }
  ]);

  const renderAppointments = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-teal-700 flex items-center">
          <Calendar className="mr-2 text-teal-500" /> Appointments
        </h3>
        <button className="text-teal-600 hover:text-teal-800 flex items-center">
          View All <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
      {appointments.map((apt) => (
        <div 
          key={apt.id} 
          className={`
            p-4 mb-3 rounded-lg border-l-4 
            ${apt.status === 'Completed' ? 'border-green-500 bg-green-50' : 
              apt.status === 'Upcoming' ? 'border-blue-500 bg-blue-50' : 
              'border-red-500 bg-red-50'}
          `}
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-800">{apt.doctorName}</h4>
              <p className="text-sm text-gray-600">{apt.speciality}</p>
              <div className="mt-2 flex items-center space-x-2">
                <Clock size={16} className="text-teal-500" />
                <span className="text-sm">{apt.date} at {apt.time}</span>
              </div>
            </div>
            <span 
              className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${apt.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                  apt.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                  'bg-red-100 text-red-800'}
              `}
            >
              {apt.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPrescriptions = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-teal-700 flex items-center">
          <Pill className="mr-2 text-teal-500" /> Prescriptions
        </h3>
        <button className="text-teal-600 hover:text-teal-800 flex items-center">
          View All <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
      {prescriptions.map((presc) => (
        <div key={presc.id} className="p-4 mb-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="font-semibold text-gray-800">Prescribed by {presc.doctorName}</h4>
              <p className="text-sm text-gray-600">{presc.date}</p>
            </div>
            <Download className="text-teal-600 hover:text-teal-800 cursor-pointer" />
          </div>
          {presc.medicines.map((med, index) => (
            <div 
              key={index} 
              className="flex justify-between border-b last:border-b-0 py-2"
            >
              <div>
                <p className="font-medium">{med.name}</p>
                <p className="text-sm text-gray-600">
                  {med.dosage} | {med.frequency}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderPurchases = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-teal-700 flex items-center">
          <Receipt className="mr-2 text-teal-500" /> Purchases
        </h3>
        <button className="text-teal-600 hover:text-teal-800 flex items-center">
          View All <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
      {purchases.map((purchase) => (
        <div key={purchase.id} className="p-4 mb-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600">Purchase Date: {purchase.date}</p>
            <span className="font-semibold text-teal-700">
              ${purchase.total.toFixed(2)}
            </span>
          </div>
          {purchase.items.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between border-b last:border-b-0 py-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} | ${item.price.toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-teal-800 flex items-center">
              <User className="mr-3 text-teal-600" /> Medical History
            </h1>
            <p className="text-gray-600">Review your medical journey and activities</p>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center">
            <RefreshCw className="mr-2" size={18} /> Sync Records
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            {renderAppointments()}
            {renderPurchases()}
          </div>
          <div>
            {renderPrescriptions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicoHistoryDashboard;