"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
  IconSparkles
} from "@tabler/icons-react";
import { SignupFormData } from "@/interface";
import { signup } from "@/apilib/ApiAuthenticate";

export const Signup: React.FC = () => {
  const [isLoading , setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<SignupFormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault();
    console.log("Form submitted", formData);
    try {
      const response = await signup(formData) 
      
    }
    catch(error){
      console.log(error)
    }
    finally{
      setIsLoading(false);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      })
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-teal-600">
          <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-2">
            <IconSparkles className="text-yellow-300" />
            Create Your Account
            <IconSparkles className="text-yellow-300" />
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileFocus={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Label htmlFor="firstname" className="text-teal-700">First Name</Label>
              <Input
                id="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Tyler"
                className="mt-1 focus:ring-2 focus:ring-teal-500 transition-all duration-300 rounded-lg shadow-sm"
                required
              />
            </motion.div>

            <motion.div
              whileFocus={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Label htmlFor="lastname" className="text-teal-700">Last Name</Label>
              <Input
                id="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Durden"
                className="mt-1 focus:ring-2 focus:ring-teal-500 transition-all duration-300 rounded-lg shadow-sm"
                required
              />
            </motion.div>
          </div>

          {/* Email Field */}
          <motion.div
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Label htmlFor="email" className="text-teal-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="projectmayhem@fc.com"
              className="mt-1 focus:ring-2 focus:ring-teal-500 transition-all duration-300 rounded-lg shadow-sm"
              required
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Label htmlFor="password" className="text-teal-700">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 focus:ring-2 focus:ring-teal-500 transition-all duration-300 rounded-lg shadow-sm"
              required
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-lg"
          >
            Create Account
          </motion.button>

          {/* Social Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-teal-300"></div>
            <span className="px-4 text-teal-600">Or continue with</span>
            <div className="flex-grow border-t border-teal-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: IconBrandGithub, name: "GitHub", color: "bg-gray-400" },
              { Icon: IconBrandGoogle, name: "Google", color: "bg-gray-400" },
              { Icon: IconBrandOnlyfans, name: "OnlyFans", color: "bg-gray-400" }
            ].map(({ Icon, name, color }) => (
              <motion.button
                key={name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center justify-center py-2 ${color} text-white rounded-lg hover:opacity-90 transition-all shadow-md`}
              >
                <Icon className="mr-2" />
                {name}
              </motion.button>
            ))}
          </div>
        </form>
      </div>
    </motion.div>
  );
};