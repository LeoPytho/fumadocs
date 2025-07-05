'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, UserIcon, MailIcon, PhoneIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { createMetadata } from '@/lib/metadata';
import Link from 'fumadocs-core/link';
import Design from './design.png';

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  oshi: string;
}

interface Member {
  _id: string;
  name: string;
  nicknames: string[];
  img: string;
  url: string;
  group: string;
  is_graduate: boolean;
  generation: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
      phone: string;
      memberNumber: string;
      apiKey: string;
      status: string;
      type: string;
      oshi: string;
      balance: number;
      barcode: string;
      createdAt: string;
    };
    jkt48ApiResult?: any;
  };
  error?: string;
}

const API_BASE_URL = 'https://backend-dashboard-lac.vercel.app';
const JKT48_API_URL = 'https://v2.jkt48connect.my.id';
const JKT48_API_KEY = 'JKTCONNECT';

export default function RegisterPage() {
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    oshi: ''
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<ApiResponse | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Load members for oshi selection
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const response = await fetch(`${JKT48_API_URL}/api/jkt48/members?apikey=${JKT48_API_KEY}`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data.filter((member: Member) => !member.is_graduate));
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, []);

  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingToken = () => {
      const existingToken = localStorage.getItem('jkt48_token');
      if (existingToken) {
        alert('Already logged in! Redirecting to dashboard...');
        return;
      }
      setIsCheckingToken(false);
    };

    checkExistingToken();
  }, []);

  // Handle redirect countdown after successful registration
  useEffect(() => {
    if (success && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (success && redirectCountdown === 0) {
      alert('Redirecting to dashboard...');
    }
  }, [success, redirectCountdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword || !formData.oshi) {
      setError('Semua field harus diisi');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username minimal 3 karakter');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }

    if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(formData.phone)) {
      setError('Format nomor telepon tidak valid (contoh: 081234567890)');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          oshi: formData.oshi
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      if (data.success && data.data?.token) {
        // Save token to localStorage
        localStorage.setItem('jkt48_token', data.data.token);
        
        setSuccess(data);
        // Reset form
        setFormData({
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          oshi: ''
        });
        
        // Start countdown for redirect
        setRedirectCountdown(5);
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, silakan coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRedirect = () => {
    alert('Redirecting to dashboard...');
  };

  // Show loading while checking token
  if (isCheckingToken) {
    return (
      <main className="px-4 py-12 w-full max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="border border-dashed p-8 rounded-lg bg-gray-50 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Memeriksa Status Login...</h1>
              <p className="text-gray-600">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="px-4 py-12 w-full max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="border border-dashed p-8 rounded-lg bg-gray-50 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Registrasi Berhasil!</h1>
              <p className="text-lg text-gray-600">
                Selamat datang di JKT48Connect, {success.data?.user.username}!
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg mb-6 text-left">
              <h3 className="font-semibold mb-4">Detail Akun Anda:</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Number:</span>
                  <span className="font-mono font-medium">{success.data?.user.memberNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Key:</span>
                  <span className="font-mono font-medium text-sm">{success.data?.user.apiKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{success.data?.user.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Oshi:</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">{success.data?.user.oshi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Barcode:</span>
                  <span className="font-mono font-medium">{success.data?.user.barcode}</span>
                </div>
              </div>
            </div>

            {/* Redirect notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-800">
                  Mengarahkan ke dashboard dalam {redirectCountdown} detik...
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleManualRedirect}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ke Dashboard Sekarang
              </button>
              <a
                href="https://docs.jkt48connect.my.id"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Lihat Dokumentasi
              </a>
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
          Bergabung dengan JKT48Connect
        </h1>
        <p className="text-lg text-gray-600 text-center sm:text-left max-w-2xl mx-auto sm:mx-0">
          Daftar sekarang untuk mendapatkan akses ke JKT48Connect API dan layanan eksklusif lainnya.
        </p>
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 hidden lg:block"></div>
      </div>

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto">
        <div className="border border-dashed p-8 rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-6 text-center">Buat Akun Baru</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan username"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Nomor Telepon
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="081234567890"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Oshi Selection */}
            <div>
              <label htmlFor="oshi" className="block text-sm font-medium mb-2">
                Pilih Oshi
              </label>
              <div className="relative">
                <select
                  id="oshi"
                  name="oshi"
                  value={formData.oshi}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  disabled={isLoading || loadingMembers}
                >
                  <option value="">
                    {loadingMembers ? 'Memuat member...' : 'Pilih oshi kamu'}
                  </option>
                  {members.map((member) => (
                    <option key={member._id} value={member.name}>
                      {member.name} ({member.nicknames.join(', ')})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Konfirmasi password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                isLoading
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
                  Mendaftar...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Daftar Sekarang
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Masuk di sini
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="border border-dashed p-6 rounded-lg bg-gray-50 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">API Access</h3>
            <p className="text-sm text-gray-600">
              Akses ke JKT48Connect API dengan rate limit yang generous
            </p>
          </div>

          <div className="border border-dashed p-6 rounded-lg bg-gray-50 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-gray-600">
              Keamanan data terjamin dengan enkripsi end-to-end
            </p>
          </div>

          <div className="border border-dashed p-6 rounded-lg bg-gray-50 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-sm text-gray-600">
              Dukungan 24/7 untuk membantu pengembangan aplikasi Anda
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
