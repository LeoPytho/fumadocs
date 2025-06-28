'use client';

import {
  Fragment,
  type HTMLAttributes,
  type HTMLProps,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { TerminalIcon } from 'lucide-react';
import Link from 'next/link';
import scrollIntoView from 'scroll-into-view-if-needed';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import MainImg from './20250628_211230.png'; // Replace with an image showing your JKT48Connect powered app
import OpenAPIImg from './20250628_211911.png'; // Replace with an image showing your JKT48Connect API docs/playground
import { cva } from 'class-variance-authority';

export function CreateAppAnimation() {
  const installCmd = 'npm create jkt48-app'; // Changed command
  const tickTime = 100;
  const timeCommandEnter = installCmd.length;
  const timeCommandRun = timeCommandEnter + 3;
  const timeCommandEnd = timeCommandRun + 3;
  const timeWindowOpen = timeCommandEnd + 1;
  const timeEnd = timeWindowOpen + 1;

  const [tick, setTick] = useState(timeEnd);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev >= timeEnd ? prev : prev + 1));
    }, tickTime);

    return () => {
      clearInterval(timer);
    };
  }, [timeEnd]);

  const lines: ReactElement[] = [];

  lines.push(
    <span key="command_type">
      {installCmd.substring(0, tick)}
      {tick < timeCommandEnter && (
        <div className="inline-block h-3 w-1 animate-pulse bg-white" />
      )}
    </span>,
  );

  if (tick >= timeCommandEnter) {
    lines.push(<span key="space"> </span>);
  }

  if (tick > timeCommandRun)
    lines.push(
      <Fragment key="command_response">
        {tick > timeCommandRun + 1 && (
          <>
            <span className="font-bold">◇ Project name</span>
            <span>│ jkt48-app</span> {/* Changed project name */}
          </>
        )}
        {tick > timeCommandRun + 2 && (
          <>
            <span>│</span>
            <span className="font-bold">◆ installing @jkt48/core </span> {/* Changed prompt */}
          </>
        )}
        {tick > timeCommandRun + 3 && (
          <>
            <span>│ ● Next.js App Router (Recommended)</span> {/* Changed option */}
            <span>│ ○ React (SPA)</span> {/* Changed option */}
          </>
        )}
      </Fragment>,
    );

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (tick >= timeEnd) {
          setTick(0);
        }
      }}
    >
      {tick > timeWindowOpen && (
        <LaunchAppWindow className="absolute bottom-5 right-4 z-10 animate-in fade-in slide-in-from-top-10" />
      )}
      <pre className="overflow-hidden rounded-xl border text-[13px] shadow-lg">
        <div className="flex flex-row items-center gap-2 border-b px-4 py-2">
          <TerminalIcon className="size-4" />{' '}
          <span className="font-bold">JKT48Connect CLI</span> {/* Changed title */}
          <div className="grow" />
          <div className="size-2 rounded-full bg-red-400" />
        </div>
        <div className="min-h-[200px] bg-gradient-to-b from-fd-card">
          <code className="grid p-4">{lines}</code>
        </div>
      </pre>
    </div>
  );
}

function LaunchAppWindow(
  props: HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  return (
    <div
      {...props}
      className={cn(
        'overflow-hidden rounded-md border bg-fd-background shadow-xl',
        props.className,
      )}
    >
      <div className="relative flex h-6 flex-row items-center border-b bg-fd-muted px-4 text-xs text-fd-muted-foreground">
        <p className="absolute inset-x-0 text-center">jkt48connect.app:3000</p> {/* Changed URL */}
      </div>
      <div className="p-4 text-sm">JKT48 App Launched!</div> {/* Changed text */}
    </div>
  );
}

