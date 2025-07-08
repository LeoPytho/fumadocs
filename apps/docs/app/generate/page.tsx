'use client';

import { useState } from 'react';
import { 
  KeyIcon, 
  UserIcon, 
  PhoneIcon, 
  ClockIcon, 
  CheckCircleIcon,
  CopyIcon,
  AlertCircleIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

interface TokenResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    tokenCode: string;
    name: string;
    description: string;
    usageLimit: number;
    usageCount: number;
    expiresAt: string;
    whatsappNumber: string;
    isActive: boolean;
    createdAt: string;
  };
  error?: string;
}

export default function TokenGeneratorPage() {
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<TokenResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Calculate expiration date (2 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 2);

      const requestBody = {
        name: formData.name,
        description: 'Token untuk mengambil file update',
        usageLimit: 1,
        expiresAt: expiresAt.toISOString(),
        whatsappNumber: formData.whatsappNumber,
        creatorInfo: 'JKT48Connect Menejemen key'
      };

      const response = await fetch('https://backend-dashboard-lac.vercel.app/api/tokens/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result: TokenResponse = await response.json();

      if (result.success && result.data) {
        setGeneratedToken(result.data);
        setFormData({ name: '', whatsappNumber: '' });
      } else {
        setError(result.message || 'Failed to generate token');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Token generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <KeyIcon className="size-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JKT48Connect Token Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Generate your API access token for JKT48Connect file updates
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Token Generation Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <ShieldCheckIcon className="size-6 text-green-600" />
              Generate New Token
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <UserIcon className="size-4 inline mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <PhoneIcon className="size-4 inline mr-2" />
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="628123456789"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircleIcon className="size-5 text-red-600" />
                  <span className="text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <KeyIcon className="size-4" />
                    Generate Token
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Token Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <ClockIcon className="size-6 text-blue-600" />
              Token Information
            </h2>

            {generatedToken ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="size-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      Token Generated Successfully!
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Token Code
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm break-all">
                        {generatedToken.tokenCode}
                      </code>
                      <button
                        onClick={() => copyToClipboard(generatedToken.tokenCode)}
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                          'flex-shrink-0'
                        )}
                      >
                        {copied ? (
                          <CheckCircleIcon className="size-4 text-green-600" />
                        ) : (
                          <CopyIcon className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Usage Limit
                      </label>
                      <p className="text-2xl font-bold text-blue-600">{generatedToken.usageLimit}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Usage Count
                      </label>
                      <p className="text-2xl font-bold text-green-600">{generatedToken.usageCount}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expires At
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(generatedToken.expiresAt)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created At
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(generatedToken.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircleIcon className="size-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">
                      <p className="font-medium mb-1">Important:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• This token can only be used once</li>
                        <li>• Token expires in 2 days</li>
                        <li>• Keep this token secure and don't share it</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <KeyIcon className="size-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Fill the form to generate your API token
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by JKT48Connect Management • For file update access only
          </p>
        </div>
      </div>
    </div>
  );
}
