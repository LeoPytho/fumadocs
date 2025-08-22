import { cva } from 'class-variance-authority';
import {
  BatteryChargingIcon,
  CpuIcon,
  FileEditIcon,
  FileTextIcon,
  Heart,
  KeyboardIcon,
  LayoutIcon,
  LibraryIcon,
  type LucideIcon,
  MousePointer,
  PaperclipIcon,
  PersonStandingIcon,
  RocketIcon,
  SearchIcon,
  Terminal,
  TimerIcon,
  ShieldCheckIcon,
  UsersIcon,
  StarIcon,
} from 'lucide-react';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import Link from 'next/link';
import type { HTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { CodeBlock } from '@/components/code-block';
import { UwuHero } from '@/app/(home)/uwu'; // Keep if you want this specific animation, otherwise remove
import SourceImage from '@/public/1751117998520.png'; // Replace with relevant JKT48Connect image
import ContributorCounter from '@/components/contributor-count';
import {
  CreateAppAnimation,
  PreviewImages,
  WhyInteractive,
} from './page.client';
import { NetlifyLogo, VercelLogo } from './icons'; // Keep if relevant for hosting, otherwise remove or replace
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { owner, repo } from '@/lib/github'; // Keep if JKT48Connect is on GitHub
import { Marquee } from '@/app/(home)/marquee'; // Keep for testimonials/marquee
import ArchImg from './arch.png'; // Replace with JKT48Connect architecture image

const badgeVariants = cva(
  'inline-flex size-7 items-center justify-center rounded-full bg-fd-primary font-medium text-fd-primary-foreground',
);

export default function Page() {
  const gridColor =
    'color-mix(in oklab, var(--color-fd-primary) 10%, transparent)';

  return (
    <>
      <div
        className="absolute inset-x-0 top-[360px] h-[250px] max-md:hidden"
        style={{
          background: `repeating-linear-gradient(to right, ${gridColor}, ${gridColor} 1px,transparent 1px,transparent 50px), repeating-linear-gradient(to bottom, ${gridColor}, ${gridColor} 1px,transparent 1px,transparent 50px)`,
        }}
      />
      <main className="container relative max-w-[1100px] px-2 py-4 z-[2] lg:py-8">
        <div
          style={{
            background:
              'repeating-linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-fd-primary) 1%, transparent) 500px, transparent 1000px)',
          }}
        >
          <div className="relative">
            <Hero />
            {/* Remove UwuHero if not relevant to JKT48Connect branding */}
            <UwuHero /> 
          </div>
          <Feedback />
          <Introduction />
          <div
            className="relative overflow-hidden border-x border-t px-8 py-16 sm:py-24"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, var(--color-fd-secondary), var(--color-fd-background) 40%)',
            }}
          >
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">
              Loved by Developers.
              <br />
              Built for JKT48 Data Access.
            </h2>
          </div>
          <PrioritySystem />
          <Architecture />
          <Features />
          <Highlights />
          <Why />
          <Contributing />
          <End />
        </div>
      </main>
    </>
  );
}

