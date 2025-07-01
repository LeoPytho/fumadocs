
'use client';
import {
  Children,
  type ComponentProps,
  createContext,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type TextareaHTMLAttributes,
  use,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Loader2, RefreshCw, Send, X, ExternalLink } from 'lucide-react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { cn } from '@/lib/cn';
import { buttonVariants } from '../../../../packages/ui/src/components/ui/button';
import { createProcessor, type Processor } from './markdown-processor';
import Link from 'fumadocs-core/link';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  type DialogProps,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  links?: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
}

interface ChatHelpers {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  reload: () => void;
  stop: () => void;
  setMessages: (messages: Message[]) => void;
}

const ChatContext = createContext<ChatHelpers | null>(null);
function useChatContext() {
  return use(ChatContext)!;
}

function SearchAIActions() {
  const { messages, isLoading, setMessages, reload } = useChatContext();

  if (messages.length === 0) return null;
  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-fd-popover px-3 py-1.5 flex flex-row items-center justify-end gap-2 empty:hidden">
      {!isLoading && messages.at(-1)?.role === 'assistant' && (
        <button
          type="button"
          className={cn(
            buttonVariants({
              color: 'secondary',
            }),
            'text-fd-muted-foreground rounded-full gap-1.5',
          )}
          onClick={() => reload()}
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      )}
      <button
        type="button"
        className={cn(
          buttonVariants({
            color: 'secondary',
          }),
          'text-fd-muted-foreground rounded-full',
        )}
        onClick={() => setMessages([])}
      >
        Clear Chat
      </button>
    </div>
  );
}

function SearchAIInput(props: FormHTMLAttributes<HTMLFormElement>) {
  const { isLoading, input, setInput, handleSubmit, stop } = useChatContext();
  
  const onStart = (e?: React.FormEvent) => {
    e?.preventDefault();
    handleSubmit(e);
  };

  useEffect(() => {
    if (isLoading) document.getElementById('nd-ai-input')?.focus();
  }, [isLoading]);

  return (
    <form
      {...props}
      className={cn(
        'flex items-start pe-2 transition-colors',
        isLoading && 'bg-fd-muted',
        props.className,
      )}
      onSubmit={onStart}
    >
      <Input
        value={input}
        placeholder={isLoading ? 'JKT48Connect AI is thinking...' : 'Ask about JKT48Connect API...'}
        disabled={isLoading}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart();
            event.preventDefault();
          }
        }}
      />
      {isLoading ? (
        <button
          type="button"
          className={cn(
            buttonVariants({
              color: 'secondary',
              className: 'rounded-full mt-2 gap-2',
            }),
          )}
          onClick={stop}
        >
          <Loader2 className="size-4 animate-spin text-fd-muted-foreground" />
          Stop
        </button>
      ) : (
        <button
          type="submit"
          className={cn(
            buttonVariants({
              color: 'ghost',
              className: 'rounded-full mt-2 p-1.5',
            }),
          )}
          disabled={input.length === 0}
        >
          <Send className="size-4" />
        </button>
      )}
    </form>
  );
}

