'use client';

import { useEffect, useState } from 'react';
import { KeyboardIcon, CpuIcon, RocketIcon } from 'lucide-react';
import { Counter } from './counter';

interface StatsData {
  totalKeys: number;
  totalRequests: number;
}

export function StatisticsClient() {
  const [stats, setStats] = useState<StatsData>({ totalKeys: 173, totalRequests: 1250250 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://v2.jkt48connect.com/api/admin/stats?username=vzy&password=vzy');
        const data = await response.json();
        
        if (data.status && data.data) {
          setStats({
            totalKeys: data.data.summary.totalKeys || 0,
            totalRequests: data.data.summary.totalRequests || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden border-x border-t">
      <div className="relative bg-gradient-to-br from-fd-primary/5 via-transparent to-fd-secondary/5 px-8 py-16 sm:py-24">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, var(--color-fd-primary) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, var(--color-fd-secondary) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
            <RocketIcon className="size-4" />
            <p>Trusted by Developers</p>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">
            Powering JKT48 Applications
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-secondary">
              Across Indonesia
            </span>
          </h2>
          
          <p className="text-fd-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
            Join thousands of developers who trust JKT48Connect to build amazing applications with reliable JKT48 data.
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Total API Keys */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-fd-primary/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-fd-background/80 backdrop-blur-sm border border-fd-border rounded-2xl p-8 group-hover:border-fd-primary/50 transition-all duration-300">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-fd-primary/10 text-fd-primary">
                  <KeyboardIcon className="size-6" />
                </div>
                <div className="text-4xl font-bold mb-2">
                  {loading ? (
                    <div className="h-12 bg-fd-muted animate-pulse rounded" />
                  ) : (
                    <Counter end={stats.totalKeys} duration={2500} />
                  )}
                </div>
                <div className="text-fd-muted-foreground font-medium">Active API Keys</div>
                <p className="text-sm text-fd-muted-foreground/80 mt-2">
                  Developers using JKT48Connect
                </p>
              </div>
            </div>

            {/* Total Requests */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-l from-fd-secondary/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-fd-background/80 backdrop-blur-sm border border-fd-border rounded-2xl p-8 group-hover:border-fd-secondary/50 transition-all duration-300">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-fd-secondary/10 text-fd-secondary">
                  <CpuIcon className="size-6" />
                </div>
                <div className="text-4xl font-bold mb-2">
                  {loading ? (
                    <div className="h-12 bg-fd-muted animate-pulse rounded" />
                  ) : (
                    <Counter end={stats.totalRequests} duration={3000} suffix="+" />
                  )}
                </div>
                <div className="text-fd-muted-foreground font-medium">API Requests Served</div>
                <p className="text-sm text-fd-muted-foreground/80 mt-2">
                  Total requests processed
                </p>
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-fd-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time data</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-fd-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>99.9% uptime</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-fd-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>24/7 monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
