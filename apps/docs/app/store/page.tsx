'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCardIcon, BanknotesIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaymentFormData {
  orderId: string;
  amount: number;
  bank: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface MidtransResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  permata_va_number?: string;
  bill_key?: string;
  biller_code?: string;
  fraud_status: string;
}

const MIDTRANS_SERVER_KEY = process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || 'Mid-server-_9x9KcIumzkO0yMo-UXaiupS';
const MIDTRANS_API_URL = 'https://api.midtrans.com/v2/charge';

// Available payment methods
const PAYMENT_METHODS = [
  { value: 'bca', label: 'BCA Virtual Account', icon: '🏦' },
  { value: 'bni', label: 'BNI Virtual Account', icon: '🏦' },
  { value: 'bri', label: 'BRI Virtual Account', icon: '🏦' },
  { value: 'mandiri', label: 'Mandiri Bill Payment', icon: '🏦' },
  { value: 'permata', label: 'Permata Virtual Account', icon: '🏦' },
  { value: 'cimb', label: 'CIMB Niaga Virtual Account', icon: '🏦' },
];

export default function PaymentPage() {
  const [formData, setFormData] = useState<PaymentFormData>({
    orderId: '',
    amount: 0,
    bank: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentResult, setPaymentResult] = useState<MidtransResponse | null>(null);

  // Generate order ID on component mount
  useEffect(() => {
    const generateOrderId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `order-${timestamp}-${random}`;
    };

    setFormData(prev => ({
      ...prev,
      orderId: generateOrderId()
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.orderId || !formData.amount || !formData.bank || !formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setError('Semua field harus diisi');
      return false;
    }

    if (formData.amount < 10000) {
      setError('Minimum pembayaran adalah Rp 10.000');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      setError('Format email tidak valid');
      return false;
    }

    if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(formData.customerPhone)) {
      setError('Format nomor telepon tidak valid');
      return false;
    }

    return true;
  };

  const createMidtransPayload = () => {
    const basePayload = {
      transaction_details: {
        order_id: formData.orderId,
        gross_amount: formData.amount
      },
      customer_details: {
        first_name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone
      }
    };

    switch (formData.bank) {
      case 'bca':
      case 'bni':
      case 'bri':
      case 'cimb':
        return {
          ...basePayload,
          payment_type: 'bank_transfer',
          bank_transfer: {
            bank: formData.bank
          }
        };
      case 'mandiri':
        return {
          ...basePayload,
          payment_type: 'echannel',
          echannel: {
            bill_info1: 'Payment:',
            bill_info2: 'Online purchase'
          }
        };
      case 'permata':
        return {
          ...basePayload,
          payment_type: 'permata'
        };
      default:
        throw new Error('Invalid bank selection');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const payload = createMidtransPayload();
      
      // Create base64 encoded auth string
      const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);
      
      const response = await fetch('/api/midtrans-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload,
          authString
        }),
      });

      if (!response.ok) {
        throw new Error('Payment request failed');
      }

      const result: MidtransResponse = await response.json();
      
      if (result.status_code === '201') {
        setPaymentResult(result);
        // Reset form
        setFormData(prev => ({
          ...prev,
          amount: 0,
          bank: '',
          customerName: '',
          customerEmail: '',
          customerPhone: ''
        }));
      } else {
        setError(result.status_message || 'Payment failed');
      }
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentInstructions = (result: MidtransResponse) => {
    if (result.va_numbers && result.va_numbers.length > 0) {
      return {
        title: `Virtual Account ${result.va_numbers[0].bank.toUpperCase()}`,
        number: result.va_numbers[0].va_number,
        instruction: `Transfer ke nomor Virtual Account di atas melalui ATM, mobile banking, atau internet banking ${result.va_numbers[0].bank.toUpperCase()}`
      };
    }
    
    if (result.permata_va_number) {
      return {
        title: 'Permata Virtual Account',
        number: result.permata_va_number,
        instruction: 'Transfer ke nomor Virtual Account di atas melalui ATM, mobile banking, atau internet banking Permata'
      };
    }
    
    if (result.bill_key && result.biller_code) {
      return {
        title: 'Mandiri Bill Payment',
        number: `${result.biller_code} - ${result.bill_key}`,
        instruction: 'Bayar melalui ATM Mandiri dengan memasukkan Biller Code dan Bill Key di atas'
      };
    }
    
    return {
      title: 'Payment Information',
      number: result.transaction_id,
      instruction: 'Silakan lakukan pembayaran sesuai instruksi yang diberikan'
    };
  };

  if (paymentResult) {
    const paymentInfo = getPaymentInstructions(paymentResult);
    
    return (
      <main className="px-4 py-12 w-full max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="border border-dashed p-8 rounded-lg bg-gray-50 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Created Successfully!</h1>
              <p className="text-lg text-gray-600">
                Silakan lakukan pembayaran sesuai instruksi di bawah
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg mb-6 text-left border">
              <h3 className="font-semibold mb-4 text-xl">{paymentInfo.title}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono font-medium">{paymentResult.order_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-lg">{formatCurrency(Number(paymentResult.gross_amount))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Number:</span>
                  <span className="font-mono font-medium text-lg bg-blue-50 px-3 py-1 rounded">{paymentInfo.number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">{paymentResult.transaction_status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction Time:</span>
                  <span className="font-medium">{paymentResult.transaction_time}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold mb-2">Payment Instructions:</h4>
              <p className="text-blue-800">{paymentInfo.instruction}</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setPaymentResult(null);
                  setFormData(prev => ({
                    ...prev,
                    orderId: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                  }));
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Payment
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-12 w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden border border-dashed p-6 rounded-lg bg-gray-50 mb-12">
        <h1 className="mb-4 text-3xl font-bold text-center sm:text-left">
          Pembayaran Midtrans
        </h1>
        <p className="text-lg text-gray-600 text-center sm:text-left max-w-2xl mx-auto sm:mx-0">
          Lakukan pembayaran dengan mudah menggunakan berbagai metode pembayaran yang tersedia.
        </p>
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 hidden lg:block"></div>
      </div>

      {/* Payment Form */}
      <div className="max-w-2xl mx-auto">
        <div className="border border-dashed p-8 rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Payment</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order ID Field (Read-only) */}
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium mb-2">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                name="orderId"
                value={formData.orderId}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 font-mono text-sm"
                readOnly
              />
            </div>

            {/* Amount Field */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Amount (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="10000"
                  disabled={isLoading}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Minimum: Rp 10.000</p>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label htmlFor="bank" className="block text-sm font-medium mb-2">
                Payment Method
              </label>
              <select
                id="bank"
                name="bank"
                value={formData.bank}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                disabled={isLoading}
              >
                <option value="">Pilih metode pembayaran</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.icon} {method.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name Field */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-2">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter customer name"
                disabled={isLoading}
              />
            </div>

            {/* Customer Email Field */}
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-2">
                Customer Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter customer email"
                disabled={isLoading}
              />
            </div>

            {/* Customer Phone Field */}
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium mb-2">
                Customer Phone
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="081234567890"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCardIcon className="mr-2 h-5 w-5" />
                  Create Payment
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Payment Methods Info */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="border border-dashed p-6 rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-3">🏦 Virtual Account</h3>
            <p className="text-sm text-gray-600 mb-2">
              Tersedia untuk BCA, BNI, BRI, Permata, dan CIMB Niaga
            </p>
            <p className="text-sm text-gray-600">
              Transfer langsung melalui ATM, mobile banking, atau internet banking
            </p>
          </div>
          
          <div className="border border-dashed p-6 rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-3">💳 Mandiri Bill Payment</h3>
            <p className="text-sm text-gray-600 mb-2">
              Bayar melalui ATM Mandiri
            </p>
            <p className="text-sm text-gray-600">
              Menggunakan Biller Code dan Bill Key yang diberikan
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
