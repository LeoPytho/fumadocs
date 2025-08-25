import { CalendarIcon, GitBranchIcon, TagIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { createMetadata } from '@/lib/metadata';
import Design from './design.png';

export const metadata = createMetadata({
  title: 'Changelog',
  description: 'Latest updates and changes to JKT48Connect API and services',
  openGraph: {
    url: 'https://docs.jkt48connect.my.id/changelog',
  },
});

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'Major' | 'Minor' | 'Patch' | 'Beta';
  title: string;
  description?: string;
  changes: {
    type: 'Added' | 'Changed' | 'Fixed' | 'Removed' | 'Deprecated' | 'Security';
    items: string[];
  }[];
  breaking?: boolean;
}

const changelog: ChangelogEntry[] = [
  {
    version: '2.1.0',
    date: '2025-01-15',
    type: 'Minor',
    title: 'Enhanced Member API & Live Streaming',
    description: 'Significant improvements to member data API and live streaming capabilities',
    breaking: false,
    changes: [
      {
        type: 'Added',
        items: [
          'New member profile photos endpoint with high-resolution images',
          'Live streaming status indicator API',
          'Member birthday countdown feature',
          'Enhanced member statistics endpoint'
        ]
      },
      {
        type: 'Changed',
        items: [
          'Improved response time for member list API by 40%',
          'Updated member data structure with additional fields',
          'Enhanced error messages for better debugging'
        ]
      },
      {
        type: 'Fixed',
        items: [
          'Fixed member graduation status not updating correctly',
          'Resolved timezone issues in schedule API',
          'Fixed memory leak in live stream monitoring'
        ]
      }
    ]
  },
  {
    version: '2.0.5',
    date: '2025-01-08',
    type: 'Patch',
    title: 'Bug Fixes & Performance',
    breaking: false,
    changes: [
      {
        type: 'Fixed',
        items: [
          'Fixed rate limiting issues with high-traffic endpoints',
          'Resolved CORS errors for certain origins',
          'Fixed theater schedule displaying incorrect times'
        ]
      },
      {
        type: 'Changed',
        items: [
          'Optimized database queries for faster response times',
          'Updated API documentation with better examples'
        ]
      }
    ]
  },
  {
    version: '2.0.0',
    date: '2024-12-20',
    type: 'Major',
    title: 'JKT48Connect API v2 Release',
    description: 'Complete API redesign with improved performance and new features',
    breaking: true,
    changes: [
      {
        type: 'Added',
        items: [
          'New RESTful API design with consistent endpoints',
          'Real-time WebSocket connections for live updates',
          'Advanced filtering and sorting capabilities',
          'Member social media integration',
          'Theater schedule API with seat availability',
          'News and announcement API with rich content support'
        ]
      },
      {
        type: 'Changed',
        items: [
          'Complete API endpoint restructure',
          'New authentication system using API keys',
          'Improved error handling with detailed error codes',
          'Updated response formats for better consistency'
        ]
      },
      {
        type: 'Deprecated',
        items: [
          'API v1 endpoints (will be removed in v3.0)',
          'Legacy member ID format'
        ]
      }
    ]
  }
];

const getTypeColor = (type: ChangelogEntry['type']) => {
  switch (type) {
    case 'Major':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Minor':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Patch':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Beta':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getChangeTypeColor = (type: ChangelogEntry['changes'][0]['type']) => {
  switch (type) {
    case 'Added':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'Changed':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Fixed':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Removed':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Deprecated':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Security':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

function ChangelogEntryCard({ version, date, type, title, description, changes, breaking }: ChangelogEntry) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="border border-dashed rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <TagIcon className="size-4" />
            <h3 className="text-xl font-medium">{version}</h3>
          </div>
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full border",
            getTypeColor(type)
          )}>
            {type}
          </span>
          {breaking && (
            <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200">
              Breaking Changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-fd-muted-foreground">
          <CalendarIcon className="size-4" />
          {formattedDate}
        </div>
      </div>

      <h4 className="text-lg font-medium mb-2">{title}</h4>
      {description && (
        <p className="text-fd-muted-foreground mb-4">{description}</p>
      )}

      <div className="space-y-4">
        {changes.map((changeGroup, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded border",
                getChangeTypeColor(changeGroup.type)
              )}>
                {changeGroup.type}
              </span>
            </div>
            <ul className="ml-4 space-y-1">
              {changeGroup.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-fd-muted-foreground flex items-start gap-2">
                  <span className="text-fd-primary mt-1.5 text-xs">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Changelog() {
  const mainClassName = "px-4 py-12 z-[2] w-full max-w-[1400px] mx-auto [--color-fd-border:color-mix(in_oklab,var(--color-fd-primary)_30%,transparent)]";
  
  return (
    <main className={mainClassName}>
      <div className="relative overflow-hidden border border-dashed p-6">
        <h1 className="mb-4 text-xl font-medium">
          JKT48Connect Changelog
        </h1>
        <p className="text-fd-muted-foreground">
          Stay updated with the latest changes, improvements, and new features in JKT48Connect API and services.
        </p>
        <div className="mt-6">
          <a
            href="https://github.com/jkt48connect"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'outline',
              }),
            )}
          >
            <GitBranchIcon className="me-2 size-4" />
            View on GitHub
          </a>
        </div>
        <span className="absolute text-xs left-6 bottom-6 text-fd-muted-foreground font-mono">
          Changelog
        </span>
        <Image
          src={Design}
          alt="preview"
          priority
          className="ml-auto w-[600px] min-w-[600px] -mt-12 -mb-18 pointer-events-none select-none"
        />
      </div>

      <div className="flex gap-4 border border-dashed p-6 mt-6">
        <CalendarIcon className="size-6 mt-1" />
        <div>
          <h2 className="text-sm font-medium mb-2">
            Regular updates to keep JKT48Connect reliable and feature-rich.
          </h2>
          <p className="text-xs text-fd-muted-foreground">
            We follow semantic versioning and maintain backward compatibility whenever possible.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {changelog.map((entry) => (
          <ChangelogEntryCard key={entry.version} {...entry} />
        ))}
      </div>

      <div className="mt-16 border border-dashed p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Change Types Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { type: 'Added', description: 'New features and functionality' },
            { type: 'Changed', description: 'Changes in existing functionality' },
            { type: 'Fixed', description: 'Bug fixes and corrections' },
            { type: 'Removed', description: 'Removed features or functionality' },
            { type: 'Deprecated', description: 'Features marked for future removal' },
            { type: 'Security', description: 'Security improvements and fixes' }
          ].map(({ type, description }) => (
            <div key={type} className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded border",
                getChangeTypeColor(type as any)
              )}>
                {type}
              </span>
              <span className="text-xs text-fd-muted-foreground">{description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center border border-dashed p-8 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Have feedback or suggestions?</h3>
        <p className="text-fd-muted-foreground mb-4">
          We would love to hear from you. Help us improve JKT48Connect by sharing your thoughts.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/jkt48connect/issues"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'sm',
              }),
            )}
          >
            Report an Issue
          </a>
          <a
            href="https://wa.me/6285701479245"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'sm',
              }),
            )}
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
