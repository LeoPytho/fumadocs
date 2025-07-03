
import { PlusIcon, ExternalLinkIcon, GithubIcon, MessageCircleIcon } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { createMetadata } from '@/lib/metadata';
import Expostarter from '@/public/showcases/expostarter.png';
import Sunar from '@/public/showcases/sunar.png';
import OpenPanel from '@/public/showcases/openpanel.png';
import Supastarter from '@/public/showcases/supastarter.png';
import BetterAuth from '@/public/showcases/better-auth.png';
import ArkType from '@/public/showcases/arktype.png';
import AssistantUI from '@/public/showcases/assistant-ui.png';
import VisionUI from '@/public/showcases/vision-ui.png';
import Design from './design.png';
import Jeketian from './686103cd95e8ca13853ee2a9.jpg';
import Jkt48connect from './685ff7f8525d02566271d545.png';
import Link from 'fumadocs-core/link';
import MixSpace from '@/public/showcases/mix-space.png';
import TurboStarter from '@/public/showcases/turbostarter.png';

export const metadata = createMetadata({
  title: 'Showcase',
  description: 'Some cool websites using jkt48connect',
  openGraph: {
    url: 'https://docs.jkt48connect.my.id/showcase',
  },
});

interface ShowcaseObject {
  image?: StaticImageData | string;
  name: string;
  url: string;
}

interface ProjectObject {
  name: string;
  description: string;
  category: string;
  url?: string;
  status: 'Active' | 'Maintenance' | 'Beta' | 'Deprecated';
  tech?: string[];
  icon?: 'api' | 'web' | 'bot' | 'package' | 'docs';
}

const showcases: ShowcaseObject[] = [
  {
    image: Jeketian,
    name: 'Jeketian',
    url: 'https://www.jeketian.web.id/',
  },
  {
    image: Jkt48connect,
    name: 'JKT48Connect',
    url: 'https://www.jkt48connect.my.id',
  },
];

const blogs: ShowcaseObject[] = [
  {
    name: "ZENOVA WhatsApp Bot",
    url: 'https://wa.me/6285189020193',
  },
  {
    name: 'JKT48Connect Discord Bot',
    url: 'https://discord.com/oauth2/authorize?client_id=1305141693477027891',
  },
];

const projects: ProjectObject[] = [
  {
    name: 'JKT48Connect API',
    description: 'RESTful API untuk mengakses data JKT48 termasuk member, jadwal, berita, dan konten multimedia dengan response time yang cepat dan reliable.',
    category: 'API',
    url: 'https://v2.jkt48connect.my.id',
    status: 'Active',
    tech: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    icon: 'api'
  },
  {
    name: 'JKT48Connect WEB',
    description: 'Platform web oficial dengan fitur lengkap untuk melihat informasi member, jadwal, berita, dan live streaming JKT48 secara real-time.',
    category: 'Web App',
    url: 'https://www.jkt48connect.my.id',
    status: 'Active',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    icon: 'web'
  },
  {
    name: 'JKT48Connect Docs',
    description: 'Dokumentasi lengkap dan interaktif untuk developer yang ingin mengintegrasikan JKT48Connect API dengan tutorial step-by-step.',
    category: 'Documentation',
    url: 'https://docs.jkt48connect.my.id',
    status: 'Active',
    tech: ['Next.js', 'MDX', 'Fumadocs'],
    icon: 'docs'
  },
  {
    name: 'ZENOVA',
    description: 'Bot WhatsApp pintar dengan AI yang dapat memberikan informasi JKT48, games interaktif, dan notifikasi otomatis untuk fans.',
    category: 'Chatbot',
    url: 'https://wa.me/6285189020193',
    status: 'Active',
    tech: ['Node.js', 'WhatsApp Web.js', 'OpenAI'],
    icon: 'bot'
  },
  {
    name: 'JKT48Connect Discord Bot',
    description: 'Bot Discord dengan fitur server management, games, quiz JKT48, dan sistem notifikasi otomatis untuk komunitas Discord.',
    category: 'Chatbot',
    url: 'https://discord.com/oauth2/authorize?client_id=1305141693477027891',
    status: 'Active',
    tech: ['Discord.js', 'Node.js', 'SQLite'],
    icon: 'bot'
  },
  {
    name: '@jkt48/core',
    description: 'SDK modern dan powerful untuk JavaScript/TypeScript dengan full TypeScript support, built-in caching, dan error handling.',
    category: 'Package',
    status: 'Active',
    tech: ['TypeScript', 'Axios', 'Zod'],
    icon: 'package'
  },
  {
    name: '@jkt48connect-corp/baileys',
    description: 'WhatsApp library yang telah dimodifikasi dengan fitur tambahan seperti button interaction dan media handling yang lebih baik.',
    category: 'Package',
    status: 'Active',
    tech: ['JavaScript', 'Baileys', 'Protobuf'],
    icon: 'package'
  },
  {
    name: 'JKT48Connect SDKs',
    description: 'Koleksi SDK legacy untuk berbagai bahasa pemrograman. Sudah tidak dikembangkan, gunakan @jkt48/core untuk JavaScript.',
    category: 'Developer Tools',
    status: 'Deprecated',
    tech: ['JavaScript', 'Python', 'PHP'],
    icon: 'package'
  }
];