function PrioritySystem() {
  return (
    <div className="border-x border-t bg-gradient-to-br from-fd-background via-fd-primary/5 to-fd-background">
      <div className="flex flex-col items-center px-8 py-16 text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white">
            <ShieldCheckIcon className="size-4" />
            Priority Access System
          </div>
        </div>
        
        <h2 className="mb-4 text-3xl font-bold text-fd-foreground sm:text-4xl">
          Akses Khusus untuk Komunitas JKT48
        </h2>
        
        <p className="mb-8 max-w-2xl text-lg text-fd-muted-foreground">
          Kami memberikan akses prioritas tanpa API key dan whitelist IP untuk organisasi, 
          komunitas, dan fanbase JKT48 yang terverifikasi.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          <div className="group rounded-xl border bg-fd-card/50 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-3">
                <UsersIcon className="size-6 text-white" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-fd-foreground">
              Komunitas Resmi
            </h3>
            <p className="text-fd-muted-foreground mb-4">
              Fanbase dan komunitas JKT48 yang terdaftar resmi mendapat akses unlimited.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                No API Key
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                No Rate Limit
              </span>
            </div>
          </div>

          <div className="group rounded-xl border bg-fd-card/50 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-3">
                <StarIcon className="size-6 text-white" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-fd-foreground">
              Organisasi Media
            </h3>
            <p className="text-fd-muted-foreground mb-4">
              Media partner dan organisasi berita JKT48 dengan akses prioritas tinggi.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Priority Queue
              </span>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Extended Limit
              </span>
            </div>
          </div>

          <div className="group rounded-xl border bg-fd-card/50 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-3">
                <ShieldCheckIcon className="size-6 text-white" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-fd-foreground">
              Developer Verified
            </h3>
            <p className="text-fd-muted-foreground mb-4">
              Developer terverifikasi yang membangun aplikasi untuk ekosistem JKT48.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Beta Access
              </span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                Technical Support
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl border bg-gradient-to-r from-fd-primary/10 to-fd-secondary/10 p-6">
          <h3 className="mb-3 text-lg font-semibold text-fd-foreground">
            Cara Mendapatkan Akses Prioritas
          </h3>
          <div className="flex flex-col gap-4 text-sm text-fd-muted-foreground md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-fd-primary text-xs font-bold text-fd-primary-foreground">
                1
              </div>
              <span>Ajukan verifikasi organisasi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-fd-primary text-xs font-bold text-fd-primary-foreground">
                2
              </div>
              <span>Tunjukkan bukti legitimasi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-fd-primary text-xs font-bold text-fd-primary-foreground">
                3
              </div>
              <span>Dapatkan akses dalam 24 jam</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/priority-access" // Replace with your priority access application link
            className={cn(
              buttonVariants({ 
                size: 'lg',
                className: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }),
            )}
          >
            Daftar Akses Prioritas
          </Link>
          <Link
            href="/docs/priority-system" // Replace with priority system documentation
            className={cn(
              buttonVariants({
                size: 'lg',
                variant: 'outline',
              }),
            )}
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </div>
    </div>
  );
}

function Architecture() {
  return (
    <div className="flex flex-col gap-4 border-x border-t p-8 md:px-12 lg:flex-row">
      <div className="text-start">
        <p className="px-2 py-1 text-sm font-mono bg-fd-primary text-fd-primary-foreground font-bold w-fit mb-4">
          Designed with Precision
        </p>
        <h2 className="text-2xl font-semibold mb-4">A Flexible API for JKT48 Data.</h2>
        <p className="text-fd-muted-foreground mb-6">
          JKT48Connect makes it easy to access JKT48 data, build exciting features, and integrate content into your applications.
        </p>
      </div>
      <Image
        src={ArchImg} // Replace with your API's architecture image
        alt="Architecture"
        className="mx-auto -my-16 w-full max-w-[400px] invert dark:invert-0 lg:mx-0"
      />
    </div>
  );
}

