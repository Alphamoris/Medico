import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import Image from 'next/image';


interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface QuickLink {
  label: string;
  href: string;
}

interface ServiceLink {
  label: string;
  href: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    { icon: <Facebook className="h-5 w-5" color='teal'/>, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" color='teal' />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" color='teal' />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" color='teal' />, href: "#", label: "LinkedIn" }
  ];

  const quickLinks: QuickLink[] = [
    { label: "Home", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Services", href: "#" },
    { label: "Doctors", href: "#" },
    { label: "Appointments", href: "#" }
  ];

  const services: ServiceLink[] = [
    { label: "Primary Care", href: "#" },
    { label: "Emergency Care", href: "#" },
    { label: "Mental Health", href: "#" },
    { label: "Dental Care", href: "#" },
    { label: "Specialized Treatment", href: "#" }
  ];

  return (
    <footer className="relative w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-8 pb-4 overflow-x-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative">
        {/* Newsletter Section */}
        <div className="w-full max-w-4xl mx-auto mb-10 bg-white rounded-2xl p-8 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
          <Link href={"/"} className="flex items-center md:me-2 me-5">
          <Image className="me-2" src={"/logo.ico"} height={80} width={80} alt="logo"></Image>
          <span className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400  to-blue-600 hover:underline hover:scale-110 transition-all duration-500 ease-out transform">
            Medico
          </span>
        </Link>
            <p className="text-gray-600 leading-relaxed">
              Providing compassionate care and innovative wellness solutions for a healthier, happier tomorrow.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className="rounded-full border-2 hover:border-purple-500 hover:text-purple-500 hover:scale-110 transition-all duration-300"
                >
                  {social.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index} className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href={link.href} className="text-gray-600 hover:text-purple-600 flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="transform hover:translate-x-2 transition-transform duration-300">
                  <a href={service.href} className="text-gray-600 hover:text-purple-600 flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4" />
                    <span>{service.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <div className="space-y-2">
              <a href="#" className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300">
                <MapPin className="h-5 w-5 text-purple-600 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-600 text-xs">
                  123 Healthcare Avenue,<br />
                  Medical District, MD 12345
                </p>
              </a>
              <a href="tel:+15551234567" className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300">
                <Phone className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-600 text-xs">+91 7010815310</p>
              </a>
              <a href="mailto:contact@healthcare.com" className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300">
                <Mail className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-600 text-xs">alphamoris45@gmail.com</p>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-2 pt-4 border-t border-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} HealthCare. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;