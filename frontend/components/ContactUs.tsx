"use client"

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Optimized Form Schema Validation
const ContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormData = z.infer<typeof ContactSchema>;

const MedicoContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulated API Call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      reset();
      setSubmitStatus('success');
      
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden grid md:grid-cols-2">
        {/* Contact Information Section */}
        <div className="bg-teal-600 text-white p-10 flex flex-col justify-center">
        <Link className="flex items-center py-4" href="/">
            <Image
              alt="logo"
              className=" me-3 md:me-6 rounded-full border-4 border-white hover:scale-110 hover:shadow-lg transition-transform duration-900 ease-in-out animate-pulse"
              src="/logo.ico" // Consider using SVG for better scalability
              height={100}
              width={100}
            />
            <span className=" text-5xl md:text-7xl font-bold text-transparent bg-clip-text text-white bg-gradient-to-r from-cyan-500 via-teal-400  to-blue-600 hover:underline hover:scale-110 transition-all duration-500 ease-out shadow-xl transform">
              Medico
            </span>

          </Link>
          <p className="text-lg mb-8 text-teal-100">
            Transforming healthcare through compassionate, innovative solutions. Your wellness is our mission.
          </p>
          
          <div className="space-y-4">
            {[
              { 
                icon: <Mail className="h-6 w-6 text-teal-200" />, 
                text: "alpahamoris45@gamil.coom" 
              },
              { 
                icon: <Phone className="h-6 w-6 text-teal-200" />, 
                text: "+91 7010815310 | MEDICO-CARE" 
              },
              { 
                icon: <MapPin className="h-6 w-6 text-teal-200" />, 
                text: "123 Wellness Boulevard, Health City" 
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="p-10 space-y-6"
        >
          <h2 className="text-3xl font-bold text-teal-700 text-center mb-6">
            Contact Our Team
          </h2>

          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <Label htmlFor="name" className="text-teal-800">Full Name</Label>
              <Input
                {...register("name")}
                placeholder="Enter your full name"
                className={`mt-2 ${errors.name ? 'border-red-500' : 'border-teal-300'}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-teal-800">Email Address</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`mt-2 ${errors.email ? 'border-red-500' : 'border-teal-300'}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <Label htmlFor="phone" className="text-teal-800">Phone Number (Optional)</Label>
              <Input
                {...register("phone")}
                type="tel"
                placeholder="Enter your phone number"
                className="mt-2 border-teal-300"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <Label htmlFor="message" className="text-teal-800">Your Message</Label>
              <Textarea
                {...register("message")}
                placeholder="Write your message here"
                className={`mt-2 min-h-[120px] ${errors.message ? 'border-red-500' : 'border-teal-300'}`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-base transition-all duration-300 ${
                submitStatus === 'success' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isSubmitting 
                ? "Sending..." 
                : submitStatus === 'success' 
                  ? "Message Sent!" 
                  : "Send Message"
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicoContactPage;