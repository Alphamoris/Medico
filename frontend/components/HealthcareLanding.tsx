"use client"
import React, { useState, useEffect } from 'react';
import { HeartPulse, Shield, Activity, Users, Star, ArrowRight, CheckCircle2, Phone, Calendar, Brain, Stethoscope, Globe, Award, Sparkles, Link } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BiPlusMedical } from "react-icons/bi";
import { FaUserNurse } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from 'framer-motion';
import { Input } from './ui/input';
import { postFeedback } from '@/apilib/ApiPost';
import { AnimatedCounterProps, TestimonialProps, FeatureProps } from '@/interface';
import { useRouter } from 'next/navigation';

// Optimized Animated Counter with RAF
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 3, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Enhanced Floating Icons with Performance Optimization
const FloatingIcons: React.FC = () => {
  const icons = [HeartPulse, Users, FaUserNurse, BiPlusMedical, Brain, Shield, Activity, Stethoscope];
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    setMounted(true);

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            opacity: 0
          }}
          animate={{
            x: [null, Math.random() * dimensions.width],
            y: [null, Math.random() * dimensions.height],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Icon className="w-12 h-12 text-teal-500 opacity-60" />
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Testimonial Card with Glassmorphism
const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role, image }) => (
  <motion.div
    whileHover={{ scale: 1.02, rotateY: 5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-white/60 backdrop-blur-lg border-none shadow-xl overflow-hidden">
      <CardContent className="pt-6 relative">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full -translate-y-1/2 translate-x-1/2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <Star className="text-yellow-400 w-8 h-8 mb-4" />
        <p className="text-gray-700 mb-4 italic relative text-lg">{quote}</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {image ? (
                <img src={image} alt={author} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-teal-600" />
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{author}</p>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Enhanced Feature Card with 3D Effect
const FeatureCard: React.FC<FeatureProps> = ({ Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="group hover:shadow-2xl transition-all duration-300 border-none bg-gradient-to-br from-white to-teal-50 overflow-hidden relative h-full">
      <CardContent className="pt-6">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200/50 to-blue-200/50 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 p-0.5 w-12 h-12 mb-4 group-hover:shadow-lg transition-all duration-300">
          <div className="rounded-xl bg-white w-full h-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-teal-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

// Main Component with Enhanced Features
const HealthcareLanding: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postFeedback(formData);
      alert('Feedback submitted successfully!');
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const features = [
    { Icon: HeartPulse, title: "24/7 Care", description: "Round-the-clock medical support with instant access to healthcare professionals" },
    { Icon: Shield, title: "Safe & Secure", description: "Military-grade encryption protecting your sensitive health information" },
    { Icon: Activity, title: "Live Monitoring", description: "Real-time health tracking with AI-powered insights and alerts" },
    { Icon: Users, title: "Expert Team", description: "Board-certified healthcare professionals with decades of experience" },
    { Icon: Brain, title: "AI Diagnostics", description: "Advanced artificial intelligence for preliminary health assessments" },
    { Icon: Globe, title: "Global Access", description: "Access your healthcare anywhere in the world" },
    { Icon: Calendar, title: "Smart Scheduling", description: "AI-powered appointment scheduling with instant confirmation" },
    { Icon: Award, title: "Quality Care", description: "Nationally recognized healthcare excellence and patient satisfaction" }
  ];

  const testimonials = [
    {
      quote: "The most innovative healthcare platform I've experienced. The AI diagnostics saved me countless hours of worry.",
      author: "Sarah Johnson",
      role: "Patient",
      image: "/logo.ico"
    },
    {
      quote: "As a healthcare provider, this platform has streamlined our operations and improved patient outcomes significantly.",
      author: "Dr. Michael Chen",
      role: "Medical Director",
      image: "/logo.ico"
    },
    {
      quote: "The 24/7 support and monitoring gives me peace of mind about my family's health. Truly revolutionary and impactful.",
      author: "David Wilson",
      role: "Family Plan Member",
      image: "/logo.ico"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50"
    >
      {isLoading ? (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="fixed inset-0 bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center z-50"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <HeartPulse className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>
      ) : null}

      <FloatingIcons />

      {/* Enhanced Hero Section with Parallax Effect */}
      <motion.div style={{ opacity }} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-40 left-20 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [180, 0, 180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          />
          <Badge 
            className="mt-14 mb-2 px-4 text-center py-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 hover:from-teal-200 hover:to-blue-200 transition-all duration-300"
            onClick={() => window.open("https://www.linkedin.com/in/alphamoris", "_blank")}
          >
            <Sparkles className="w-4 h-4 inline-block mr-2" />
            Dhanush's Website
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            The Future of
            <motion.span
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
                color: ["#0d9488", "#14b8a6"]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="block bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent"
            >
              Healthcare is Here
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
          >
            Experience healthcare reimagined with cutting-edge technology and compassionate care.
            Join thousands of satisfied patients in the digital health revolution.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 group">
              Get Started
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.span>
            </Button>
            <Button size="lg"
              variant="outline"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
              onClick={() => { router.push('/contactus') }}
            >
              <Phone className="mr-2 w-5 h-5" />
              Contact Us
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto"
          >
            {[
              { value: 50000, suffix: "+", label: "Patients" },
              { value: 98, suffix: "%", label: "Satisfaction" },
              { value: 24, suffix: "/7", label: "Support" },
              { value: 100, suffix: "+", label: "Specialists" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of cutting-edge technology and compassionate care
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-teal-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real patients about their healthcare journey with us
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Comment Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              We'd Love to Hear From You!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              "Your feedback fuels our passion to provide exceptional healthcare services."
            </p>
          </motion.div>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                Your Feedback
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Share your thoughts with us"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <Button type="submit" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg">
                Submit Feedback
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* {NewsletterSection} */}
      <div className="w-full max-w-4xl mx-auto mb-10 bg-transparent rounded-2xl p-8 shadow-xl transform hover:-translate-y-1 transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Stay Updated with Health Tips</h2>
          <p className="text-gray-600">Subscribe to our newsletter for the latest healthcare insights</p>
        </div>
        <div className="flex flex-col justify-center sm:flex-row gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-grow"
          />
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            Subscribe
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-lg text-teal-50 mb-8">
              Join thousands of satisfied patients who have already made the switch to modern healthcare
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
                Get Started Now
                <CheckCircle2 className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-teal-600 hover:bg-white/10">
                Schedule a Demo
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HealthcareLanding;