export function WhyInteractive(props: {
  codeblockTheme: ReactNode;
  codeblockSearchRouter: ReactNode;
  codeblockInteractive: ReactNode;
  typeTable: ReactNode;
  codeblockMdx: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const items = [
    'Comprehensive Data Search', // Changed item
    'Flexible Integration & Styling', // Changed item
    'Generate from API Schemas & Types', // Changed item
    'Engaging UI Components', // Changed item
    'Automated Data Sync & Server-side Logic', // Changed item
  ];

  return (
    <div
      id="why-interactive"
      className="flex flex-col-reverse gap-3 md:flex-row md:min-h-[380px]"
    >
      <div className="flex flex-col">
        {items.map((item, i) => (
          <button
            key={item}
            ref={(element) => {
              if (!element || i !== active) return;

              scrollIntoView(element, {
                behavior: 'smooth',
                boundary: document.getElementById('why-interactive'),
              });
            }}
            type="button"
            className={cn(
              'transition-colors text-nowrap border border-transparent rounded-lg px-3 py-2.5 text-start text-sm text-fd-muted-foreground font-medium',
              i === active
                ? 'text-fd-primary bg-fd-primary/10 border-fd-primary/10'
                : 'hover:text-fd-accent-foreground/80',
            )}
            onClick={() => {
              setActive(i);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <style>
        {`
        @keyframes why-interactive-x {
          from {
            width: 0px;
          }
          
          to {
            width: 100%;
          }
        }`}
      </style>

      <div className="flex-1 p-4 border border-fd-primary/10 bg-fd-card/40 rounded-lg shadow-lg">
        {active === 0 ? (
          <WhyPanel>
            <h3>We made data discovery simple.</h3> {/* Changed heading */}
            <p>
              JKT48Connect offers robust search capabilities, allowing you to
              easily query and retrieve specific data on members, songs, or events.
              Integrate with powerful search engines or use our built-in filters.
            </p>
            {props.codeblockSearchRouter} {/* This codeblock needs to be relevant to API searching */}
          </WhyPanel>
        ) : null}

        {active === 1 ? (
          <WhyPanel>
            <h3>Seamless Integration & Customizable Styles.</h3> {/* Changed heading */}
            <p>
              JKT48Connect is designed for flexible integration with any frontend framework.
              Easily connect with your existing design system or use our recommended
              styling approaches for a consistent look.
            </p>
            {props.codeblockTheme} {/* This codeblock should be relevant to styling within a JKT48 app */}
            <Link
              href="/docs/integration/styling" // Changed link
              className={cn(buttonVariants(), 'not-prose')}
            >
              See Integration Guides
            </Link>
          </WhyPanel>
        ) : null}

        {active === 2 ? (
          <WhyPanel>
            <h3>Automate your data models.</h3> {/* Changed heading */}
            <p>
              JKT48Connect provides detailed API schemas and type definitions.
              Automatically generate client-side types from our API definitions
              to ensure type-safe data handling in your applications.
            </p>
            {props.typeTable} {/* This should be a TypeTable for JKT48Connect API response types */}
            <p>
              We also provide an interactive API playground for exploring endpoints and responses.
            </p>

            <div className="mt-4 flex flex-row items-center gap-1.5 not-prose">
              <Link
                href="/docs/api-reference/data-types" // Changed link
                className={cn(buttonVariants())}
              >
                API Data Types
              </Link>
              <Link
                href="/docs/api-reference/playground" // Changed link
                className={cn(buttonVariants({ variant: 'ghost' }))}
              >
                API Playground
              </Link>
            </div>
          </WhyPanel>
        ) : null}
        {active === 3 ? (
          <WhyPanel>
            <h3>Create interactive fan experiences.</h3> {/* Changed heading */}
            <p>
              Leverage JKT48Connect data to build dynamic and engaging user interfaces.
              Display member profiles, live schedules, and fan interactions with ease.
            </p>
            {props.codeblockInteractive} {/* This should be code for an interactive JKT48 component */}
            <Link
              href="/docs/examples/ui-components" // Changed link
              className={cn(buttonVariants(), 'not-prose')}
            >
              View UI Examples
            </Link>
          </WhyPanel>
        ) : null}
        {active === 4 ? (
          <WhyPanel>
            <h3>Connect your app to real-time JKT48 data.</h3> {/* Changed heading */}

            <p>
              With server-side capabilities, JKT48Connect allows you to pre-fetch
              and serve data efficiently. Use API data to power server-rendered
              pages or client-side interactions.
            </p>

            {props.codeblockMdx} {/* This should be relevant to server-side data fetching for JKT48 data */}
          </WhyPanel>
        ) : null}
      </div>
    </div>
  );
}

function WhyPanel(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'duration-700 animate-in fade-in text-sm prose',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

const previewButtonVariants = cva(
  'w-20 h-9 text-sm font-medium transition-colors rounded-full',
  {
    variants: {
      active: {
        true: 'text-fd-primary-foreground',
        false: 'text-fd-muted-foreground',
      },
    },
  },
);
export function PreviewImages() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-12 min-w-[800px] overflow-hidden xl:-mx-12 dark:[mask-image:linear-gradient(to_top,transparent,white_40px)]">
      <div className="absolute flex flex-row left-1/2 -translate-1/2 bottom-4 z-[2] p-1 rounded-full bg-fd-card border shadow-xl dark:shadow-fd-background">
        <div
          role="none"
          className="absolute bg-fd-primary rounded-full w-20 h-9 transition-transform z-[-1]"
          style={{
            transform: `translateX(calc(var(--spacing) * 20 * ${active}))`,
          }}
        />
        <button
          className={cn(previewButtonVariants({ active: active === 0 }))}
          onClick={() => setActive(0)}
        >
          App Demo
        </button> {/* Changed button label */}
        <button
          className={cn(previewButtonVariants({ active: active === 1 }))}
          onClick={() => setActive(1)}
        >
          API Docs
        </button> {/* Changed button label */}
      </div>
      <Image
        src={MainImg} // **IMPORTANT: Replace this with your JKT48Connect powered app screenshot**
        alt="JKT48Connect App Demo" // Changed alt text
        priority
        className={cn(
          'w-full select-none duration-1000 animate-in fade-in -mb-60 slide-in-from-bottom-12 lg:-mb-40',
          active !== 0 && 'hidden',
        )}
      />
      {active === 1 && (
        <Image
          src={OpenAPIImg} // **IMPORTANT: Replace this with your JKT48Connect API documentation/playground screenshot**
          alt="JKT48Connect API Documentation" // Changed alt text
          priority
          className={cn(
            'w-full select-none duration-1000 animate-in fade-in -mb-60 slide-in-from-bottom-12 lg:-mb-40',
            active !== 1 && 'hidden',
          )}
        />
      )}
    </div>
  );
}
