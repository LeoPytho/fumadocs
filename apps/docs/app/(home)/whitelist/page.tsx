"use client";

import React, { useState, useRef } from 'react';
import { Plus, Shield, Globe, Server, CheckCircle, XCircle, Loader, Info } from 'lucide-react';

const API_BASE_URL = 'https://v2.jkt48connect.my.id';

interface ResultState {
  success: boolean;
  message: string;
}

export default function IPWhitelistAdd() {
  const [apiKey, setApiKey] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [bulkIPs, setBulkIPs] = useState<string>('');
  const [bulkDescription, setBulkDescription] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('single');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [currentIP, setCurrentIP] = useState<string>('');
  const [loadingCurrentIP, setLoadingCurrentIP] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current IP
  const getCurrentIP = async () => {
    setLoadingCurrentIP(true);
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setCurrentIP(data.ip);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to detect current IP: ' + (error instanceof Error ? error.message : String(error))
      });
    }
    setLoadingCurrentIP(false);
  };

  // Add single IP
  const addSingleIP = async () => {
    if (!apiKey || !ipAddress) {
      setResult({
        success: false,
        message: 'API Key and IP Address are required'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ip-whitelist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          ipAddress,
          description
        })
      });

      const data = await response.json();
      setResult({
        success: data.status,
        message: data.message || (data.status ? 'IP added successfully!' : 'Failed to add IP')
      });

      if (data.status) {
        setIpAddress('');
        setDescription('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error: ' + (error instanceof Error ? error.message : String(error))
      });
    }
    setLoading(false);
  };

  // Add current IP
  const addCurrentIP = async () => {
    if (!apiKey) {
      setResult({
        success: false,
        message: 'API Key is required'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ip-whitelist/add-current`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          description: description || 'Auto-added current IP'
        })
      });

      const data = await response.json();
      setResult({
        success: data.status,
        message: data.message || (data.status ? 'Current IP added successfully!' : 'Failed to add current IP')
      });

      if (data.status) {
        setDescription('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error: ' + (error instanceof Error ? error.message : String(error))
      });
    }
    setLoading(false);
  };

  // Add bulk IPs
  const addBulkIPs = async () => {
    if (!apiKey || !bulkIPs) {
      setResult({
        success: false,
        message: 'API Key and IP Addresses are required'
      });
      return;
    }

    const ipArray = bulkIPs.split('\n').filter(ip => ip.trim()).map(ip => ip.trim());
    if (ipArray.length === 0) {
      setResult({
        success: false,
        message: 'Please enter at least one IP address'
      });
      return;
    }

    if (ipArray.length > 50) {
      setResult({
        success: false,
        message: 'Maximum 50 IP addresses allowed per request'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ip-whitelist/bulk-add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          ipAddresses: ipArray,
          description: bulkDescription
        })
      });

      const data = await response.json();
      setResult({
        success: data.status,
        message: data.message || (data.status ? `${ipArray.length} IPs added successfully!` : 'Failed to add IPs')
      });

      if (data.status) {
        setBulkIPs('');
        setBulkDescription('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error: ' + error.message
      });
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getCurrentIP();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="px-4 py-12 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            IP Whitelist Manager
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Secure your JKT48Connect API access by adding trusted IP addresses to your whitelist. 
            Only whitelisted IPs can use your API key.
          </p>
        </div>

        {/* Current IP Detection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Current IP</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {loadingCurrentIP ? (
                <Loader className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <code className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200">
                  {currentIP || 'Detecting...'}
                </code>
              )}
            </div>
            <button
              onClick={() => setIpAddress(currentIP)}
              disabled={!currentIP}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Use This IP
            </button>
          </div>
        </div>

        {/* API Key Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API Configuration</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="JKTCONNECT_your_api_key_here"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'single'
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Single IP
            </button>
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'current'
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Current IP
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'bulk'
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Bulk Add
            </button>
          </div>

          <div className="p-6">
            {/* Single IP Tab */}
            {activeTab === 'single' && (
              <form onSubmit={(e) => { e.preventDefault(); addSingleIP(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IP Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.100 or 2001:db8::1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Office IP, Home IP, Server IP, etc."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add IP to Whitelist
                </button>
              </form>
            )}

            {/* Current IP Tab */}
            {activeTab === 'current' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Auto-detect Current IP</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        This will automatically detect and add your current public IP address to the whitelist.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Auto-added current IP"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
                <button
                  onClick={addCurrentIP}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  Add Current IP ({currentIP})
                </button>
              </div>
            )}

            {/* Bulk Add Tab */}
            {activeTab === 'bulk' && (
              <form onSubmit={(e) => { e.preventDefault(); addBulkIPs(); }} className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Bulk IP Addition</h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Enter multiple IP addresses, one per line. Maximum 50 IPs per request.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IP Addresses (one per line) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bulkIPs}
                    onChange={(e) => setBulkIPs(e.target.value)}
                    placeholder="192.168.1.100&#10;192.168.1.101&#10;10.0.0.50&#10;2001:db8::1"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {bulkIPs.split('\n').filter(ip => ip.trim()).length} IPs entered (max 50)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description for all IPs (Optional)
                  </label>
                  <input
                    type="text"
                    value={bulkDescription}
                    onChange={(e) => setBulkDescription(e.target.value)}
                    placeholder="Office network IPs, Server farm IPs, etc."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Multiple IPs to Whitelist
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Result Message */}
        {result && (
          <div className={`rounded-xl p-6 mb-8 border ${
            result.success
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <p className={`font-medium ${
                result.success
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        )}

        {/* Features Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Enhanced Security</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Protect your API keys by restricting access to only trusted IP addresses.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">IPv4 & IPv6 Support</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Full support for both IPv4 and IPv6 address formats with automatic validation.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bulk Operations</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Add up to 50 IP addresses at once for efficient management of large networks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Powered by{' '}
            <a 
              href="https://www.jkt48connect.my.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              JKT48Connect API
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
