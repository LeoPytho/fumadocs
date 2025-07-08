'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, CheckCircleIcon, XCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { createMetadata } from '@/lib/metadata';

const API_BASE_URL = 'https://backend-dashboard-lac.vercel.app';


interface TokenData {
  id: string;
  tokenCode: string;
  name: string;
  description: string;
  usageLimit: number;
  usageCount: number;
  remainingUses: number;
  expiresAt: string | null;
  whatsappNumber: string | null;
  isActive: boolean;
}

interface TokenUsage {
  id: string;
  tokenName: string;
  username: string | null;
  phone: string | null;
  purpose: string;
  metadata: any;
  userInfo: any;
  usedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

const getStatusColor = (status: 'active' | 'inactive' | 'expired' | 'limit_exceeded') => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'expired':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'limit_exceeded':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTokenStatus = (token: TokenData): 'active' | 'inactive' | 'expired' | 'limit_exceeded' => {
  if (!token.isActive) return 'inactive';
  if (token.expiresAt && new Date() > new Date(token.expiresAt)) return 'expired';
  if (token.usageCount >= token.usageLimit) return 'limit_exceeded';
  return 'active';
};

export default function TokenValidation() {
  const [tokenCode, setTokenCode] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [purpose, setPurpose] = useState('');
  const [metadata, setMetadata] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [validatedToken, setValidatedToken] = useState<TokenData | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'validate' | 'use' | 'history'>('validate');

  const validateToken = async () => {
    if (!tokenCode.trim()) {
      setError('Token code is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/tokens/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenCode: tokenCode.trim(),
          whatsappNumber: whatsappNumber.trim() || undefined,
        }),
      });

      const result: ApiResponse<TokenData> = await response.json();

