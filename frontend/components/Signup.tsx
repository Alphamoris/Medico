"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { IconBrandGoogle, IconBrandGithub, IconEye, IconEyeOff } from "@tabler/icons-react";
import { SignupFormData } from "@/interface";
import { signup } from "@/apilib/ApiAuthenticate";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Signup: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
    color: string;
  }>({
    score: 0,
    message: '',
    color: 'bg-gray-200'
  });
  const [formData, setFormData] = useState<SignupFormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};

    if (step === 1) {
      if (!formData.firstname.trim()) {
        newErrors.firstname = "First name is required";
      } else if (formData.firstname.length < 2) {
        newErrors.firstname = "First name must be at least 2 characters";
      }
      
      if (!formData.lastname.trim()) {
        newErrors.lastname = "Last name is required";
      } else if (formData.lastname.length < 2) {
        newErrors.lastname = "Last name must be at least 2 characters";
      }
    }

    if (step === 2) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }
    }

    if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (passwordStrength.score < 3) {
        newErrors.password = "Password is not strong enough";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    try {
      const response = await signup(formData);
      toast.success("Account created successfully!");
      router.push('/');
    } catch(error) {
      toast.error("Failed to create account. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = {
      0: { message: 'Very Weak', color: 'bg-red-500' },
      1: { message: 'Weak', color: 'bg-orange-500' },
      2: { message: 'Fair', color: 'bg-yellow-500' },
      3: { message: 'Good', color: 'bg-blue-500' },
      4: { message: 'Strong', color: 'bg-green-500' },
      5: { message: 'Very Strong', color: 'bg-green-600' }
    };

    setPasswordStrength({
      score,
      message: strengthMap[score as keyof typeof strengthMap].message,
      color: strengthMap[score as keyof typeof strengthMap].color
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (id === 'password') {
      analyzePasswordStrength(value);
    }
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({...prev, [id]: ''}));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      {/* Mobile Brand Header - Moved to top */}
      <div className="lg:hidden w-full text-center py-8 bg-gradient-to-r from-teal-600 to-blue-600">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.ico"
            alt="Medico Logo"
            width={100}
            height={100}
            className="rounded-full border-4 border-white mx-auto mb-4"
          />
        </Link>
        <h1 className="text-3xl font-bold text-white">Welcome to Medico</h1>
        <p className="text-white/80 mt-2 px-4">Your journey to better healthcare starts here</p>
      </div>

      {/* Left Section - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-blue-600 opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center h-full text-center text-white px-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
          >
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/logo.ico"
                alt="Medico Logo"
                width={120}
                height={120}
                className="rounded-full border-4 border-white hover:scale-105 transition-transform duration-300 shadow-2xl"
              />
            </Link>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200"
          >
            Welcome to Medico
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg opacity-90 max-w-md mx-auto text-teal-50"
          >
            Your journey to better healthcare starts here. Join our innovative platform designed for modern healthcare needs.
          </motion.p>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-6 bg-indigo-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600">Join our healthcare community</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              onSubmit={handleSubmit} 
              className="mt-6 space-y-4"
            >
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstname"
                        type="text"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-teal-500 ${
                          errors.firstname ? 'border-red-500' : ''
                        }`}
                        required
                      />
                      {errors.firstname && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastname"
                        type="text"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-teal-500 ${
                          errors.lastname ? 'border-red-500' : ''
                        }`}
                        required
                      />
                      {errors.lastname && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-teal-500 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-teal-500 pr-10 ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                    {formData.password && (
                      <div className="mt-2 space-y-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <p className={`text-sm ${passwordStrength.score >= 3 ? 'text-teal-600' : 'text-teal-400'}`}>
                          Password Strength: {passwordStrength.message}
                        </p>
                        <ul className="text-xs text-gray-500 list-disc pl-4">
                          <li>At least 8 characters</li>
                          <li>Include uppercase & lowercase letters</li>
                          <li>Include numbers and special characters</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-2.5 px-4 border border-teal-600 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    Back
                  </motion.button>
                )}
                
                {currentStep < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || passwordStrength.score < 3}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? "Creating Account..." : "Complete Signup"}
                  </motion.button>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <IconBrandGoogle className="h-5 w-5 mr-2 text-red-500" />
                  Google
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <IconBrandGithub className="h-5 w-5 mr-2" />
                  GitHub
                </motion.button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  href="/authenticate/login" 
                  className="font-medium text-teal-600 hover:text-teal-500 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </motion.form>
          </AnimatePresence>

          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className={`h-2 rounded-full ${
                  step === currentStep ? 'w-8 bg-teal-600' : 'w-2 bg-gray-300'
                }`}
                initial={false}
                animate={{ width: step === currentStep ? 32 : 8 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};