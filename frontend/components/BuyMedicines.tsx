"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, ShoppingCart, PlusCircle, MinusCircle, FileText } from 'lucide-react';

// Dummy data
const medicines = {
  general: [
    { id: 1, name: 'Paracetamol 500mg', price: 5.99, category: 'Pain Relief', stock: 50 },
    { id: 2, name: 'Amoxicillin 250mg', price: 12.99, category: 'Antibiotics', stock: 30 },
    { id: 3, name: 'Vitamin C 1000mg', price: 8.99, category: 'Supplements', stock: 100 },
  ],
  cardiology: [
    { id: 4, name: 'Aspirin 75mg', price: 6.99, category: 'Blood Thinners', stock: 40 },
    { id: 5, name: 'Atorvastatin 20mg', price: 15.99, category: 'Statins', stock: 25 },
  ],
  orthopedic: [
    { id: 6, name: 'Calcium + D3', price: 9.99, category: 'Supplements', stock: 60 },
    { id: 7, name: 'Glucosamine', price: 19.99, category: 'Joint Health', stock: 35 },
  ]
};

const BuyMedicine = () => {
  const [cart, setCart] = useState<Array<{ id: number; quantity: number; name: string; price: number }>>([]);
  const [prescription, setPrescription] = useState<File | null>(null);
  const [manualPrescription, setManualPrescription] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const addToCart = (medicine: any) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPrescription(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="prescription-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="prescription-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-12 w-12 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Upload prescription (PDF, JPG, PNG)
                    </span>
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Or Enter Manually</h3>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    placeholder="Enter prescription details..."
                    value={manualPrescription}
                    onChange={(e) => setManualPrescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">General Medicines</TabsTrigger>
              <TabsTrigger value="cardiology" className="flex-1">Cardiology</TabsTrigger>
              <TabsTrigger value="orthopedic" className="flex-1">Orthopedic</TabsTrigger>
            </TabsList>

            {Object.entries(medicines).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 gap-4">
                  {items.map((medicine) => (
                    <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{medicine.name}</h3>
                            <p className="text-sm text-gray-500">{medicine.category}</p>
                            <p className="text-lg font-bold mt-2">${medicine.price}</p>
                            <Badge variant="secondary" className="mt-1">
                              Stock: {medicine.stock}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => addToCart(medicine)}
                            className="mt-2"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Cart */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          ${item.price} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {(prescription || manualPrescription) && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prescription Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prescription && (
                  <p className="text-sm">
                    File uploaded: {prescription.name}
                  </p>
                )}
                {manualPrescription && (
                  <p className="text-sm">
                    Manual prescription added
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyMedicine;