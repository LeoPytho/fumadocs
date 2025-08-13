'use client';

import { Building2, Code, ChevronDown, Package, Globe } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import Spot from '@/public/spot.png';
import { useState } from 'react';

export default function DocsPage(): React.ReactElement {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  return (
    <main className="container flex flex-col items-center py-16 text-center z-[2]">
      <div className="absolute inset-0 z-[-1] overflow-hidden duration-1000 animate-in fade-in [perspective:2000px]">
        <div
          className="absolute bottom-[20%] left-1/2 size-[1200px] origin-bottom bg-fd-primary/30 opacity-30"
          style={{
            transform: 'rotateX(75deg) translate(-50%, 400px)',
            backgroundImage:
              'radial-gradient(50% 50% at center,transparent,var(--color-fd-background)), repeating-linear-gradient(to right,var(--color-fd-primary),var(--color-fd-primary) 1px,transparent 2px,transparent 100px), repeating-linear-gradient(to bottom,var(--color-fd-primary),var(--color-fd-primary) 2px,transparent 3px,transparent 100px)',
          }}
        />
      </div>
      <div className="absolute inset-0 z-[-1] select-none overflow-hidden opacity-30">
        <Image
          alt="spot"
          src={Spot}
          sizes="100vw"
          className="size-full min-w-[800px] max-w-fd-container"
          priority
        />
      </div>
      <h1 className="mb-4 text-4xl font-semibold md:text-5xl">
        Getting Started
      </h1>
      <p className="text-fd-muted-foreground">
        You can start with jkt48connect api, or just use the core library.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <a
          href="https://github.com/j-forces"
          rel="noreferrer noopener"
          className={cn(buttonVariants({ size: 'lg' }))}
        >
          Github
        </a>
        <Link
          href="/showcase"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
        >
          Showcase
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 text-left md:grid-cols-2 w-full max-w-4xl">
        {/* Module Card */}
        <DropdownCard
          id="modules"
          isOpen={openDropdown === 'modules'}
          onToggle={() => handleDropdownToggle('modules')}
          icon={<Package className="size-full" />}
          title="Modules"
          description="Core libraries and modules for JKT48Connect"
          items={[
            {
              href: '/docs/headless',
              title: 'JKT48Connect Core',
              description: 'The core library of JKT48Connect.',
              icon: <Building2 className="size-4" />
            },
            {
              href: '/docs/ui',
              title: 'JKT48Connect API',
              description: 'The full-powered documentation for api instead.',
              icon: <Globe className="size-4" />
            }
          ]}
        />

        {/* APIs Card */}
        <DropdownCard
          id="apis"
          isOpen={openDropdown === 'apis'}
          onToggle={() => handleDropdownToggle('apis')}
          icon={<Code className="size-full" />}
          title="APIs (RestAPI)"
          description="Interactive API endpoints and playground tools"
          items={[
            {
              href: '/docs/openapi',
              title: 'JKT48Connect RestAPI',
              description: 'Interactive playground to test API features directly in your browser with real-time output.',
              icon: <Code className="size-4" />
            },
            {
              href: '/docs/playground',
              title: 'Grow A Garden API',
              description: 'Interactive playground to experiment with Garden API features and see results in real-time.',
              icon: <Building2 className="size-4" />
            }
          ]}
        />
      </div>
    </main>
  );
}

interface DropdownItem {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface DropdownCardProps {
  id: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: DropdownItem[];
}

function DropdownCard({ 
  id, 
  isOpen, 
  onToggle, 
  icon, 
  title, 
  description, 
  items 
}: DropdownCardProps): React.ReactElement {
  return (
    <div className="relative">
      <div
        className="rounded-2xl border border-transparent p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
        style={{
          backgroundImage:
            'linear-gradient(to right bottom, var(--color-fd-background) 10%, var(--color-fd-accent), var(--color-fd-background) 60%),' +
            'linear-gradient(to right bottom, rgb(40,40,40) 10%, rgb(180,180,180), rgb(30,30,30) 60%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Icon>{icon}</Icon>
            <h2 className="mb-2 text-lg font-semibold">{title}</h2>
            <p className="text-sm text-fd-muted-foreground pr-2">
              {description}
            </p>
          </div>
          <ChevronDown 
            className={`size-5 text-fd-muted-foreground transition-transform duration-200 flex-shrink-0 mt-2 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-fd-background border rounded-xl shadow-xl z-10 overflow-hidden animate-in slide-in-from-top-2 duration-200"
        >
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-4 hover:bg-fd-accent/50 transition-colors duration-150 ${
                index !== items.length - 1 ? 'border-b border-fd-border' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1 text-fd-primary">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-fd-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Icon({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div
      className="mb-2 size-9 rounded-lg border p-1.5 shadow-fd-primary/30"
      style={{
        boxShadow: 'inset 0px 8px 8px 0px var(--tw-shadow-color)',
      }}
    >
      {children}
    </div>
  );
}
