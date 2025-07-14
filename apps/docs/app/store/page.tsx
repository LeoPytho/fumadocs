
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon, CreditCardIcon, BanknoteIcon, PhoneIcon, MailIcon, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import Link from 'fumadocs-core/link';

interface OrderData {
  customerName: string;
  email: string;
  phone: string;
  notes?: string;
  selectedItems: CartItem[];
  totalAmount: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
}

interface PaymentLinkResponse {
  order_id: string;
  payment_url: string;
  error_messages?: string[];
}

// Sample products - replace with your actual product data
const SAMPLE_PRODUCTS: CartItem[] = [
  {
    id: 'jkt48-ticket-001',
    name: 'JKT48 Concert Ticket VIP',
    price: 500000,
    quantity: 1,
    category: 'Entertainment',
    brand: 'JKT48'
  },
  {
    id: 'jkt48-ticket-002', 
    name: 'JKT48 Concert Ticket Regular',
    price: 250000,
    quantity: 1,
    category: 'Entertainment',
    brand: 'JKT48'
  },
  {
    id: 'jkt48-merch-001',
    name: 'JKT48 Official T-Shirt',
    price: 150000,
    quantity: 1,
    category: 'Merchandise',
    brand: 'JKT48'
  },
  {
    id: 'jkt48-merch-002',
    name: 'JKT48 Photo Book',
    price: 200000,
    quantity: 1,
    category: 'Merchandise', 
    brand: 'JKT48'
  }
];

const MIDTRANS_SERVER_KEY = process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || 'Mid-server-_9x9KcIumzkO0yMo-UXaiupS';
const MIDTRANS_API_URL = 'https://api.midtrans.com'; // Production URL

