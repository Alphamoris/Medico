"use client";
import React, { memo, useState, useCallback, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import { 
  LockKeyhole, 
  HomeIcon, 
  ShieldAlert, 
  KeyRound, 
  UserCircle2,
  ArrowRight
} from "lucide-react";

// Memoized feature card component
const FeatureCard = memo(({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="p-4 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors duration-300"
  >
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="text-teal-600">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">
        {text}
      </span>
    </div>
  </motion.div>
));

FeatureCard.displayName = 'FeatureCard';

// Memoized button component
const AuthButton = memo(({ icon, label, variant = 'primary', onClick }: {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'outline';
  onClick: () => void;
}) => (
  <Button 
    className={`flex-1 ${
      variant === 'primary' 
        ? 'bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white' 
        : 'border-2 hover:bg-teal-50'
    } flex items-center justify-center gap-2 h-12 transition-all duration-300`}
    variant={variant === 'primary' ? 'default' : 'outline'}
    onClick={onClick}
  >
    {icon}
    {label}
    {variant === 'primary' && <ArrowRight className="h-4 w-4 ml-2" />}
  </Button>
));

AuthButton.displayName = 'AuthButton';

// Separate Image Component
const SecurityImage = memo(() => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    className="relative"
  >
    <Image
      src="/notauthenticated.png"
      alt="Security Illustration"
      width={500}
      height={500}
      className="rounded-2xl shadow-2xl"
      priority
    />
  </motion.div>
));

SecurityImage.displayName = 'SecurityImage';

const NotAuthenticated = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const features = [
    { icon: <ShieldAlert className="h-6 w-6" />, text: "Secure Access" },
    { icon: <KeyRound className="h-6 w-6" />, text: "Private Content" },
    { icon: <UserCircle2 className="h-6 w-6" />, text: "Member Benefits" }
  ];

  const handleLogin = useCallback(() => {
    setLoading(true);
    router.push('/authenticate/login');
  }, [router]);

  const handleHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <div className="container mx-auto px-4 py-8 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-1/2 flex flex-col items-center justify-center space-y-8"
        >
          <Card className="p-6 lg:p-8 space-y-6 bg-white/80 backdrop-blur-sm border-teal-100 shadow-xl relative">
            <div className="absolute sm:top-20 top-16 right-4 flex items-center gap-2">
              <Image 
                src="/logo.ico"
                alt="Medico Logo"
                width={42}
                height={42}
              />
              <span className="text-xl sm:text-3xl font-bold text-teal-700">Medico</span>
            </div>

            <motion.div 
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-16 lg:h-20 w-16 lg:w-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <LockKeyhole className="h-8 lg:h-10 w-8 lg:w-10 text-white" />
              </div>
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-800">
                Authentication Required
              </h1>
              <p className="text-gray-600 text-base">
                Unlock exclusive content and features by logging in to your account.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <AuthButton 
                icon={<LockKeyhole className="h-4 w-4" />}
                label={loading ? "Loading..." : "Login Now"}
                onClick={handleLogin}
              />
              
              <AuthButton
                icon={<HomeIcon className="h-4 w-4" />}
                label="Return Home"
                variant="outline"
                onClick={handleHome}
              />
            </div>
          </Card>
        </motion.div>

        <div className="hidden lg:flex flex-col items-center justify-center ms-10 space-y-8">
          <Suspense fallback={<Loader />}>
            <SecurityImage />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default memo(NotAuthenticated);