      if (result.success && result.data) {
        setValidatedToken(result.data);
        setSuccess('Token validated successfully!');
      } else {
        setError(result.message || 'Token validation failed');
        setValidatedToken(null);
      }
    } catch (err) {
      setError('Failed to connect to the server');
      setValidatedToken(null);
    } finally {
      setLoading(false);
    }
  };

  const useToken = async () => {
    if (!tokenCode.trim()) {
      setError('Token code is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const requestBody: any = {
        tokenCode: tokenCode.trim(),
        purpose: purpose.trim() || 'General use',
      };

      if (whatsappNumber.trim()) {
        requestBody.whatsappNumber = whatsappNumber.trim();
      }

      if (metadata.trim()) {
        try {
          requestBody.metadata = JSON.parse(metadata);
        } catch {
          requestBody.metadata = { raw: metadata };
        }
      }

      if (userInfo.trim()) {
        try {
          requestBody.userInfo = JSON.parse(userInfo);
        } catch {
          requestBody.userInfo = { raw: userInfo };
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/tokens/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result: ApiResponse<any> = await response.json();

      if (result.success) {
        setSuccess(`Token used successfully! Remaining uses: ${result.data?.remainingUses}`);
        // Refresh token info after usage
        validateToken();
      } else {
        setError(result.message || 'Token usage failed');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const getTokenUsageHistory = async () => {
    if (!tokenCode.trim()) {
      setError('Token code is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/tokens/${tokenCode.trim()}/usage`);
      const result: ApiResponse<TokenUsage[]> = await response.json();

      if (result.success && result.data) {
        setTokenUsage(result.data);
      } else {
        setError(result.message || 'Failed to fetch usage history');
        setTokenUsage([]);
      }
    } catch (err) {
      setError('Failed to connect to the server');
      setTokenUsage([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history' && tokenCode.trim()) {
      getTokenUsageHistory();
    }
  }, [activeTab, tokenCode]);

  return (
    <main className="px-4 py-12 z-[2] w-full max-w-[1400px] mx-auto">
      <div className="relative overflow-hidden border border-dashed p-6 mb-6">
        <h1 className="mb-4 text-xl font-medium">
          Token Validation System
        </h1>
        <p className="text-fd-muted-foreground">
          Validate, use, and track token usage with JKT48Connect API
        </p>
        <span className="absolute text-xs left-6 bottom-6 text-fd-muted-foreground font-mono">
          JKT48Connect API
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-dashed mb-6">
        {[
          { id: 'validate', label: 'Validate Token', icon: CheckCircleIcon },
          { id: 'use', label: 'Use Token', icon: PlusIcon },
          { id: 'history', label: 'Usage History', icon: ClockIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-fd-primary text-fd-primary'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-2">
          <XCircleIcon className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 border border-green-200 bg-green-50 rounded-lg flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Token Input Section */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Token Code *</label>
          <input
            type="text"
            value={tokenCode}
            onChange={(e) => setTokenCode(e.target.value)}
            placeholder="Enter your token code"
            className="w-full p-3 border border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">WhatsApp Number (Optional)</label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="e.g., +6281234567890"
            className="w-full p-3 border border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary"
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'validate' && (
        <div className="space-y-6">
          <button
            onClick={validateToken}
            disabled={loading}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'w-full md:w-auto',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? 'Validating...' : 'Validate Token'}
          </button>

          {validatedToken && (
            <TokenCard token={validatedToken} />
          )}
        </div>
      )}

      {activeTab === 'use' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Purpose (Optional)</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., API access, bot usage"
                className="w-full p-3 border border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Metadata (JSON, Optional)</label>
              <textarea
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                placeholder='{"feature": "example", "version": "1.0"}'
                rows={3}
                className="w-full p-3 border border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">User Info (JSON, Optional)</label>
              <textarea
                value={userInfo}
                onChange={(e) => setUserInfo(e.target.value)}
                placeholder='{"name": "John Doe", "app": "MyApp"}'
                rows={3}
                className="w-full p-3 border border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
            </div>
          </div>

          <button
            onClick={useToken}
            disabled={loading}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'w-full md:w-auto',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? 'Using Token...' : 'Use Token'}
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <button
            onClick={getTokenUsageHistory}
            disabled={loading}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-full md:w-auto',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? 'Loading...' : 'Refresh History'}
          </button>

          {tokenUsage.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Usage History ({tokenUsage.length} entries)</h3>
              <div className="space-y-3">
                {tokenUsage.map((usage) => (
                  <UsageCard key={usage.id} usage={usage} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-fd-muted-foreground">
              No usage history found for this token.
            </div>
          )}
        </div>
      )}

      {/* API Documentation */}
      <div className="mt-16 border border-dashed p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">API Endpoints</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>POST</strong> <code>/api/tokens/validate</code> - Validate a token
          </div>
          <div>
            <strong>POST</strong> <code>/api/tokens/use</code> - Use a token
          </div>
          <div>
            <strong>GET</strong> <code>/api/tokens/:tokenCode/usage</code> - Get usage history
          </div>
        </div>
      </div>
    </main>
  );
}

function TokenCard({ token }: { token: TokenData }) {
  const status = getTokenStatus(token);
  const statusLabels = {
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired',
    limit_exceeded: 'Limit Exceeded',
  };

  return (
    <div className="border border-dashed p-6 rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">{token.name}</h3>
          <p className="text-sm text-fd-muted-foreground">{token.description}</p>
        </div>
        <span className={cn(
          "px-3 py-1 text-xs font-medium rounded-full border",
          getStatusColor(status)
        )}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-fd-muted-foreground">Usage</p>
          <p className="font-medium">{token.usageCount} / {token.usageLimit}</p>
        </div>
        <div>
          <p className="text-fd-muted-foreground">Remaining</p>
          <p className="font-medium">{token.remainingUses}</p>
        </div>
        <div>
          <p className="text-fd-muted-foreground">Expires</p>
          <p className="font-medium">
            {token.expiresAt ? new Date(token.expiresAt).toLocaleDateString() : 'Never'}
          </p>
        </div>
        <div>
          <p className="text-fd-muted-foreground">WhatsApp</p>
          <p className="font-medium">{token.whatsappNumber || 'Any'}</p>
        </div>
      </div>
    </div>
  );
}

function UsageCard({ usage }: { usage: TokenUsage }) {
  return (
    <div className="border border-dashed p-4 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium">{usage.purpose}</h4>
          <p className="text-sm text-fd-muted-foreground">
            {usage.username || 'Anonymous'} • {usage.phone || 'No phone'}
          </p>
        </div>
        <span className="text-xs text-fd-muted-foreground">
          {new Date(usage.usedAt).toLocaleString()}
        </span>
      </div>
      
      {(usage.metadata || usage.userInfo) && (
        <div className="mt-3 space-y-2">
          {usage.metadata && (
            <div>
              <p className="text-xs font-medium text-fd-muted-foreground">Metadata:</p>
              <code className="text-xs bg-fd-muted/10 px-2 py-1 rounded">
                {JSON.stringify(usage.metadata, null, 2)}
              </code>
            </div>
          )}
          {usage.userInfo && (
            <div>
              <p className="text-xs font-medium text-fd-muted-foreground">User Info:</p>
              <code className="text-xs bg-fd-muted/10 px-2 py-1 rounded">
                {JSON.stringify(usage.userInfo, null, 2)}
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