export default function CheckoutPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData>({
    customerName: '',
    email: '',
    phone: '',
    notes: '',
    selectedItems: [],
    totalAmount: 0
  });
  const [availableProducts] = useState<CartItem[]>(SAMPLE_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<PaymentLinkResponse | null>(null);

  // Calculate total amount whenever selected items change
  useEffect(() => {
    const total = orderData.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setOrderData(prev => ({ ...prev, totalAmount: total }));
  }, [orderData.selectedItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleProductToggle = (product: CartItem) => {
    setOrderData(prev => {
      const existingItem = prev.selectedItems.find(item => item.id === product.id);
      if (existingItem) {
        // Remove item if already selected
        return {
          ...prev,
          selectedItems: prev.selectedItems.filter(item => item.id !== product.id)
        };
      } else {
        // Add item if not selected
        return {
          ...prev,
          selectedItems: [...prev.selectedItems, { ...product }]
        };
      }
    });
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setOrderData(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    }));
  };

  const validateForm = (): boolean => {
    if (!orderData.customerName || !orderData.email || !orderData.phone) {
      setError('Nama, email, dan nomor telepon harus diisi');
      return false;
    }

    if (orderData.selectedItems.length === 0) {
      setError('Pilih minimal satu produk');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)) {
      setError('Format email tidak valid');
      return false;
    }

    if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(orderData.phone)) {
      setError('Format nomor telepon tidak valid (contoh: 081234567890)');
      return false;
    }

    return true;
  };

  const createPaymentLink = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const orderId = `order-${Date.now()}`;
      const paymentLinkId = `payment-${Date.now()}`;
      
      // Create base64 encoded auth string
      const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);
      
      const requestBody = {
        transaction_details: {
          order_id: orderId,
          gross_amount: orderData.totalAmount,
          payment_link_id: paymentLinkId
        },
        customer_required: false,
        credit_card: {
          secure: true
        },
        usage_limit: 1,
        expiry: {
          duration: 24,
          unit: "hours"
        },
        enabled_payments: [
          "credit_card",
          "gopay", 
          "bca_va",
          "bni_va",
          "bri_va",
          "permata_va",
          "other_va",
          "indomaret",
          "alfamart",
          "shopeepay"
        ],
        item_details: orderData.selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          brand: item.brand || 'JKT48Connect',
          category: item.category || 'General',
          merchant_name: 'JKT48Connect'
        })),
        customer_details: {
          first_name: orderData.customerName.split(' ')[0] || orderData.customerName,
          last_name: orderData.customerName.split(' ').slice(1).join(' ') || '',
          email: orderData.email,
          phone: orderData.phone,
          notes: orderData.notes || 'Terima kasih atas pembelian Anda. Silakan ikuti instruksi untuk menyelesaikan pembayaran.'
        },
        custom_field1: 'JKT48Connect Purchase',
        custom_field2: new Date().toISOString(),
        custom_field3: 'Online Payment'
      };

      const response = await fetch(`${MIDTRANS_API_URL}/v1/payment-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${authString}`
        },
        body: JSON.stringify(requestBody)
      });

      const data: PaymentLinkResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error_messages?.[0] || 'Gagal membuat link pembayaran');
      }

      setSuccess(data);
      
      // Redirect to payment URL
      window.location.href = data.payment_url;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, silakan coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <main className="px-4 py-12 w-full max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden border border-dashed p-6 rounded-lg bg-gray-50 mb-12">
        <h1 className="mb-4 text-3xl font-bold text-center sm:text-left">
          Checkout - JKT48Connect
        </h1>
        <p className="text-lg text-gray-600 text-center sm:text-left max-w-2xl mx-auto sm:mx-0">
          Lengkapi pembelian Anda dengan metode pembayaran yang aman dan terpercaya.
        </p>
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 hidden lg:block"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Selection */}
        <div className="space-y-6">
          <div className="border border-dashed p-6 rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <ShoppingCartIcon className="mr-2 h-5 w-5" />
              Pilih Produk
            </h2>
            
            <div className="space-y-4">
              {availableProducts.map((product) => {
                const isSelected = orderData.selectedItems.some(item => item.id === product.id);
                const selectedItem = orderData.selectedItems.find(item => item.id === product.id);
                
                return (
                  <div 
                    key={product.id} 
                    className={`p-4 border rounded-lg transition-all cursor-pointer ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleProductToggle(product)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleProductToggle(product)}
                          className="mr-3"
                        />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(product.id, (selectedItem?.quantity || 1) - 1);
                            }}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            -
                          </button>
                          <span className="mx-3 font-semibold">{selectedItem?.quantity || 1}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(product.id, (selectedItem?.quantity || 1) + 1);
                            }}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border border-dashed p-6 rounded-lg bg-gray-50">
            <h3 className="text-lg font-bold mb-4">Ringkasan Pesanan</h3>
            {orderData.selectedItems.length === 0 ? (
              <p className="text-gray-600">Belum ada produk yang dipilih</p>
            ) : (
              <div className="space-y-3">
                {orderData.selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatCurrency(orderData.totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information & Payment */}
        <div className="space-y-6">
          <div className="border border-dashed p-6 rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <UserIcon className="mr-2 h-5 w-5" />
              Informasi Pelanggan
            </h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Customer Name */}
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium mb-2">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={orderData.customerName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={orderData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Nomor Telepon *
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={orderData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="081234567890"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={orderData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Catatan tambahan untuk pesanan Anda..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Payment Methods Info */}
          <div className="border border-dashed p-6 rounded-lg bg-gray-50">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <CreditCardIcon className="mr-2 h-5 w-5" />
              Metode Pembayaran
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-2">
                  <CreditCardIcon className="w-4 h-4 text-blue-600" />
                </div>
                <span>Kartu Kredit</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-2">
                  <BanknotesIcon className="w-4 h-4 text-green-600" />
                </div>
                <span>Transfer Bank</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-2">
                  <PhoneIcon className="w-4 h-4 text-purple-600" />
                </div>
                <span>GoPay</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center mr-2">
                  <ShoppingCartIcon className="w-4 h-4 text-orange-600" />
                </div>
                <span>ShopeePay</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center mr-2">
                  <ShoppingCartIcon className="w-4 h-4 text-red-600" />
                </div>
                <span>Indomaret</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-2">
                  <ShoppingCartIcon className="w-4 h-4 text-blue-600" />
                </div>
                <span>Alfamart</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={createPaymentLink}
            disabled={isLoading || orderData.selectedItems.length === 0}
            className={`w-full py-4 px-6 rounded-lg font-medium transition-colors ${
              isLoading || orderData.selectedItems.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses Pembayaran...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCardIcon className="mr-2 h-5 w-5" />
                Bayar Sekarang - {formatCurrency(orderData.totalAmount)}
              </div>
            )}
          </button>

          {/* Security Info */}
          <div className="text-center text-sm text-gray-600">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pembayaran Aman dengan Midtrans
            </div>
            <p>Transaksi Anda dilindungi dengan enkripsi SSL 256-bit</p>
          </div>
        </div>
      </div>
    </main>
  );
  }