async function Why() {
  return (
    <div className="relative overflow-hidden border-x border-t p-2">
      <WhyInteractive
        typeTable={
          <TypeTable
            type={{
              name: {
                type: 'string',
                description: 'The name of the JKT48 member',
                default: 'Azizi Asadel',
              },
              birthdate: {
                type: 'string',
                description: 'The member\'s birth date',
                default: '27-05-2004',
              },
              team: {
                type: 'string',
                description: 'The member\'s team (e.g., JKT48 New Era)',
                default: 'JKT48 New Era',
              },
            }}
          />
        }
        codeblockSearchRouter={
          <CodeBlock
            lang="ts"
            code={`const jkt48Api = require('@jkt48/core');

// Example: Get all JKT48 members
async function getMembers() {
  try {
    const apiKey = 'your-api-key-here';
    const members = await jkt48Api.members(apiKey);
    console.log(members);
  } catch (error) {
    console.error(error.message);
  }
}

getMembers();`}
          />
        }
        codeblockTheme={
          <CodeBlock
            lang="css"
            code={`/* Example styling for your JKT48 app */
@import 'tailwindcss';
/* Your custom theme styles */
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f8f8;
}
.jkt48-primary {
  color: #E7002E; /* JKT48 red color */
}`}
          />
        }
        codeblockInteractive={
          <CodeBlock
            lang="tsx"
            code={`import { MemberCard } from '@/components/members'; // Example component
 
<div className="grid grid-cols-2 gap-4">
  <MemberCard name="Shani Indira Natio" team="JKT48 New Era" />
  <MemberCard name="Feni Fitriyanti" team="JKT48 New Era" />
</div>`}
          />
        }
        codeblockMdx={
          <CodeBlock
            lang="tsx"
            code={`import { jkt48Api } from '@jkt48/core';

export function LiveScheduleTable() {
  cons API_KEY = "YOUR_KEY";
  const schedules = jkt48Api.live(API_KEY);
    
  return (
    <ul>
      {schedules.map(s => <li key={s.id}>{s.title} - {s.date}</li>)}
    </ul>
  );
}

## Live Schedules

<LiveScheduleTable />`}
          />
        }
      />
    </div>
  );
}

function End() {
  return (
    <div className="flex flex-col border-b border-r md:flex-row *:border-l *:border-t">
      <div className="group flex flex-col min-w-0 flex-1 pt-8 **:transition-colors">
        <h2 className="text-3xl text-center font-extrabold font-mono uppercase text-fd-muted-foreground mb-4 lg:text-4xl group-hover:text-blue-500">
          Build Your JKT48 App
        </h2>
        <p className="text-center font-mono text-xs text-fd-foreground/60 mb-8 group-hover:text-blue-500/80">
          Access data, develop features, bring your creations to life.
        </p>
        <div className="h-[200px] overflow-hidden p-8 bg-gradient-to-b from-fd-primary/10 group-hover:from-blue-500/10">
          <div className="mx-auto bg-radial-[circle_at_0%_100%] from-60% from-transparent to-fd-primary size-[500px] rounded-full group-hover:from-blue-500 group-hover:to-blue-600/10" />
        </div>
      </div>
      <ul className="flex flex-col gap-4 p-6 pt-8">
        <li>
          <span className="flex flex-row items-center gap-2 font-medium">
            <BatteryChargingIcon className="size-5" />
            Guaranteed Reliability.
          </span>
          <span className="mt-2 text-sm text-fd-muted-foreground">
            Actively maintained API, ready for your integration.
          </span>
        </li>
        <li>
          <span className="flex flex-row items-center gap-2 font-medium">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Fully Open-Source (if relevant).
          </span>
          <span className="mt-2 text-sm text-fd-muted-foreground">
            Available on npm, develop with the community.
          </span>
        </li>
        <li>
          <span className="flex flex-row items-center gap-2 font-medium">
            <TimerIcon className="size-5" />
            Quick Integration.
          </span>
          <span className="mt-2 text-sm text-fd-muted-foreground">
            Start building in seconds with available SDKs.
          </span>
        </li>
        <li className="flex flex-row flex-wrap gap-2 mt-auto">
          <Link href="/docs" className={cn(buttonVariants())}>
            Read API Docs
          </Link>
          
            href="/showcase" // Replace with your API demo link
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'outline',
              }),
            )}
          >
            See Examples
          </a>
        </li>
      </ul>
    </div>
  );
}

const searchItemVariants = cva(
  'flex flex-row items-center gap-2 rounded-md p-2 text-sm text-fd-popover-foreground',
);