function List(props: Omit<HTMLAttributes<HTMLDivElement>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    function callback() {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }

    const observer = new ResizeObserver(callback);
    callback();

    const element = containerRef.current?.firstElementChild;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        'fd-scroll-container overflow-y-auto max-h-[calc(100dvh-240px)] min-w-0 flex flex-col',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

function Input(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const shared = cn('col-start-1 row-start-1 max-h-60 min-h-12 p-3');

  return (
    <div className="grid flex-1">
      <textarea
        id="nd-ai-input"
        className={cn(
          shared,
          'resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none',
        )}
        {...props}
      />
      <div ref={ref} className={cn(shared, 'break-all invisible')}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  );
}

let processor: Processor | undefined;
const map = new Map<string, ReactNode>();

const roleName: Record<string, string> = {
  user: 'You',
  assistant: 'JKT48Connect AI',
};

// Function to extract and parse documentation links
function extractDocumentationLinks(content: string): Array<{title: string, url: string, description?: string}> {
  const links: Array<{title: string, url: string, description?: string}> = [];
  
  // Pattern untuk mendeteksi link dokumentasi
  const linkPattern = /📚 \*\*Dokumentasi Lengkap:\*\* (https:\/\/docs\.jkt48connect\.my\.id[^\s]+)/g;
  let match;
  
  while ((match = linkPattern.exec(content)) !== null) {
    const url = match[1];
    let title = 'Dokumentasi';
    let description = 'Panduan lengkap JKT48Connect';
    
    // Tentukan title berdasarkan URL
    if (url.includes('/what-is-jkt48connect')) {
      title = 'Apa itu JKT48Connect';
      description = 'Pengenalan JKT48Connect API';
    } else if (url.includes('/all-live')) {
      title = 'All Live';
      description = 'Panduan semua live streaming';
    } else if (url.includes('/idn')) {
      title = 'IDN Live';
      description = 'Panduan IDN Live streaming';
    } else if (url.includes('/showroom')) {
      title = 'Showroom';
      description = 'Panduan Showroom streaming';
    } else if (url.includes('/youtube')) {
      title = 'YouTube';
      description = 'Panduan YouTube integration';
    } else if (url.includes('/recent')) {
      title = 'Recent Updates';
      description = 'Data update terbaru';
    } else if (url.includes('/member')) {
      title = 'Member Data';
      description = 'Data member JKT48';
    } else if (url.includes('/docs/ui')) {
      title = 'Quick Start';
      description = 'Panduan memulai dengan JKT48Connect';
    }
    
    links.push({ title, url, description });
  }
  
  return links;
}

function Message({ message }: { message: Message }) {
  const documentationLinks = extractDocumentationLinks(message.content);
  
  return (
    <div>
      <p
        className={cn(
          'mb-1 text-xs font-medium text-fd-muted-foreground',
          message.role === 'assistant' && 'text-fd-primary',
        )}
      >
        {roleName[message.role] ?? 'unknown'}
      </p>
      <div className="prose text-sm">
        <Markdown text={message.content} />
      </div>
      
      {/* Render documentation links as cards */}
      {documentationLinks.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-xs font-medium text-fd-muted-foreground">📚 Dokumentasi Terkait:</p>
          <div className="flex flex-wrap gap-2">
            {documentationLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border bg-fd-card hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
              >
                <ExternalLink className="size-3" />
                <div className="flex flex-col">
                  <span className="font-medium">{link.title}</span>
                  {link.description && (
                    <span className="text-fd-muted-foreground">{link.description}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Pre(props: ComponentProps<'pre'>) {
  const code = Children.only(props.children) as ReactElement;
  const codeProps = code.props as ComponentProps<'code'>;

  let lang =
    codeProps.className
      ?.split(' ')
      .find((v) => v.startsWith('language-'))
      ?.slice('language-'.length) ?? 'text';

  if (lang === 'mdx') lang = 'md';

  return (
    <DynamicCodeBlock lang={lang} code={(codeProps.children ?? '') as string} />
  );
}

function Markdown({ text }: { text: string }) {
  const [rendered, setRendered] = useState<ReactNode>(map.get(text));

  useEffect(() => {
    let aborted = false;
    async function run() {
      let result = map.get(text);
      if (!result) {
        processor ??= createProcessor();

        result = await processor
          .process(text, {
            ...defaultMdxComponents,
            pre: Pre,
            img: undefined,
            // Custom link component untuk menangani link dokumentasi
            a: ({ href, children, ...props }) => {
              if (href?.startsWith('https://docs.jkt48connect.my.id')) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary underline hover:no-underline inline-flex items-center gap-1"
                    {...props}
                  >
                    {children}
                    <ExternalLink className="size-3" />
                  </a>
                );
              }
              return <Link href={href ?? '#'} {...props}>{children}</Link>;
            },
          })
          .catch(() => text);
      }

      map.set(text, result);
      if (!aborted) setRendered(result);
    }

    void run();
    return () => {
      aborted = true;
    };
  }, [text]);

  return rendered ?? text;
}

// Custom hook untuk menggantikan useChat
function useCustomChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.result,
          timestamp: Date.now(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi atau hubungi tim support JKT48Connect.',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const reload = () => {
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        setInput(lastUserMessage.content);
        setMessages(prev => prev.slice(0, -1)); // Remove last message
      }
    }
  };

  const stop = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
    }
  };

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    reload,
    stop,
    setMessages,
  };
}

export default function AISearch(props: DialogProps) {
  return (
    <Dialog {...props}>
      {props.children}
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in" />
        <DialogContent
          onOpenAutoFocus={(e) => {
            document.getElementById('nd-ai-input')?.focus();
            e.preventDefault();
          }}
          aria-describedby={undefined}
          className="fixed flex flex-col-reverse gap-3 md:flex-col max-md:top-12 md:bottom-12 left-1/2 z-50 w-[98vw] max-w-[860px] -translate-x-1/2 focus-visible:outline-none data-[state=closed]:animate-fd-fade-out"
        >
          <Content />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function Content() {
  const chat = useCustomChat();
  const { messages } = chat;

  return (
    <ChatContext value={chat}>
      {messages.length > 0 && (
        <List className="bg-fd-popover rounded-xl border shadow-lg animate-fd-dialog-in duration-600">
          <div className="flex flex-col gap-4 p-3 pb-0">
            {messages.map((item) => (
              <Message key={item.id} message={item} />
            ))}
          </div>
          <SearchAIActions />
        </List>
      )}
      <div className="p-2 bg-fd-secondary/50 rounded-xl animate-fd-dialog-in">
        <div className="rounded-xl overflow-hidden border shadow-lg bg-fd-popover text-fd-popover-foreground">
          <SearchAIInput />
          <div className="flex gap-2 items-center text-fd-muted-foreground px-3 py-1.5">
            <DialogTitle className="text-xs flex-1">
              Powered by{' '}
              <a
                href="https://jkt48connect.my.id"
                target="_blank"
                className="font-medium text-fd-popover-foreground hover:text-fd-primary transition-colors"
                rel="noreferrer noopener"
              >
                JKT48Connect AI
              </a>
              {' '}• Asisten untuk JKT48Connect API & Dokumentasi
            </DialogTitle>
            <DialogClose
              aria-label="Close"
              tabIndex={-1}
              className={cn(buttonVariants({ size: 'sm', color: 'ghost' }))}
            >
              <X className="size-4" />
              Close
            </DialogClose>
          </div>
        </div>
      </div>
    </ChatContext>
  );
}