const vercel = [
  {
    name: 'Turbo',
    url: 'https://turbo.build',
  },
  {
    name: 'Flags SDK',
    url: 'https://flags-sdk.dev',
  },
  {
    name: 'Chat SDK',
    url: 'https://chat-sdk.dev',
  },
];

const categories = Array.from(new Set(projects.map(project => project.category)));

const getStatusColor = (status: ProjectObject['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
    case 'Beta':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
    case 'Maintenance':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400';
    case 'Deprecated':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getProjectIcon = (icon: ProjectObject['icon']) => {
  switch (icon) {
    case 'api':
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    case 'web':
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
      );
    case 'bot':
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <MessageCircleIcon className="w-5 h-5 text-white" />
        </div>
      );
    case 'package':
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      );
    case 'docs':
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      );
  }
};

export default function Showcase() {
  return (
    <main className="px-4 py-12 z-[2] w-full max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden border border-dashed rounded-xl p-8 mb-8">
        <div className="relative z-10">
          <h1 className="mb-4 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The RESTful API created for everyone
          </h1>
          <p className="text-lg text-fd-muted-foreground mb-6">
            Discover amazing projects and applications powered by JKT48Connect ecosystem. 
            From web apps to chatbots, see what developers are building with our platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/6285701479245"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                buttonVariants({
                  variant: 'default',
                }),
                'gap-2'
              )}
            >
              <PlusIcon className="size-4" />
              Submit Your Project
            </a>
            <a
              href="https://github.com/jkt48connect"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                }),
                'gap-2'
              )}
            >
              <GithubIcon className="size-4" />
              View on GitHub
            </a>
          </div>
        </div>
        <Image
          src={Design}
          alt="preview"
          priority
          className="absolute right-0 top-0 w-[400px] min-w-[400px] opacity-20 pointer-events-none select-none"
        />
      </div>

      {/* Vercel Section */}
      <div className="flex gap-4 border border-dashed rounded-xl p-6 mb-8">
        <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            aria-label="Vercel logomark"
            height="20"
            role="img"
            viewBox="0 0 74 64"
            className="text-white dark:text-black"
          >
            <path
              d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Powered by Vercel's Infrastructure
          </h2>
          <p className="text-fd-muted-foreground mb-3">
            JKT48Connect leverages Vercel's cutting-edge hosting and development tools.
          </p>
          <div className="flex items-center gap-2">
            {vercel.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  buttonVariants({
                    variant: 'link',
                    size: 'sm',
                  }),
                  'text-fd-muted-foreground p-0 h-auto'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Showcases */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Showcases</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {showcases.map((showcase) => (
            <ShowcaseItem key={showcase.url} {...showcase} />
          ))}
        </div>
      </section>

      {/* Chatbots Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Try Our Chatbots</h2>
        <p className="text-fd-muted-foreground mb-6">
          Experience JKT48Connect through our intelligent chatbots available on multiple platforms.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {blogs.map((showcase) => (
            <ChatbotItem key={showcase.url} {...showcase} />
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Complete Ecosystem</h2>
          <p className="text-fd-muted-foreground mb-6">
            Explore all the tools, services, and packages that make up the JKT48Connect ecosystem.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-fd-muted-foreground">Categories:</span>
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 text-xs font-medium bg-fd-accent rounded-full border"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="mt-16 text-center border border-dashed rounded-xl p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
        <h3 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h3>
        <p className="text-fd-muted-foreground mb-6 max-w-2xl mx-auto">
          Join our growing community of developers and creators. Whether you want to contribute, 
          suggest a new project, or showcase your work, we'd love to hear from you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://docs.jkt48connect.my.id"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'default',
              }),
              'gap-2'
            )}
          >
            Get Started
          </a>
          <a
            href="https://wa.me/6285701479245"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'outline',
              }),
              'gap-2'
            )}
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}

function ShowcaseItem({ name, url, image }: ShowcaseObject) {
  if (image) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="group relative aspect-[16/9] border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
      >
        <Image
          alt={`${name} preview`}
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-all group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <p className="text-sm text-white/80">{new URL(url).hostname}</p>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLinkIcon className="w-5 h-5 text-white" />
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex aspect-[16/9] flex-col border rounded-xl p-6 transition-all hover:shadow-lg hover:bg-fd-accent"
    >
      <p className="font-mono text-xs mb-2 text-fd-muted-foreground">
        {new URL(url).hostname}
      </p>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-sm text-fd-muted-foreground">Visit site</span>
        <ExternalLinkIcon className="w-4 h-4 text-fd-muted-foreground" />
      </div>
    </a>
  );
}

function ChatbotItem({ name, url }: ShowcaseObject) {
  const isWhatsApp = url.includes('wa.me');
  const isDiscord = url.includes('discord.com');
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex items-center gap-4 p-4 border rounded-xl transition-all hover:shadow-lg hover:bg-fd-accent"
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        isWhatsApp && "bg-green-500",
        isDiscord && "bg-indigo-500"
      )}>
        {isWhatsApp && (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        )}
        {isDiscord && (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.9616-.6067 3.9502-1.5219 6.002-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0001 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
          </svg>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-sm text-fd-muted-foreground">
          {isWhatsApp && "Chat with our WhatsApp bot"}
          {isDiscord && "Add to your Discord server"}
        </p>
      </div>
      <ExternalLinkIcon className="w-5 h-5 text-fd-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

function ProjectCard({ name, description, category, url, status, tech, icon }: ProjectObject) {
  return (
    <div className="group border rounded-xl p-6 transition-all hover:shadow-lg hover:bg-fd-accent">
      <div className="flex items-start gap-4 mb-4">
        {getProjectIcon(icon)}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg leading-tight">{name}</h3>
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full border flex-shrink-0 ml-2",
              getStatusColor(status)
            )}>
              {status}
            </span>
          </div>
          <span className="text-xs font-medium text-fd-primary bg-fd-primary/10 px-2 py-1 rounded">
            {category}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-fd-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center justify-between">
        {tech && tech.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {tech.slice(0, 3).map((technology, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-fd-muted/10 rounded border"
              >
                {technology}
              </span>
            ))}
            {tech.length > 3 && (
              <span className="text-xs px-2 py-1 bg-fd-muted/10 rounded border">
                +{tech.length - 3}
            ))}
          </div>
        )}
        
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1 text-sm text-fd-primary hover:text-fd-primary/80 transition-colors ml-auto"
          >
            <span>Visit</span>
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