function Search(): React.ReactElement {
  return (
    <div className="mt-6 rounded-lg bg-gradient-to-b from-fd-border p-px">
      <div className="flex select-none flex-col rounded-[inherit] bg-gradient-to-b from-fd-popover">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-fd-muted-foreground">
          <SearchIcon className="size-4" />
          Search Data...
        </div>
        <div className="border-t p-2">
          {[
            'Member Data',
            'Theater Schedules',
            'Latest News',
            'Live',
            'Events & Fanbase',
          ].map((v, i) => (
            <div
              key={v}
              className={cn(
                searchItemVariants({
                  className: i === 0 ? 'bg-fd-accent' : '',
                }),
              )}
            >
              <FileTextIcon className="size-4 text-fd-muted-foreground" />
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Highlights(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 border-r md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full flex flex-row items-start justify-center border-l border-t p-8 pb-2 text-center">
        <h2 className="bg-fd-primary text-fd-primary-foreground px-1 text-2xl font-semibold">
          Key Highlights
        </h2>
        <MousePointer className="-ml-1 mt-8" />
      </div>
      <Highlight icon={TimerIcon} heading="Fast & Easy Data Access.">
        Get real-time JKT48 data with optimized API responses.
      </Highlight>
      <Highlight icon={LayoutIcon} heading="Structured & Comprehensive.">
        Data is well-organized for easy use across various applications.
      </Highlight>
      <Highlight icon={RocketIcon} heading="Designed for Developers.">
        An intuitive API that's simple to implement in your projects.
      </Highlight>
      <Highlight icon={SearchIcon} heading="Efficient Search.">
        Powerful search functions to find specific data (e.g., members, songs).
      </Highlight>
      <Highlight icon={KeyboardIcon} heading="Data Automation.">
        Automated data synchronization to ensure you always get the latest information.
      </Highlight>
      <Highlight icon={PersonStandingIcon} heading="Flexible & Customizable.">
        Flexible API parameters for customizing your data needs.
      </Highlight>
    </div>
  );
}

function Highlight({
  icon: Icon,
  heading,
  children,
}: {
  icon: LucideIcon;
  heading: ReactNode;
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="border-l border-t px-6 py-12">
      <div className="mb-4 flex flex-row items-center gap-2 text-fd-muted-foreground">
        <Icon className="size-4" />
        <h2 className="text-sm font-medium">{heading}</h2>
      </div>
      <span className="font-medium">{children}</span>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative z-[2] flex flex-col border-x border-t bg-fd-background/80 px-4 pt-12 max-md:text-center md:px-12 md:pt-16 [.uwu_&]:hidden overflow-hidden">
      <div
        className="absolute inset-0 z-[-1] blur-2xl hidden dark:block"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent, white, transparent)',
          background:
            'repeating-linear-gradient(65deg, var(--color-blue-500), var(--color-blue-500) 12px, color-mix(in oklab, var(--color-blue-600) 30%, transparent) 20px, transparent 200px)',
        }}
      />
      <div
        className="absolute inset-0 z-[-1] blur-2xl dark:hidden"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent, white, transparent)',
          background:
            'repeating-linear-gradient(65deg, var(--color-purple-300), var(--color-purple-300) 12px, color-mix(in oklab, var(--color-blue-600) 30%, transparent) 20px, transparent 200px)',
        }}
      />
      <h1 className="mb-8 text-4xl font-medium md:hidden">JKT48Connect</h1>
      <h1 className="mb-8 max-w-[600px] text-4xl font-medium max-md:hidden">
        JKT48Connect: Effortless JKT48 Data Access
      </h1>
      <p className="mb-8 text-fd-muted-foreground md:max-w-[80%] md:text-xl">
        JKT48Connect is a dedicated API for developers, providing comprehensive and efficient JKT48 data access for your applications.
      </p>
      <div className="inline-flex items-center gap-3 max-md:mx-auto">
        <Link
          href="/docs" // Replace with your API documentation link
          className={cn(
            buttonVariants({ size: 'lg', className: 'rounded-full' }),
          )}
        >
          Get Started
        </Link>
        
          href="https://docs.jkt48connect.com/showcase" // Replace with your API demo link
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            buttonVariants({
              size: 'lg',
              variant: 'outline',
              className: 'rounded-full bg-fd-background',
            }),
          )}
        >
          See Examples
        </a>
      </div>
      <PreviewImages /> {/* Ensure this displays relevant previews */}
    </div>
  );
}

