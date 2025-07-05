'use client';

import { useState } from 'react';
import { PlusIcon, UserIcon, MailIcon, PhoneIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { createMetadata } from '@/lib/metadata';
import Link from 'fumadocs-core/link';
import Design from './design.png';

// Note: This metadata export should be in a separate file for client components
// export const metadata = createMetadata({
//   title: 'Register - JKT48Connect',
//   description: 'Register untuk mendapatkan akses ke JKT48Connect API dan layanan eksklusif',
//   openGraph: {
//     url: 'https://docs.jkt48connect.my.id/register',
//   },
// });

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
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

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<ApiResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
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
          password: formData.password
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      if (data.success) {
        setSuccess(data);
        // Reset form
        setFormData({
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, silakan coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="px-4 py-12 z-[2] w-full max-w-[1400px] mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="border border-dashed p-8 rounded-lg bg-fd-background/50 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Registrasi Berhasil!</h1>
              <p className="text-lg text-fd-muted-foreground">
                Selamat datang di JKT48Connect, {success.data?.user.username}!
              </p>
            </div>

            <div className="bg-fd-muted/10 p-6 rounded-lg mb-6 text-left">
              <h3 className="font-semibold mb-4">Detail Akun Anda:</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Member Number:</span>
                  <span className="font-mono font-medium">{success.data?.user.memberNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">API Key:</span>
                  <span className="font-mono font-medium text-sm">{success.data?.user.apiKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{success.data?.user.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Type:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{success.data?.user.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Barcode:</span>
                  <span className="font-mono font-medium">{success.data?.user.barcode}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href="https://docs.jkt48connect.my.id"
                className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
              >
                Lihat Dokumentasi
              </Link>
              <Link
                href="https://www.jkt48connect.my.id"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                Ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-12 z-[2] w-full max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden border border-dashed p-6 rounded-lg bg-fd-background/50 mb-12">
        <h1 className="mb-4 text-3xl font-bold text-center sm:text-left">
          Bergabung dengan JKT48Connect
        </h1>
        <p className="text-lg text-fd-muted-foreground text-center sm:text-left max-w-2xl mx-auto sm:mx-0">
          Daftar sekarang untuk mendapatkan akses ke JKT48Connect API dan layanan eksklusif lainnya.
        </p>
        <Image
          src={Design}
          alt="Abstract design preview"
          priority
          className="absolute right-0 bottom-0 w-[400px] min-w-[400px] opacity-20 hidden lg:block pointer-events-none select-none"
        />
      </div>

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto">
        <div className="border border-dashed p-8 rounded-lg bg-fd-background/50">
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
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-fd-muted-foreground" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-fd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary focus:border-transparent"
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
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-fd-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-fd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary focus:border-transparent"
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
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-fd-muted-foreground" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-fd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary focus:border-transparent"
                  placeholder="081234567890"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-fd-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-fd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary focus:border-transparent"
                  placeholder="Masukkan password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fd-muted-foreground hover:text-fd-primary"
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
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-fd-muted-foreground" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-fd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary focus:border-transparent"
                  placeholder="Konfirmasi password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fd-muted-foreground hover:text-fd-primary"
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
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'w-full',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </>
              ) : (
                <>
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-fd-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-fd-primary hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="border border-dashed p-6 rounded-lg bg-fd-background/50 text-center">
            <div className="w-12 h-12 bg-fd-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-fd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">API Access</h3>
            <p className="text-sm text-fd-muted-foreground">
              Akses ke JKT48Connect API dengan rate limit yang generous
            </p>
          </div>

          <div className="border border-dashed p-6 rounded-lg bg-fd-background/50 text-center">
            <div className="w-12 h-12 bg-fd-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-fd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-fd-muted-foreground">
              Keamanan data terjamin dengan enkripsi end-to-end
            </p>
          </div>

          <div className="border border-dashed p-6 rounded-lg bg-fd-background/50 text-center">
            <div className="w-12 h-12 bg-fd-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-fd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-sm text-fd-muted-foreground">
              Dukungan 24/7 untuk membantu pengembangan aplikasi Anda
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
