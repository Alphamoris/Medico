"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Toast, ToastProvider } from '@/components/ui/toast';
import {
  Upload,
  ShoppingCart,
  PlusCircle,
  MinusCircle,
  FileText,
  Search,
  Filter,
  Tag,
  AlertCircle,
  Package,
  Heart,
  Clock,
  DollarSign,
  ChevronDown,
  Star,
  ChevronUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Medicine {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  dosage?: string;
  requires_prescription: boolean;
  rating?: number;
  reviews?: number;
  discount?: number;
  expiry?: string;
  manufacturer?: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Enhanced dummy data
const medicines: Record<string, Medicine[]> = {
  general: [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      price: 5.99,
      category: 'Pain Relief',
      stock: 50,
      description: 'Fast-acting pain reliever for headaches and fever',
      dosage: '1-2 tablets every 4-6 hours',
      requires_prescription: false,
      rating: 4.5,
      reviews: 128,
      discount: 10,
      expiry: '2025-12',
      manufacturer: 'PharmaCare Inc.'
    },
  ],
  cardiology: [
    {
      id: 4,
      name: 'Aspirin 75mg',
      price: 6.99,
      category: 'Blood Thinners',
      stock: 40,
      description: 'Daily blood thinner for cardiovascular health',
      dosage: '1 tablet daily',
      requires_prescription: true,
      rating: 4.8,
      reviews: 256,
      manufacturer: 'HeartCare Pharmaceuticals'
    },
  ],
  orthopedic: [
    {
      id: 6,
      name: 'Calcium + D3',
      price: 9.99,
      category: 'Supplements',
      stock: 60,
      description: 'Essential supplement for bone health',
      dosage: '1 tablet twice daily',
      requires_prescription: false,
      rating: 4.6,
      reviews: 189,
      discount: 15,
      manufacturer: 'BoneHealth Labs'
    },
  ]
};

const categories: Category[] = [
  { id: 'general', name: 'General', icon: <Package className="h-5 w-5" /> },
  { id: 'cardiology', name: 'Cardiology', icon: <Heart className="h-5 w-5" /> },
  { id: 'orthopedic', name: 'Orthopedic', icon: <Tag className="h-5 w-5" /> },
];

const BuyMedicine: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [prescription, setPrescription] = useState<File | null>(null);
  const [manualPrescription, setManualPrescription] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrescriptionAlert, setShowPrescriptionAlert] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('rating');
  const [showCartToast, setShowCartToast] = useState(false);
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [showCartDetails, setShowCartDetails] = useState(false);
  
  const cartRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingCart(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (cartRef.current) {
      observer.current.observe(cartRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const addToCart = useCallback((medicine: Medicine) => {
    if (medicine.requires_prescription && !prescription && !manualPrescription) {
      setShowPrescriptionAlert(true);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: Math.min(item.quantity + 1, medicine.stock) }
            : item
        );
      }
      return [...prevCart, { ...medicine, quantity: 1 }];
    });
    
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 2000);
  }, [prescription, manualPrescription]);

  const filteredMedicines = React.useMemo(() => {
    let filtered = medicines[activeTab].filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFilters.length > 0) {
      filtered = filtered.filter(medicine =>
        selectedFilters.some(filter => medicine.category === filter)
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [activeTab, searchTerm, selectedFilters, sortBy]);

  const calculateTotal = useCallback(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 50 ? 0 : 5;
    return {
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [cart]);

  const scrollToCart = () => {
    cartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-indigo-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                Your Health, Our Priority
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Get your medications delivered safely and securely to your doorstep
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Filters
            </Button>
          </div>

          {/* Categories Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedicines.map((medicine) => (
                    <Card key={medicine.id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span>{medicine.name}</span>
                          <Badge variant={medicine.requires_prescription ? "destructive" : "default"}>
                            {medicine.requires_prescription ? "Prescription Required" : "OTC"}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-600">{medicine.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold">${medicine.price}</span>
                            <Button onClick={() => addToCart(medicine)}>Add to Cart</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Cart Section */}
          <div ref={cartRef} className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCart(prevCart =>
                                  prevCart.map(cartItem =>
                                    cartItem.id === item.id
                                      ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
                                      : cartItem
                                  ).filter(cartItem => cartItem.quantity > 0)
                                );
                              }}
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCart(prevCart =>
                                  prevCart.map(cartItem =>
                                    cartItem.id === item.id
                                      ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, item.stock) }
                                      : cartItem
                                  )
                                );
                              }}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>${calculateTotal().subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Delivery Fee</span>
                        <span>${calculateTotal().deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${calculateTotal().total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button className="w-full">Proceed to Checkout</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating Cart Button */}
        <AnimatePresence>
          {showFloatingCart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <Button
                onClick={scrollToCart}
                className="bg-teal-600 hover:bg-teal-700 rounded-full p-4 shadow-lg"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="ml-2">{calculateTotal().itemCount}</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Added Toast */}
        <AnimatePresence>
          {showCartToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Toast className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Item added to cart successfully!</span>
                </div>
              </Toast>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prescription Alert */}
        {showPrescriptionAlert && (
          <Alert className="fixed top-4 right-4 z-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please upload a prescription before adding this medicine to cart
            </AlertDescription>
            <Button
              size="sm"
              variant="ghost"
              className="ml-2"
              onClick={() => setShowPrescriptionAlert(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}
      </div>
    </ToastProvider>
  );
};

export default BuyMedicine;