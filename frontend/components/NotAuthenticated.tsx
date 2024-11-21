"use client"
import React, { memo, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { 
  LockKeyhole, 
  HomeIcon, 
  ShieldAlert, 
  KeyRound, 
  UserCircle2,
  ArrowRight,
  Mail,
  Github,
  Twitter
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
    } flex items-center justify-center gap-2 h-12`}
    variant={variant === 'primary' ? 'default' : 'outline'}
    onClick={onClick}
  >
    {icon}
    {label}
    {variant === 'primary' && <ArrowRight className="h-4 w-4 ml-2" />}
  </Button>
));

AuthButton.displayName = 'AuthButton';

const NotAuthenticated = () => {
  const [loading, setLoading] = useState(false);

  const features = [
    { icon: <ShieldAlert className="h-6 w-6" />, text: "Secure Access" },
    { icon: <KeyRound className="h-6 w-6" />, text: "Private Content" },
    { icon: <UserCircle2 className="h-6 w-6" />, text: "Member Benefits" }
  ];

  const socialLogins = [
    { icon: <Mail className="h-4 w-4" />, label: "Email", color: "bg-teal-600" },
    { icon: <Github className="h-4 w-4" />, label: "GitHub", color: "bg-gray-800" },
    { icon: <Twitter className="h-4 w-4" />, label: "Twitter", color: "bg-blue-400" }
  ];

  const handleLogin = useCallback(() => {
    setLoading(true);
    // Simulate loading state
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  }, []);

  const handleHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center"
      >
        {/* Left side - Main content */}
        <Card className="p-8 space-y-8 bg-white/80 backdrop-blur-sm border-teal-100">
          <motion.div 
            className="relative"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -top-12 -left-12 h-24 w-24 bg-teal-500/10 rounded-full animate-pulse" />
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <LockKeyhole className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-800">
              Authentication Required
            </h1>
            <p className="text-gray-600 text-lg">
              Unlock exclusive content and features by logging in to your account. 
              Join our community of authenticated users today.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {socialLogins.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full ${social.color} text-white hover:opacity-90`}
                  onClick={() => handleLogin()}
                >
                  {social.icon}
                  <span className="ml-2">{social.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Right side - Decorative image */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex flex-col items-center justify-center space-y-8"
        >
          <div className="relative">
            <img
              src="/api/placeholder/400/400"
              alt="Security Illustration"
              className="rounded-lg shadow-2xl"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-teal-500/10 rounded-full animate-pulse delay-150" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Protected Content Ahead
            </h2>
            <p className="text-gray-600">
              Sign in to unlock all features and access exclusive content
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(NotAuthenticated);