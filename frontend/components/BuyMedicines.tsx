"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Star
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
    // ... Add more medicines with similar detailed properties
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
    // ... Add more cardiology medicines
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
    // ... Add more orthopedic medicines
  ]
};

const categories: Category[] = [
  { id: 'general', name: 'General', icon: <Package className=" h-5 w-5 " /> },
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
  const [isCartSticky, setIsCartSticky] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('rating');

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsCartSticky(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      total: subtotal + deliveryFee
    };
  }, [cart]);

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-2 sm:py-2 lg:py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-2">
              Your Health, Our Priority
            </h1>
            <p className="text-md opacity-90 max-w-1xl mx-auto">
              Get your medications delivered safely and securely to your doorstep
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prescription Upload Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <FileText className="h-6 w-6" />
                    Upload Prescription
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-xl p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer group">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPrescription(file);
                            setShowPrescriptionAlert(false);
                          }
                        }}
                        className="hidden"
                        id="prescription-upload"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="prescription-upload"
                        className="cursor-pointer flex flex-col items-center space-y-3"
                      >
                        <Upload className="h-12 w-12 text-blue-500 group-hover:text-blue-600 transition-colors" />
                        <span className="text-sm font-medium text-gray-700">
                          Drop your prescription here or click to browse
                        </span>
                        <span className="text-xs text-gray-500">
                          Supported formats: PDF, JPG, PNG
                        </span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  className="pl-10 bg-white shadow-sm"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <select
                  aria-label='button'
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'name')}
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 gap-4 bg-transparent">
                {categories.map(category => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-3 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span className="text-xs sm:text-sm inline">{category.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Medicine Cards */}
              {Object.entries(medicines).map(([category, items]) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {filteredMedicines.map((medicine, index) => (
                        <motion.div
                          key={medicine.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                      {medicine.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                        {medicine.category}
                                      </Badge>
                                      {medicine.requires_prescription && (
                                        <Badge variant="destructive" className="bg-red-50 text-red-700">
                                          Prescription Required
                                        </Badge>
                                      )}
                                      {medicine.discount && (
                                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                                          {medicine.discount}% OFF
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-2xl font-bold text-blue-600">
                                      ${medicine.price}
                                    </span>
                                    {medicine.discount && (
                                      <span className="block text-sm text-gray-500 line-through">
                                        ${(medicine.price * (1 + medicine.discount / 100)).toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <p className="text-sm text-gray-600">{medicine.description}</p>
                                  {medicine.dosage && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Clock className="h-4 w-4" />
                                      <span>{medicine.dosage}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="ml-1 text-sm font-medium">
                                        {medicine.rating}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      ({medicine.reviews} reviews)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Package className="h-4 w-4" />
                                    <span>{medicine.manufacturer}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                  <div className="text-sm text-gray-600">
                                    Stock: {medicine.stock}
                                  </div>
                                  <Button
                                    onClick={() => addToCart(medicine)}
                                    disabled={medicine.stock === 0}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Cart Section */}
          <div className={`lg:col-span-1 ${isCartSticky ? 'lg:sticky lg:top-4' : ''}`}>
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <ShoppingCart className="h-6 w-6" />
                  Your Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            ${item.price} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setCart((prev) =>
                                prev.map((cartItem) =>
                                  cartItem.id === item.id
                                    ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
                                    : cartItem
                                ).filter((cartItem) => cartItem.quantity > 0)
                              )
                            }
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setCart((prev) =>
                                prev.map((cartItem) =>
                                  cartItem.id === item.id
                                    ? {
                                      ...cartItem,
                                      quantity: Math.min(
                                        cartItem.quantity + 1,
                                        medicines[activeTab].find((m) => m.id === item.id)?.stock || 0
                                      ),
                                    }
                                    : cartItem
                                )
                              )
                            }
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${calculateTotal().subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>${calculateTotal().deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${calculateTotal().total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Prescription Alert */}
      <AnimatePresence>
        {showPrescriptionAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                Please upload a prescription before adding prescription medicines to cart
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyMedicine;