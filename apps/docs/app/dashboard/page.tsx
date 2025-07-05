'use client';

import { useState, useEffect } from 'react';
import { User, Key, CreditCard, LogOut, Eye, EyeOff, Edit, Check, X, QrCode } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

const API_BASE_URL = 'https://backend-dashboard-lac.vercel.app';
const JKT48_API_KEY = 'JKTCONNECT';

interface User {
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
}

interface Member {
  _id: string;
  name: string;
  nicknames: string[];
  img: string;
  img_alt: string;
  url: string;
  group: string;
  is_graduate: boolean;
  generation: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [editingOshi, setEditingOshi] = useState(false);
  const [selectedOshi, setSelectedOshi] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    checkAuth();
    fetchMembers();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('jkt48_token');
    if (!token) {
      setAuthError('Please login to access dashboard');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        setSelectedOshi(data.data.oshi);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setAuthError('Authentication failed. Please login again.');
      localStorage.removeItem('jkt48_token');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`https://v2.jkt48connect.my.id/api/jkt48/members?apikey=${JKT48_API_KEY}`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data.filter((member: Member) => !member.is_graduate));
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jkt48_token');
    window.location.reload();
  };

  const updateOshi = async () => {
    if (!selectedOshi || !user) return;

    try {
      const token = localStorage.getItem('jkt48_token');
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oshi: selectedOshi })
      });

      if (response.ok) {
        setUser({ ...user, oshi: selectedOshi });
        setEditingOshi(false);
      }
    } catch (error) {
      console.error('Failed to update oshi:', error);
    }
  };

  const getCurrentOshiMember = () => {
    return members.find(member => 
      member.name === user?.oshi || 
      member.nicknames.some(nick => nick === user?.oshi)
    );
  };

  const generateBarcodeUrl = (text: string) => {
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(text)}&code=Code128&dpi=96&dataseparator=&unit=Fit&imagetype=Png&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">{authError}</p>
          <a href="/login" className={cn(buttonVariants({ variant: 'default' }))}>
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const currentOshiMember = getCurrentOshiMember();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">JKT48Connect Dashboard</h1>
          <button
            onClick={handleLogout}
            className={cn(buttonVariants({ variant: 'outline' }), 'text-red-600 hover:text-red-700')}
          >
            <LogOutIcon className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  )}>
                    {user?.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user?.type}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{user?.username}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">@</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Number</p>
                    <p className="font-medium">{user?.memberNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <KeyIcon className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">API Key</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium font-mono text-sm">
                        {showApiKey ? user?.apiKey : '••••••••••••••••'}
                      </p>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showApiKey ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="font-medium">Rp {user?.balance?.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Member Barcode</h3>
                <button
                  onClick={() => setShowBarcode(!showBarcode)}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                  <QrCodeIcon className="w-4 h-4 mr-2" />
                  {showBarcode ? 'Hide' : 'Show'} Barcode
                </button>
              </div>
              
              {showBarcode && (
                <div className="text-center">
                  <img 
                    src={generateBarcodeUrl(user?.barcode || '')}
                    alt="Member Barcode"
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-500 font-mono">{user?.barcode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Oshi Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">My Oshi</h3>
                <button
                  onClick={() => setEditingOshi(!editingOshi)}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                  <EditIcon className="w-4 h-4 mr-2" />
                  Edit
                </button>
              </div>

              {editingOshi ? (
                <div className="space-y-4">
                  <select
                    value={selectedOshi}
                    onChange={(e) => setSelectedOshi(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Oshi</option>
                    {members.map((member) => (
                      <option key={member._id} value={member.name}>
                        {member.name} ({member.nicknames.join(', ')})
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={updateOshi}
                      className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'flex-1')}
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingOshi(false);
                        setSelectedOshi(user?.oshi || '');
                      }}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1')}
                    >
                      <XIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {currentOshiMember ? (
                    <>
                      <img
                        src={currentOshiMember.img_alt || currentOshiMember.img}
                        alt={currentOshiMember.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h4 className="font-semibold text-gray-900">{currentOshiMember.name}</h4>
                      <p className="text-sm text-gray-500">{currentOshiMember.nicknames.join(', ')}</p>
                      <p className="text-xs text-gray-400 mt-1">{currentOshiMember.generation}</p>
                    </>
                  ) : (
                    <div className="text-gray-500">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <UserIcon className="w-8 h-8" />
                      </div>
                      <p>{user?.oshi || 'No oshi selected'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type</span>
                  <span className="font-medium capitalize">{user?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">API Calls</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
