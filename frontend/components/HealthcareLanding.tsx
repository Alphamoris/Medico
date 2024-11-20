"use client";

import React, { useState, useEffect } from 'react';
import { HeartPulse, Shield, Activity, Users, Star, ArrowRight, CheckCircle2, Phone, Calendar, Brain, Stethoscope } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { SparklesCore } from "@/components/ui/sparkles";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  image?: string;
}

interface FeatureProps {
  Icon: React.ElementType;
  title: string;
  description: string;
}

const AnimatedNumber: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current > value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const FloatingIcon: React.FC<{ Icon: React.ElementType; index: number }> = ({ Icon, index }) => {
  const randomX = Math.random() * 100 - 50;
  const randomY = Math.random() * 100 - 50;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.2, 1],
        x: [randomX, -randomX, randomX],
        y: [randomY, -randomY, randomY],
      }}
      transition={{
        duration: 10 + index * 2,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    >
      <Icon className="w-8 h-8 text-teal-600/20" />
    </motion.div>
  );
};

const FeatureCard: React.FC<FeatureProps> = ({ Icon, title, description }) => (
  <BackgroundGradient className="rounded-[22px] max-w-sm p-4 bg-white dark:bg-zinc-900">
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4"
    >
      <div className="rounded-full bg-gradient-to-br from-teal-400 to-blue-500 p-2 w-12 h-12 mb-4">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </motion.div>
  </BackgroundGradient>
);

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
    className="relative"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur opacity-20" />
    <Card className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <Star className="text-yellow-400 w-6 h-6 mb-4" />
        <p className="text-gray-700 dark:text-gray-300 mb-4">{quote}</p>
        <div className="flex items-center gap-3">
          <AnimatedTooltip
            items={[{
              id: 1,
              name: author,
              designation: role,
              image: image || "/api/placeholder/100/100"
            }]}
          />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const HealthcareLanding: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    { Icon: HeartPulse, title: "24/7 Care", description: "Round-the-clock medical support with instant access to healthcare professionals" },
    { Icon: Shield, title: "Safe & Secure", description: "Military-grade encryption protecting your sensitive health information" },
    { Icon: Activity, title: "Live Monitoring", description: "Real-time health tracking with AI-powered insights and alerts" },
    { Icon: Brain, title: "AI Diagnostics", description: "Advanced artificial intelligence systems for accurate medical diagnosis" }
  ];

  const testimonials = [
    { 
      quote: "The most innovative healthcare platform I've experienced. The AI diagnostics saved me countless hours of worry.",
      author: "Sarah Johnson",
      role: "Patient",
      image: "/api/placeholder/100/100"
    },
    {
      quote: "As a healthcare provider, this platform has streamlined our operations and improved patient outcomes significantly.",
      author: "Dr. Michael Chen",
      role: "Medical Director",
      image: "/api/placeholder/100/100"
    },
    {
      quote: "The 24/7 support and monitoring gives me peace of mind about my family's health. Truly revolutionary.",
      author: "David Wilson",
      role: "Family Plan Member",
      image: "/api/placeholder/100/100"
    }
  ];

  const words = [
    {
      text: "The",
      className: "text-neutral-800 dark:text-neutral-200",
    },
    {
      text: "Future",
      className: "text-neutral-800 dark:text-neutral-200",
    },
    {
      text: "of",
      className: "text-neutral-800 dark:text-neutral-200",
    },
    {
      text: "Healthcare",
      className: "text-teal-500 dark:text-teal-400",
    },
    {
      text: "is",
      className: "text-neutral-800 dark:text-neutral-200",
    },
    {
      text: "Here",
      className: "bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text",
    },
  ];

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-dot-pattern relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          {[HeartPulse, Shield, Activity, Brain, Stethoscope].map((Icon, index) => (
            <FloatingIcon key={index} Icon={Icon} index={index} />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center py-20 px-4">
          <div className="absolute inset-0 w-full h-full">
            <SparklesCore
              id="tsparticles"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#14b8a6"
            />
          </div>

          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="inline-flex items-center mb-6 px-4 py-2 bg-teal-100 text-teal-800">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-4 h-4 mr-2" />
                </motion.div>
                Leading Healthcare Innovation
              </Badge>

              <div className="mb-8">
                <TypewriterEffect words={words} className="text-4xl md:text-6xl font-bold" />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8"
              >
                Experience healthcare reimagined with cutting-edge technology and compassionate care.
              </motion.p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                  Get Started 
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-2">
                  <Calendar className="mr-2 w-5 h-5" />
                  Book Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
                {[
                  { value: 50000, suffix: "+", label: "Patients" },
                  { value: 98, suffix: "%", label: "Satisfaction" },
                  { value: 24, suffix: "/7", label: "Support" },
                  { value: 100, suffix: "+", label: "Specialists" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="text-center"
                  >
                    <h3 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                Comprehensive Healthcare Solutions
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Experience the perfect blend of technology and care
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HoverEffect items={features.map(feature => ({
                title: feature.title,
                description: feature.description,
                icon: <feature.Icon className="w-6 h-6" />
              }))} />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                What Our Patients Say
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Real stories from real patients about their healthcare journey
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <BackgroundGradient className="rounded-[22px] p-8 md:p-12 bg-white dark:bg-zinc-900">
                <div className="text-center">
                  <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
                    Ready to Transform Your Healthcare Experience?
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                    Join thousands of satisfied patients who have already made the switch
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                      Get Started Now
                      <CheckCircle2 className="ml-2 w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-2">
                      Contact Support
                      <Phone className="ml-