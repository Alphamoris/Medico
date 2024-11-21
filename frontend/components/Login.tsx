"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { LogIn, Lock, Mail, Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { login } from "@/apilib/ApiAuthenticate";
import { LoginFormData } from "@/interface";

export default function OptimizedLogin() {
    // const [loginData , setLoginData ] = useState<LoginFormData>({
    //     email : "" ,
    //     password : ""
    // })
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await login({email,password});
            console.log(`Login Successful :  `,response);
        } catch (error) {
            console.error("Login Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2980] via-[#26d0ce] to-[#1a2980] flex items-center justify-center p-4 overflow-hidden">
            {/* Login Container */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                }}
                className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8"
            >
                {/* Login Header */}
                <div className="text-center mb-8">
                    <motion.h1 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold text-white drop-shadow-lg"
                    >
                        Welcome Back
                    </motion.h1>
                    <motion.p
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/70 mt-2"
                    >
                        Sign in to continue your journey
                    </motion.p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="text-white/50" size={20} />
                        </div>
                        <input 
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            required
                        />
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="text-white/50" size={20} />
                        </div>
                        <input 
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setPasswordVisible(!isPasswordVisible)}
                            className="absolute right-3 top-3 text-white/50 hover:text-white"
                        >
                            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <span>Logging In...</span>
                        ) : (
                            <>
                                <LogIn className="mr-2" />
                                Sign In
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Footer Links */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center mt-6"
                >
                    <p className="text-white/70">
                        Don't have an account? 
                        <Link href="/authenticate/signup" className="text-cyan-400 hover:underline"> Sign Up</Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}