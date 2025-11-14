import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions, linkItems } from '@/app/layout.config';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar';
import Link from 'fumadocs-core/link';
import Image from 'next/image';
import Preview from '@/public/banner.png';
import { Book, ComponentIcon, Pencil, PlusIcon, Server } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions}
      style={
        {
          '--spacing-fd-container': '1120px',
        } as object
      }
      links={[
        {
          type: 'menu',
          on: 'menu',
          text: 'Documentation',
          items: [
            {
              text: 'Getting Started',
              url: '/docs/ui',
              icon: <Book />,
            },
            {
              text: 'PlayGround',
              url: '/docs/openapi',
              icon: <ComponentIcon />,
            },
            {
              text: 'Changelog',
              url: '/changelog',
              icon: <ComponentIcon />,
            },
          ],
        },
        {
          type: 'custom',
          on: 'nav',
          children: (
            <NavbarMenu>
              <NavbarMenuTrigger>
                <Link href="/docs/ui">Documentation</Link>
              </NavbarMenuTrigger>
              <NavbarMenuContent className="text-[15px]">
                <NavbarMenuLink href="/docs/ui" className="md:row-span-2">
                  <div className="-mx-3 -mt-3">
                    <Image
                      src={Preview}
                      alt="Perview"
                      className="rounded-t-lg object-cover"
                      style={{
                        maskImage:
                          'linear-gradient(to bottom,white 60%,transparent)',
                      }}
                    />
                  </div>
                  <p className="font-medium">Getting Started</p>
                  <p className="text-fd-muted-foreground text-sm">
                    Leaarn about jkt48connect.
                  </p>
                </NavbarMenuLink>

                <NavbarMenuLink
                  href="/docs/playground"
                  className="lg:col-start-2"
                >
                  <ComponentIcon className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">Grow A Garden Feature</p>
                  <p className="text-fd-muted-foreground text-sm">
                    For gag player who want add gag system to apps.
                  </p>
                </NavbarMenuLink>

                <NavbarMenuLink
                  href="/docs/ui/openapi"
                  className="lg:col-start-2"
                >
                  <Server className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">JKT48Connect API</p>
                  <p className="text-fd-muted-foreground text-sm">
                    Playground untuk melihat ouput api secara realtime.
                  </p>
                </NavbarMenuLink>

                <NavbarMenuLink
                  href="/docs/headless"
                  className="lg:col-start-3 lg:row-start-2"
                >
                  <PlusIcon className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">@jkt48/core</p>
                  <p className="text-fd-muted-foreground text-sm">
                    Dokumentasi untuk module npmjs.
                  </p>
                </NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenu>
          ),
        },
        ...linkItems,
        {
          type: 'custom',
          on: 'nav',
          children: (
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
            >
              Register
            </Link>
          ),
        },
      ]}
      className="dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
    >
      <div className="container max-w-[1120px] mx-auto px-4">
        {children}
      </div>
      <Footer />
    </HomeLayout>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t bg-fd-card py-12 text-fd-secondary-foreground">
      <div className="container max-w-[1120px] mx-auto px-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold">JKT48Connect</p>
          <p className="text-xs">
            Built with ❤️ by{' '}
            <a
              href="https://www.jkt48connect.my.id"
              rel="noreferrer noopener"
              target="_blank"
              className="font-medium"
            >
              Valzy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
