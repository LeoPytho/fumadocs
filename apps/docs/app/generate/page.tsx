'use client';

import { useState } from 'react';
import { PlusIcon, CheckCircleIcon, XCircleIcon, KeyIcon, CopyIcon, RefreshCwIcon } from 'lucide-react';

const API_BASE_URL = 'https://v2.jkt48connect.my.id';

interface ApiKeyData {
  key: string;
  owner: string;
  email: string;
  type: string;
  limit: number;
  expireAt: string | null;
  active: boolean;
  createdAt: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data?: ApiKeyData;
}

export default function ApiKeyGenerator() {
  const [owner, setOwner] = useState('');
  const [email, setEmail] = useState('');
  const [generatedKey, setGeneratedKey] = useState<ApiKeyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const generateApiKey = async () => {
    if (!owner.trim()) {
      setError('Owner name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/create-key?apikey=JKTCONNECT`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'vzy',
          password: 'vzy',
          owner: owner.trim(),
          email: email.trim(),
          type: 'free',
          apikey: ''
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.status && result.data) {
        setGeneratedKey(result.data);
        setSuccess('API key generated successfully!');
      } else {
        setError(result.message || 'Failed to generate API key');
        setGeneratedKey(null);
      }
    } catch (err) {
      setError('Failed to connect to the server');
      setGeneratedKey(null);
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = async () => {
    if (!generatedKey?.key) return;
    
    try {
      await navigator.clipboard.writeText(generatedKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resetForm = () => {
    setOwner('');
    setEmail('');
    setGeneratedKey(null);
    setError('');
    setSuccess('');
    setCopied(false);
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
    <main className="px-4 py-6 sm:py-12 z-[2] w-full max-w-[1400px] mx-auto">
      <div className="relative overflow-hidden border border-dashed p-4 sm:p-6 mb-6 rounded-lg">
        <h1 className="mb-4 text-xl sm:text-2xl font-medium">
          Free API Key Generator
        </h1>
        <p className="text-sm sm:text-base text-fd-muted-foreground">
          Generate your free API key for JKT48Connect services
        </p>
        <span className="absolute text-xs left-4 sm:left-6 bottom-4 sm:bottom-6 text-fd-muted-foreground font-mono">
          JKT48Connect API v2
        </span>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg flex items-start gap-2">
          <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 border border-green-200 bg-green-50 rounded-lg flex items-start gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      {!generatedKey ? (
        /* Generation Form */
        <div className="space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary text-sm"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generateApiKey}
              disabled={loading || !owner.trim() || !email.trim()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-fd-primary text-fd-primary-foreground rounded-lg font-medium transition-colors hover:bg-fd-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCwIcon className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  Generate Free API Key
                </>
              )}
            </button>
          </div>

          {/* Info Card */}
          <div className="border border-dashed p-4 sm:p-6 rounded-lg bg-fd-muted/5">
            <div className="flex items-start gap-3">
              <KeyIcon className="w-5 h-5 text-fd-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-2 text-sm sm:text-base">Free API Key Benefits</h3>
                <ul className="text-xs sm:text-sm text-fd-muted-foreground space-y-1">
                  <li>• Free tier access to JKT48Connect API</li>
                  <li>• Limited request quota per month</li>
                  <li>• Access to basic endpoints</li>
                  <li>• Easy integration with your applications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Generated Key Display */
        <div className="space-y-6">
          <div className="border border-dashed p-4 sm:p-6 rounded-lg bg-green-50/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-green-800">API Key Generated!</h3>
                <p className="text-sm text-green-600">Your free API key is ready to use</p>
              </div>
              <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
            </div>

            {/* API Key Display */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your API Key:</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={generatedKey.key}
                    readOnly
                    className="flex-1 p-3 bg-white border border-gray-300 rounded-lg font-mono text-xs sm:text-sm select-all"
                  />
                  <button
                    onClick={copyApiKey}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-fd-primary text-fd-primary-foreground rounded-lg font-medium transition-colors hover:bg-fd-primary/90"
                  >
                    <CopyIcon className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-fd-muted-foreground mb-1">Owner</p>
                  <p className="font-medium">{generatedKey.owner}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-fd-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-xs sm:text-sm break-all">{generatedKey.email}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-fd-muted-foreground mb-1">Type</p>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                    {generatedKey.type.toUpperCase()}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-fd-muted-foreground mb-1">Limit</p>
                  <p className="font-medium">{generatedKey.limit.toLocaleString()} requests</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-fd-muted-foreground mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${
                    generatedKey.active 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {generatedKey.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-fd-muted-foreground mb-1">Created At</p>
                  <p className="font-medium text-xs sm:text-sm">{formatDate(generatedKey.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="border border-dashed p-4 sm:p-6 rounded-lg">
            <h3 className="font-medium mb-4 text-sm sm:text-base">How to Use Your API Key</h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <p className="font-medium mb-1">1. Add to Request Headers:</p>
                <code className="block p-2 sm:p-3 bg-fd-muted/10 rounded text-xs font-mono break-all">
                  Authorization: Bearer {generatedKey.key}
                </code>
              </div>
              <div>
                <p className="font-medium mb-1">2. Example cURL Request:</p>
                <code className="block p-2 sm:p-3 bg-fd-muted/10 rounded text-xs font-mono break-all">
                  curl -H "Authorization: Bearer {generatedKey.key}" https://v2.jkt48connect.my.id/api/endpoint
                </code>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 text-xs text-fd-muted-foreground">
                <span>• Keep your API key secure</span>
                <span>• Don't share it publicly</span>
                <span>• Monitor your usage limits</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetForm}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border border-dashed rounded-lg font-medium transition-colors hover:bg-fd-muted/5"
            >
              <PlusIcon className="w-4 h-4" />
              Generate Another Key
            </button>
          </div>
        </div>
      )}

      {/* API Documentation */}
      <div className="mt-12 sm:mt-16 border border-dashed p-4 sm:p-6 rounded-lg">
        <h3 className="text-base sm:text-lg font-medium mb-4">API Information</h3>
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-green-600">get</strong> 
            <code className="break-all">/api/jkt48/live?apikey=</code> 
            <span className="text-fd-muted-foreground">- Generate API key</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-blue-600">Base URL:</strong> 
            <code className="break-all">https://v2.jkt48connect.my.id</code>
          </div>
        </div>
      </div>
    </main>
  );
}
