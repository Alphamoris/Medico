"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LogIn, Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { login } from "@/apilib/ApiAuthenticate";
import { LoginFormData } from "@/interface";
import { useRouter } from "next/navigation";
//import { setIsLoggedIn } from "@/Redux/Slice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


export default function OptimizedLogin() {
    const router = useRouter();
    const dispatch = useDispatch()
    const IsLoggedIn = useSelector((state : any ) => state.login)
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await login(formData);
            if (!response || !response.access_token) {
                setError("Invalid email or password. Please try again.");
                return;
            }
            setShowSuccess(true);
            //dispatch(setIsLoggedIn(true))
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (error) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-gradient-to-br from-[#1a2980] via-[#26d0ce] to-[#1a2980] flex items-center justify-center"
            >
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="text-center text-white"
                >
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 360]
                        }}
                        transition={{ duration: 1 }}
                        className="mb-6"
                    >
                        <Sparkles size={64} />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-4">Successfully Logged In!</h1>
                    <p className="text-xl opacity-80">Redirecting to homepage...</p>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2980] via-[#26d0ce] to-[#1a2980] flex items-center justify-center p-4 overflow-hidden">
            <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 md:gap-12 items-center">
                {/* Left Section - Logo and Quote */}
                <motion.div 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full md:w-1/2 text-center"
                >
                    <div className="flex flex-col items-center md:block">
                        <motion.div 
                            className="flex justify-center mb-4 md:mb-6"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.8, type: "spring" }}
                        >
                            <Image
                                src="/logo.ico"
                                alt="Medico Logo"
                                width={80}
                                height={80}
                                className="drop-shadow-xl md:w-[120px] md:h-[120px]"
                            />
                        </motion.div>
                        
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold text-white mb-2 md:mb-4"
                            whileHover={{ 
                                scale: 1.05,
                                textShadow: "0 0 8px rgb(255,255,255)"
                            }}
                        >
                            <AnimatePresence>
                                {"Medico".split("").map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="inline-block"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </motion.h1>
                    </div>
                    <p className="text-lg md:text-2xl text-white/80 italic hidden md:block">
                        "Your Health, Our Priority - Connecting Care with Compassion"
                    </p>
                </motion.div>

                {/* Right Section - Login Form */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20 
                    }}
                    className="w-full md:w-1/2 relative z-10 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 md:p-8"
                >
                    {/* Login Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <motion.h1 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
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

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 p-3 bg-red-400 border border-red-500/50 rounded-lg flex items-center gap-2 text-white"
                            >
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-2.5 md:py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setPasswordVisible(!isPasswordVisible)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                            >
                                {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 md:py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition duration-200 flex items-center justify-center"
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
                        className="text-center mt-4 md:mt-6"
                    >
                        <p className="text-white/70 text-sm md:text-base">
                            Don't have an account? 
                            <Link href="/authenticate/signup" className="text-cyan-400 hover:underline"> Sign Up</Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}