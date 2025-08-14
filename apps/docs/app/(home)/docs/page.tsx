'use client';

import { Building2, Code, X, Package, Globe } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import Spot from '@/public/spot.png';
import { useState } from 'react';

export default function DocsPage(): React.ReactElement {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleModalOpen = (modalId: string) => {
    setActiveModal(modalId);
  };

  const handleModalClose = () => {
    setActiveModal(null);
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
        <ClickableCard
          id="modules"
          onOpen={() => handleModalOpen('modules')}
          icon={<Package className="size-full" />}
          title="Modules"
          description="Core libraries and modules for JKT48Connect"
        />

        {/* APIs Card */}
        <ClickableCard
          id="apis"
          onOpen={() => handleModalOpen('apis')}
          icon={<Code className="size-full" />}
          title="APIs (RestAPI)"
          description="Interactive API endpoints and playground tools"
        />
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-fd-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {activeModal === 'modules' && (
              <ModulesModal onClose={handleModalClose} />
            )}
            {activeModal === 'apis' && (
              <APIsModal onClose={handleModalClose} />
            )}
          </div>
        </div>
      )}

      {/* Background overlay click to close */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleModalClose}
        />
      )}
    </main>
  );
}

interface ClickableCardProps {
  id: string;
  onOpen: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ClickableCard({ 
  id, 
  onOpen, 
  icon, 
  title, 
  description 
}: ClickableCardProps): React.ReactElement {
  return (
    <div
      className="rounded-2xl border border-transparent p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
      style={{
        backgroundImage:
          'linear-gradient(to right bottom, var(--color-fd-background) 10%, var(--color-fd-accent), var(--color-fd-background) 60%),' +
          'linear-gradient(to right bottom, rgb(40,40,40) 10%, rgb(180,180,180), rgb(30,30,30) 60%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
      onClick={onOpen}
    >
      <Icon>{icon}</Icon>
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="text-sm text-fd-muted-foreground">
        {description}
      </p>
      <p className="text-xs text-fd-primary mt-3 font-medium">
        Click to explore →
      </p>
    </div>
  );
}

interface ModalProps {
  onClose: () => void;
}

function ModulesModal({ onClose }: ModalProps): React.ReactElement {
  const items = [
    {
      href: '/docs/headless',
      title: 'JKT48Connect Core',
      description: 'The core library of JKT48Connect.',
      icon: <Building2 className="size-5" />
    },
    {
      href: '/docs/ui',
      title: 'JKT48Connect API',
      description: 'The full-powered documentation for api instead.',
      icon: <Globe className="size-5" />
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon>
            <Package className="size-full" />
          </Icon>
          <div>
            <h2 className="text-xl font-semibold">Modules</h2>
            <p className="text-sm text-fd-muted-foreground">
              Core libraries and modules for JKT48Connect
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-fd-accent/50 rounded-lg transition-colors duration-150"
        >
          <X className="size-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block p-4 rounded-xl border hover:bg-fd-accent/30 transition-all duration-200 hover:shadow-md"
            onClick={onClose}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 text-fd-primary">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-fd-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function APIsModal({ onClose }: ModalProps): React.ReactElement {
  const items = [
    {
      href: '/docs/openapi',
      title: 'JKT48Connect RestAPI',
      description: 'Interactive playground to test API features directly in your browser with real-time output.',
      icon: <Code className="size-5" />
    },
    {
      href: '/docs/playground',
      title: 'Grow A Garden API',
      description: 'Interactive playground to experiment with Garden API features and see results in real-time.',
      icon: <Building2 className="size-5" />
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon>
            <Code className="size-full" />
          </Icon>
          <div>
            <h2 className="text-xl font-semibold">APIs (RestAPI)</h2>
            <p className="text-sm text-fd-muted-foreground">
              Interactive API endpoints and playground tools
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-fd-accent/50 rounded-lg transition-colors duration-150"
        >
          <X className="size-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block p-4 rounded-xl border hover:bg-fd-accent/30 transition-all duration-200 hover:shadow-md"
            onClick={onClose}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 text-fd-primary">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-fd-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
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
