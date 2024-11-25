"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Toast, ToastProvider } from '@/components/ui/toast';
import Image from 'next/image';
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
  X,
  Calendar,
  Factory,
  Pill,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { getMedicines } from '@/apilib/ApiGet';

// Types
export interface Medicine {
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

const categories: Category[] = [
  { id: 'all', name: 'All', icon: <Grid className="h-4 w-4" /> },
  { id: 'general', name: 'General', icon: <Package className="h-4 w-4" /> },
  { id: 'cardiology', name: 'Heart', icon: <Heart className="h-4 w-4" /> },
  { id: 'orthopedic', name: 'Bone', icon: <Tag className="h-4 w-4" /> },
];

const BuyMedicine: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [prescription, setPrescription] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrescriptionAlert, setShowPrescriptionAlert] = useState(false);
  const [showCartToast, setShowCartToast] = useState(false);
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [addedItem, setAddedItem] = useState<Medicine | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'prescription' | 'otc'>('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [medicines, setMedicines] = useState<Record<string, Medicine[]>>({
    all: [],
    general: [],
    cardiology: [],
    orthopedic: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch medicines data on component mount
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getMedicines();
        
        // Categorize medicines
        const categorizedMedicines = {
          all: response,
          general: response.filter((med: Medicine) => 
            ['Pain Relief', 'Antibiotics', 'Antacids'].includes(med.category)
          ),
          cardiology: response.filter((med: Medicine) => 
            ['Blood Thinners', 'Blood Pressure', 'Heart Health'].includes(med.category)
          ),
          orthopedic: response.filter((med: Medicine) => 
            ['Supplements', 'Bone Health', 'Joint Pain'].includes(med.category)
          )
        };

        setMedicines(categorizedMedicines);

      } catch (err) {
        setError('Failed to fetch medicines. Please try again later.');
        console.error('Error fetching medicines:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, []);

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

  const handlePrescriptionUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPrescription(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setPrescription(file);
    }
  };

  const addToCart = useCallback((medicine: Medicine) => {
    if (medicine.requires_prescription && !prescription) {
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

    setAddedItem(medicine);
    setShowCartToast(true);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowCartToast(false);
      setAddedItem(null);
      setShowConfirmation(false);
    }, 2000);
  }, [prescription]);

  const filteredMedicines = React.useMemo(() => {
    return medicines[activeTab].filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === 'prescription') {
        return matchesSearch && medicine.requires_prescription;
      } else if (filterType === 'otc') {
        return matchesSearch && !medicine.requires_prescription;
      }
      return matchesSearch;
    });
  }, [activeTab, searchTerm, filterType, medicines]);

  const calculateTotal = useCallback(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 399 ? 0 : 40;
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
        {/* Compact Header */}
        <div className="bg-indigo-100 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center"
            >
              <Image src="/logo.ico" alt="Website Logo" width={70} height={70} className="mr-4" />
              <div>
                <h1 className="text-2md sm:text-3xl font-bold mb-1 text-teal-700">
                  Your Health, Our Priority
                </h1>
                <p className="text-sm sm:text-base text-teal-600">
                  Safe and secure medication delivery
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Prescription Upload Area */}
          <div
            className={`mb-6 p-6 border-2 border-dashed rounded-lg text-center transition-colors ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-teal-200'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handlePrescriptionUpload}
              className="hidden"
              id="prescription-upload"
            />
            <label htmlFor="prescription-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-teal-500" />
                <p className="text-teal-700 font-medium">
                  Drop your prescription here or click to upload
                </p>
                <p className="text-sm text-teal-600">
                  Supports PDF, JPG, PNG (Max 5MB)
                </p>
              </div>
            </label>
            {prescription && (
              <div className="mt-4 p-2 bg-teal-100 rounded flex items-center justify-between">
                <span className="text-teal-700">
                  <FileText className="h-4 w-4 inline mr-2" />
                  {prescription.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrescription(null)}
                  className="text-teal-700 hover:text-teal-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search medicines by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 border-teal-200 focus:border-teal-400"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                className="border-teal-200 flex-1"
              >
                All
              </Button>
              <Button
                variant={filterType === 'prescription' ? 'default' : 'outline'}
                onClick={() => setFilterType('prescription')}
                className="border-teal-200 flex-1"
              >
                Prescription Only
              </Button>
              <Button
                title='Medicines Without Prescription'
                variant={filterType === 'otc' ? 'default' : 'outline'}
                onClick={() => setFilterType('otc')}
                className="border-teal-200 flex-1"
              >
                OTC
              </Button>
            </div>
          </div>

          {/* Categories Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-teal-100 flex flex-wrap">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs sm:text-sm data-[state=active]:bg-teal-600 data-[state=active]:text-white flex-1 sm:flex-none"
                >
                  {category.icon}
                  <span className="ml-1">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMedicines.map((medicine) => (
                    <Card key={medicine.id} className="border-teal-100 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg font-bold text-teal-700">
                            {medicine.name}
                          </CardTitle>
                          <Badge variant={medicine.requires_prescription ? "destructive" : "default"}>
                            {medicine.requires_prescription ? "Prescription Required" : "OTC"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">{medicine.description}</p>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Pill className="h-4 w-4 mr-2" />
                              <span>Dosage: {medicine.dosage}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Package className="h-4 w-4 mr-2" />
                              <span>Stock: {medicine.stock}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Expires: {medicine.expiry}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Factory className="h-4 w-4 mr-2" />
                              <span>{medicine.manufacturer}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(medicine.rating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({medicine.reviews} reviews)
                              </span>
                            </div>
                            {medicine.discount && (
                              <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                                {medicine.discount}% OFF
                              </Badge>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-teal-100">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-teal-700">
                                  ₹{medicine.price}
                                </span>
                                {medicine.discount && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{(medicine.price * (1 + medicine.discount / 100)).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => addToCart(medicine)}
                              className="bg-teal-600 hover:bg-teal-700"
                              disabled={medicine.requires_prescription && !prescription}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
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
          <div ref={cartRef}>
            <Card className="border-teal-100">
              <CardHeader>
                <CardTitle className="text-teal-700">Shopping Cart</CardTitle>
                <div className="text-sm text-teal-600 bg-teal-50 p-3 rounded-md mt-2">
                  🎉 Free delivery on orders above ₹399! {calculateTotal().subtotal <= 399 &&
                    `Add items worth ₹${(399 - calculateTotal().subtotal).toFixed(2)} more for free delivery.`}
                </div>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-sm">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-teal-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-teal-200"
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
                              className="border-teal-200"
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
                    <div className="border-t border-teal-100 pt-4">
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Subtotal</span>
                        <span>₹{calculateTotal().subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Delivery Fee {calculateTotal().subtotal > 399 && '(Free!)'}</span>
                        <span>₹{calculateTotal().deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-teal-700">
                        <span>Total</span>
                        <span>₹{calculateTotal().total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      Proceed to Checkout
                    </Button>
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
                <ShoppingCart className="h-5 w-5" />
                <span className="ml-2">{calculateTotal().itemCount}</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Added Toast */}
        <AnimatePresence>
          {showCartToast && addedItem && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Toast className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Added {addedItem.name} to cart!</span>
                </div>
              </Toast>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Message */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50"
            >
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Medicine successfully added to cart!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prescription Alert */}
        {showPrescriptionAlert && (
          <Alert className="fixed top-4 right-4 z-50 bg-teal-50 border-teal-200">
            <AlertCircle className="h-4 w-4 text-teal-600" />
            <AlertDescription className="text-teal-700">
              Please upload a prescription before adding this medicine to cart
            </AlertDescription>
            <Button
              size="sm"
              variant="ghost"
              className="ml-2 text-teal-600 hover:text-teal-700"
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