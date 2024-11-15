"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useMemo, useState } from "react";
//import { Button } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "At least 8 characters" },
            { regex: /[0-9]/, text: "At least 1 number" },
            { regex: /[a-z]/, text: "At least 1 lowercase letter" },
            { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
        ];

        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }));
    };

    const strength = checkStrength(password);

    const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length;
    }, [strength]);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-gray-200";
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-orange-500";
        if (score === 3) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
        if (score === 0) return "Enter a password";
        if (score <= 2) return "Weak password";
        if (score === 3) return "Medium password";
        return "Strong password";
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Simulate an API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Handle successful login
            console.log("Logged in with email:", email);
        } catch (error) {
            // Handle login error
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <Link href={"/"} className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 flex justify-center">
                        <Image src={"/logo.ico"} className="me-2" height={50} width={50} alt="logo"></Image>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400  to-blue-600 hover:underline">Medico
                        </span>
                    </Link>
                </div>
                <form className="bg-white px-8 py-8 shadow sm:rounded-lg sm:px-10" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </Label>
                            <div className="mt-1">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={clsx(
                                        "block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm",
                                        email.length > 0 && !email.includes("@")
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <div className="mt-1 relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={isVisible ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={clsx(
                                        "block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm pr-9",
                                        password.length > 0 && strengthScore < 4
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    )}
                                />
                                <button
                                    className={clsx(
                                        "absolute inset-y-0 right-0 flex items-center justify-center rounded-e-md px-2 text-gray-400 hover:text-gray-500 focus:outline-none",
                                        isVisible ? "text-indigo-500" : ""
                                    )}
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label={isVisible ? "Hide password" : "Show password"}
                                    aria-pressed={isVisible}
                                    aria-controls="password"
                                >
                                    {isVisible ? (
                                        <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                                    ) : (
                                        <Eye size={16} strokeWidth={2} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div
                            className="mb-1 h-1 w-full overflow-hidden rounded-full bg-gray-200"
                            role="progressbar"
                            aria-valuenow={strengthScore}
                            aria-valuemin={0}
                            aria-valuemax={4}
                            aria-label="Password strength"
                        >
                            <div
                                className={clsx(
                                    "h-full transition-all duration-500 ease-out",
                                    getStrengthColor(strengthScore)
                                )}
                                style={{ width: `${(strengthScore / 4) * 100}%` }}
                            ></div>
                        </div>

                        <p id="password-strength" className="text-sm font-medium text-gray-700">
                            {getStrengthText(strengthScore)}. Must contain:
                        </p>

                        <ul className="space-y-1.5" aria-label="Password requirements">
                            {strength.map((req, index) => (
                                <li
                                    key={index}
                                    className={clsx(
                                        "flex items-center gap-2",
                                        req.met ? "text-emerald-600" : "text-gray-500"
                                    )}
                                >
                                    {req.met ? (
                                        <Check size={16} className="text-emerald-500" aria-hidden="true" />
                                    ) : (
                                        <X size={16} className="text-gray-400" aria-hidden="true" />
                                    )}
                                    <span className="text-sm">{req.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div>
                            <h2 className="text-center mb-2">New User?<Link href={"/authenticate/signup"} className="ms-2 text-blue-700 underline">Signup</Link></h2>
                            <button
                                className="p-[3px] relative w-full"
                                disabled={isLoading}
                                type="submit">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                                <div className="px-8 py-2 rounded-[6px] relative group text-white">
                                    {isLoading ? "Loading..." : "Sign in"}
                                </div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}