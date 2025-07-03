import { PlusIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { createMetadata } from '@/lib/metadata';
import Link from 'fumadocs-core/link';
import Design from './design.png'; // Assuming 'Design' image is still relevant for the header

export const metadata = createMetadata({
  title: 'Projects', // Changed title to reflect focus on projects
  description: 'Explore projects and services built by JKT48Connect', // Updated description
  openGraph: {
    url: 'https://docs.jkt48connect.my.id/projects', // Updated URL for projects
  },
});

interface ProjectObject {
  name: string;
  description: string;
  category: string;
  url?: string;
  status: 'Active' | 'Maintenance' | 'Beta' | 'Deprecated';
  tech?: string[];
}

const projects: ProjectObject[] = [
  {
    name: 'JKT48Connect API',
    description: 'RESTful API untuk mengakses data JKT48 termasuk member, jadwal, berita, dan konten multimedia',
    category: 'API',
    url: 'https://v2.jkt48connect.my.id',
    status: 'Active',
    tech: ['Node.js', 'Express', 'MongoDB']
  },
  {
    name: 'JKT48Connect WEB',
    description: 'Web official sebagai contoh sekaligus application yang bisa digunakan untuk melihat atau bahkan menonton livestreaming member secara langsung.',
    category: 'Web App',
    url: 'https://www.jkt48connect.my.id',
    status: 'Active',
    tech: ['Next.js', 'React', 'TypeScript']
  },
  {
    name: 'JKT48Connect Docs',
    description: 'Web dokumentasi official, untuk membantu developer dalam menggunakan JKT48Connect.',
    category: 'Web App',
    url: 'https://docs.jkt48connect.my.id',
    status: 'Active',
    tech: ['Next.js', 'React', 'TypeScript']
  },
  {
    name: 'ZENOVA',
    description: 'Bot WhatsApp otomatis untuk mendapatkan informasi JKT48 secara real-time',
    category: 'Chatbot',
    url: 'https://wa.me/6285189020193',
    status: 'Active',
    tech: ['Node.js', 'WhatsApp Web.js']
  },
  {
    name: 'JKT48Connect Discord Bot',
    description: 'Bot Discord dengan fitur notifikasi otomatis, games, dan integrasi API JKT48',
    category: 'Chatbot',
    url: 'https://discord.com/oauth2/authorize?client_id=1305141693477027891',
    status: 'Active',
    tech: ['Discord.js', 'Node.js']
  },
  {
    name: '@jkt48/core',
    description: 'Software Development Kits untuk memudahkan dalam menggunakan jkt48connect',
    category: 'Package',
    status: 'Active',
    tech: ['Javascript', 'Express']
  },
  {
    name: '@jkt48connect-corp/baileys',
    description: 'Baileys untuk WhatsApp yang dibekali dengan fitur button dan lainnya.',
    category: 'Package',
    status: 'Active',
    tech: ['Javascript', 'Express']
  },
  {
    name: 'JKT48Connect SDKs',
    description: 'Software Development Kits untuk berbagai bahasa pemrograman (JavaScript, Python, PHP)',
    category: 'Developer Tools',
    status: 'Deprecated',
    tech: ['JavaScript', 'Python', 'PHP']
  }
];

// Extract unique categories from the projects array
const categories = Array.from(new Set(projects.map(project => project.category)));

const getStatusColor = (status: ProjectObject['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Beta':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Maintenance':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Deprecated':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ProjectsPage() { // Renamed component to ProjectsPage for clarity
  return (
    <main className="px-4 py-12 z-[2] w-full max-w-[1400px] mx-auto [--color-fd-border:color-mix(in_oklab,var(--color-fd-primary)_30%,transparent)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border border-dashed p-6 rounded-lg bg-fd-background/50">
        <h1 className="mb-4 text-3xl font-bold text-center sm:text-left">
          Explore Our Ecosystem of Projects
        </h1>
        <p className="text-lg text-fd-muted-foreground text-center sm:text-left max-w-2xl mx-auto sm:mx-0">
          Discover the tools and services built by JKT48Connect to empower your development.
        </p>
        <div className="mt-8 flex justify-center sm:justify-start">
          <a
            href="https://wa.me/6285701479245"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'default', // Changed to default for more prominence
                size: 'lg', // Larger button
              }),
            )}
          >
            <PlusIcon className="me-2 size-5" />
            Suggest a Project
          </a>
        </div>
        {/* Optional: Keep or remove the image based on desired design */}
        <Image
          src={Design}
          alt="Abstract design preview"
          priority
          className="absolute right-0 bottom-0 w-[400px] min-w-[400px] opacity-20 hidden lg:block pointer-events-none select-none"
        />
      </div>

      {/* Projects Section */}
      <h2 className="text-3xl font-bold mt-16 mb-8 text-center">
        Our Projects & Services
      </h2>
      <p className="text-xl text-fd-muted-foreground mb-10 text-center max-w-3xl mx-auto">
        From powerful APIs to interactive chatbots and development packages, we're building for the future.
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <span className="text-base font-medium text-fd-muted-foreground self-center">Categories:</span>
        {categories.map((category) => (
          <span
            key={category}
            className="px-4 py-2 text-sm font-medium bg-fd-accent rounded-full border border-fd-border cursor-default hover:bg-fd-accent/80 transition-colors"
          >
            {category}
          </span>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center border border-dashed p-10 rounded-lg bg-fd-background/50">
        <h3 className="text-2xl font-bold mb-4">Want to contribute or suggest a project?</h3>
        <p className="text-lg text-fd-muted-foreground mb-6 max-w-2xl mx-auto">
          We're always looking for new ideas and contributions to expand the JKT48Connect ecosystem. Join us!
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/jkt48connect"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'lg',
              }),
            )}
          >
            View on GitHub
          </a>
          <a
            href="https://wa.me/6285701479245"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'lg',
              }),
            )}
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}

function ProjectCard({ name, description, category, url, status, tech }: ProjectObject) {
  return (
    <div className="group border border-dashed p-7 transition-all hover:bg-fd-accent rounded-lg flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-xl">{name}</h3>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-fd-muted-foreground hover:text-fd-primary"
                aria-label={`Visit ${name} website`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          <span className={cn(
            "px-3 py-1 text-xs font-medium rounded-full border",
            getStatusColor(status)
          )}>
            {status}
          </span>
        </div>
        
        <p className="text-base text-fd-muted-foreground mb-5">
          {description}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
        <span className="text-sm font-medium text-fd-primary bg-fd-primary/10 px-3 py-1.5 rounded-md border border-fd-primary/20">
          {category}
        </span>
        
        {tech && tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tech.slice(0, 3).map((technology, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1.5 bg-fd-muted/10 rounded-md border border-fd-border"
              >
                {technology}
              </span>
            ))}
            {tech.length > 3 && (
              <span className="text-xs px-3 py-1.5 bg-fd-muted/10 rounded-md border border-fd-border">
                +{tech.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