const feedback = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/124599',
    user: 'Ayu S.',
    role: 'Pengembang Bot Telegram JKT48',
    message: `Nggak nyangka API-nya se-enak ini. Bikin bot buat data JKT48 jadi gampang banget, datanya juga lengkap pol!`,
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/35677084',
    user: 'Daniel K.',
    role: 'Analisis Data Fanbase',
    message: `Buat yang butuh data JKT48, ini API-nya recommended banget. Datanya akurat, jadi analisis fanbase-ku lebih cepet dan valid.`,
  },
  {
    user: 'Jessica M.',
    avatar: 'https://avatars.githubusercontent.com/u/38025074',
    role: 'Pembuat Aplikasi Fan',
    message: 'Udah gak perlu lagi ribet-ribet scraping data. Pake JKT48Connect, aplikasi fansku otomatis update terus. Gila, integrasinya sat-set banget!',
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/10645823',
    user: 'Ryan G.',
    role: 'Manajer Situs Informasi JKT48',
    message: `Sebagai admin situs info JKT48, ini API paling top sih. Stabil banget, datanya lengkap.`,
  },
];


function Feedback() {
  return (
    <div className="relative border-x border-t pt-8 bg-fd-background">
      <div className="flex flex-row gap-6 justify-between px-6 mb-6 items-center">
        <p className="text-sm font-medium md:text-lg">
          Trusted by the JKT48 Community & Developers
        </p>
        <Link
          href="/showcase" // Replace with your API's application showcase page
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          View Apps
        </Link>
      </div>
      <Marquee className="pb-8 [mask-image:linear-gradient(to_right,transparent,white_20px,white_calc(100%-20px),transparent)]">
        {feedback.map((item) => (
          <div
            key={item.user}
            className="flex flex-col rounded-xl border bg-gradient-to-b from-fd-card p-4 shadow-lg w-[320px]"
          >
            <p className="text-sm whitespace-pre-wrap">{item.message}</p>

            <div className="mt-auto flex flex-row items-center gap-2 pt-4">
              <Image
                src={item.avatar}
                alt="avatar"
                width="32"
                height="32"
                unoptimized
                className="size-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{item.user}</p>
                <p className="text-xs text-fd-muted-foreground">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

function Introduction(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 border-r md:grid-cols-2">
      <div className="flex flex-col gap-2 border-l border-t px-6 py-12 md:py-16">
        <div className={cn(badgeVariants())}>1</div>
        <h3 className="text-xl font-semibold">Integrate it.</h3>
        <p className="mb-8 text-fd-muted-foreground">
          Embed JKT48Connect into your project.
        </p>
        <CreateAppAnimation /> {/* Ensure this displays something relevant */}
      </div>
      <div className="flex flex-col gap-2 border-l border-t px-6 py-12 md:py-16">
        <div className={cn(badgeVariants())}>2</div>
        <h3 className="text-xl font-semibold">Build with it.</h3>
        <p className="text-fd-muted-foreground">
         Develop exciting features with comprehensive JKT48 data.
       </p>
       <div className="relative flex flex-col">
         <CodeBlock
           lang="js"
           wrapper={{
             className: 'absolute inset-x-2 top-0 shadow-lg',
           }}
           code={`const jkt48Api = require('@jkt48/core');

// Example: Get all JKT48 members
async function getMembers() {
 try {
   const apiKey = 'your-api-key-here';
   const members = await jkt48Api.members(apiKey);
   console.log(members);
 } catch (error) {
   console.error(error.message);
 }
}

getMembers();
`}
         />
         <Files className="z-[2] mt-40 shadow-xl">
           <Folder name="src" defaultOpen>
             <File name="api.js" />
             <File name="components.js" />
           </Folder>
           <File name="package.json" />
         </Files>
       </div>
     </div>
     <div className="col-span-full flex flex-col items-center gap-2 border-l border-t px-6 py-16 text-center">
       <div className={cn(badgeVariants())}>3</div>
       <h3 className="text-2xl font-semibold">Launch it.</h3>
       <p className="text-fd-muted-foreground">
         Deploy your application to the world.
       </p>

       <div className="mt-4 flex flex-row flex-wrap items-center gap-8">
         <a href="https://vercel.com" rel="noreferrer noopener">
           <VercelLogo className="h-auto w-32" />
         </a>
         <a href="https://netlify.com" rel="noreferrer noopener">
           <NetlifyLogo className="h-auto w-32" />
         </a>
       </div>
     </div>
   </div>
 );
}

function Contributing() {
 return (
   <div className="flex flex-col items-center border-x border-t px-4 py-16 text-center">
     <Heart fill="currentColor" className="text-pink-500 mb-4" />
     <h2 className="mb-4 text-xl font-semibold sm:text-2xl">
       Made Possible by You.
     </h2>
     <p className="mb-4 text-fd-muted-foreground">
       JKT48Connect is 100% powered by passion and the open source community.
     </p>
     <div className="mb-8 flex flex-row items-center gap-2">
       <Link
         href="/sponsors" // Replace with sponsorship link if any
         className={cn(buttonVariants({ variant: 'outline' }))}
       >
         Sponsor Us
       </Link>
       
         href="https://github.com/j-forces" // Replace with JKT48Connect GitHub contributors link
         rel="noreferrer noopener"
         className={cn(buttonVariants({ variant: 'ghost' }))}
       >
         Contributors
       </a>
     </div>
     <ContributorCounter repoOwner={owner} repoName={repo} /> {/* Adjust owner and repo if different */}
   </div>
 );
}

function Features() {
 return (
   <div className="grid grid-cols-1 border-r md:grid-cols-2">
     <Feature
       icon={PaperclipIcon}
       subheading="Comprehensive Data"
       heading="Integrated JKT48 Data Source"
       description={
         <>
           <span className="font-medium text-fd-foreground">
             JKT48Connect consolidates various JKT48 data sources:{' '}
           </span>
           <span>
             Members, theater schedules, news, live, and more in one API.
           </span>
         </>
       }
       className="overflow-hidden"
       style={{
         backgroundImage:
           'radial-gradient(circle at 60% 50%,var(--color-fd-secondary),var(--color-fd-background) 80%)',
       }}
     >
       <div className="mt-8 flex flex-col">
         <div className="flex flex-row w-fit bg-fd-secondary border rounded-full *:rounded-full">
           
             href="[LINK_EXAMPLE_CMS_INTEGRATION]" // Replace with relevant example
             rel="noreferrer noopener"
             target="_blank"
             className={cn(buttonVariants({ variant: 'outline' }))}
           >
             External Data Integration
           </a>
           
             href="[LINK_EXAMPLE_DATABASE_USAGE]" // Replace with relevant example
             rel="noreferrer noopener"
             target="_blank"
             className={cn(buttonVariants({ variant: 'ghost' }))}
           >
             Database Usage Example
           </a>
         </div>
         <Image
           alt="Source"
           src={SourceImage} // Replace with an image showing API data example
           sizes="600px"
           className="-mt-16 w-[400px] min-w-[400px] invert pointer-events-none dark:invert-0"
         />
         <div className="z-[2] mt-[-170px] w-[300px] overflow-hidden rounded-lg border border-fd-foreground/10 shadow-xl backdrop-blur-lg">
           <div className="flex flex-row items-center gap-2 bg-fd-muted/50 px-4 py-2 text-xs font-medium text-fd-muted-foreground">
             <FileEditIcon className="size-4" />
             Members Endpoint
           </div>
           <pre className="p-4 text-[13px]">
             <code className="grid">
               <span className="font-medium">GET /api/jkt48/members</span>
               <span>{` `}</span>
               <span className="font-medium">{`{ "name": "Freya Jayawardana", "generation": "7" }`}</span>
               <span>{` `}</span>
               <span className="font-medium">{`{ "name": "Gracia", "generation": "3" }`}</span>
             </code>
           </pre>
         </div>
       </div>
     </Feature>
     <Feature
       icon={SearchIcon}
       subheading="Smart Search"
       heading="Easily Find JKT48 Information."
       description="Integrate with custom search for member data, songs, or news."
     >
       <Link
         href="/docs/ui#search" // Replace with your API search documentation link
         className={cn(
           buttonVariants({ variant: 'outline', className: 'mt-4' }),
         )}
       >
         Learn More
       </Link>
       <Search />
     </Feature>
     <Feature
       icon={Terminal}
       subheading="SDKs & Libraries"
       heading="Get Started Faster with SDKs."
       description="JKT48Connect provides SDKs for various programming languages, accelerating your development."
     >
       <div className="relative">
         <div className="grid grid-cols-[1fr_2fr_1fr] h-[220px] *:border-fd-foreground/50 *:border-dashed mask-radial-circle mask-radial-from-white">
           <div className="border-r border-b" />
           <div className="border-b" />
           <div className="border-l border-b" />

           <div className="border-r" />
           <div className="w-[200px]" />
           <div className="border-l" />

           <div className="border-r border-t" />
           <div className="border-t" />
           <div className="border-l border-t" />
         </div>
         <code className="absolute inset-0 flex items-center justify-center">
           <code className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-fd-foreground font-medium">
             npm install @jkt48/core
           </code>
         </code>
       </div>
     </Feature>
     <Feature
       icon={CpuIcon}
       subheading="Robust"
       heading="Flexibility that Covers Your Needs."
       description="Well-documented, separated into modular packages."
     >
       <div className="mt-8 flex flex-col gap-4">
         <Link
           href="/docs/ui/member" // Replace with member module documentation link
           className="rounded-xl bg-gradient-to-br from-transparent via-fd-primary p-px shadow-lg shadow-fd-primary/20"
         >
           <div className="rounded-[inherit] bg-fd-background bg-gradient-to-br from-transparent via-fd-primary/10 p-4 transition-colors hover:bg-fd-muted">
             <LayoutIcon />
             <h3 className="font-semibold">Members Module</h3>
             <p className="text-sm text-fd-muted-foreground">
               Get comprehensive information about all JKT48 members.
             </p>
           </div>
         </Link>
         <Link
           href="/docs/ui/theater" // Replace with schedule module documentation link
           className="rounded-xl border bg-fd-background p-4 shadow-lg transition-colors hover:bg-fd-muted"
         >
           <LibraryIcon />
           <h3 className="font-semibold">Theater Module</h3>
           <p className="text-sm text-fd-muted-foreground">
             Access theater schedules and get the information about theater.
           </p>
         </Link>
       </div>
     </Feature>
   </div>
 );
}

function Feature({
 className,
 icon: Icon,
 heading,
 subheading,
 description,
 ...props
}: HTMLAttributes<HTMLDivElement> & {
 icon: LucideIcon;
 subheading: ReactNode;
 heading: ReactNode;
 description: ReactNode;
}): React.ReactElement {
 return (
   <div
     className={cn('border-l border-t px-6 py-12 md:py-16', className)}
     {...props}
   >
     <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
       <Icon className="size-4" />
       <p>{subheading}</p>
     </div>
     <h2 className="mb-2 text-lg font-semibold">{heading}</h2>
     <p className="text-fd-muted-foreground">{description}</p>

     {props.children}
   </div>
 );
}
