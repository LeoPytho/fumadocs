
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
import { Loader2, RefreshCw, Send, X, ExternalLink, FileText, Code, Book, Zap } from 'lucide-react';
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
  processing_info?: {
    models_used: string[];
    conversation_length: number;
    user_id: string;
  };
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
  processingInfo?: {
    models_used: string[];
    conversation_length: number;
    user_id: string;
  };
}

const ChatContext = createContext<ChatHelpers | null>(null);
function useChatContext() {
  return use(ChatContext)!;
}

// Processing indicator component
function ProcessingIndicator({ models }: { models: string[] }) {
  const [currentModel, setCurrentModel] = useState(0);
  
  useEffect(() => {
    if (models.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentModel((prev) => (prev + 1) % models.length);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [models]);
  
  return (
    <div className="flex items-center gap-2 text-xs text-fd-muted-foreground">
      <Zap className="size-3 animate-pulse" />
      <span>Processing with {models[currentModel] || 'Multi-Model AI'}...</span>
    </div>
  );
}

function SearchAIActions() {
  const { messages, isLoading, setMessages, reload, processingInfo } = useChatContext();

  if (messages.length === 0) return null;
  
  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-fd-popover px-3 py-1.5 flex flex-col gap-2">
      {/* Processing info display */}
      {processingInfo && (
        <div className="text-xs text-fd-muted-foreground bg-fd-muted/30 px-2 py-1 rounded">
          <div className="flex items-center gap-1">
            <Zap className="size-3" />
            <span>Processed by: {processingInfo.models_used.join(' → ')}</span>
          </div>
          <div className="text-xs opacity-75">
            Conversation: {processingInfo.conversation_length} messages
          </div>
        </div>
      )}
      
      <div className="flex flex-row items-center justify-end gap-2">
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
            Regenerate
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
        placeholder={
          isLoading 
            ? 'JKT48Connect AI sedang memproses dengan Multi-Model Pipeline...' 
            : 'Tanya tentang JKT48Connect API atau minta dokumentasi...'
        }
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
        <div className="flex flex-col items-center gap-1 mt-2">
          <button
            type="button"
            className={cn(
              buttonVariants({
                color: 'secondary',
                className: 'rounded-full gap-2',
              }),
            )}
            onClick={stop}
          >
            <Loader2 className="size-4 animate-spin text-fd-muted-foreground" />
            Stop
          </button>
          <ProcessingIndicator models={['DeepSeek V3', 'Kimi K2', 'Qwen2', 'MiniMax M1']} />
        </div>
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
        'fd-scroll-container overflow-y-auto max-h-[calc(100dvh-280px)] min-w-0 flex flex-col',
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

// Enhanced function to extract and parse documentation links
function extractDocumentationLinks(content: string): Array<{
  title: string, 
  url: string, 
  description?: string,
  type: 'documentation' | 'redirect' | 'api'
}> {
  const links: Array<{title: string, url: string, description?: string, type: 'documentation' | 'redirect' | 'api'}> = [];
  
  // Enhanced patterns for different link types
  const patterns = [
    // Documentation links
    { 
      pattern: /📚 \*\*Dokumentasi (?:Lengkap|Terkait):\*\* (https:\/\/docs\.jkt48connect\.my\.id[^\s\)]+)/g,
      type: 'documentation' as const
    },
    // Redirect links
    { 
      pattern: /🔗 \*\*Redirect ke Dokumentasi:\*\* (https:\/\/docs\.jkt48connect\.my\.id[^\s\)]+)/g,
      type: 'redirect' as const
    },
    // General links in markdown format
    { 
      pattern: /\[([^\]]+)\]\((https:\/\/docs\.jkt48connect\.my\.id[^\)]+)\)/g,
      type: 'documentation' as const
    }
  ];

  patterns.forEach(({ pattern, type }) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const url = type === 'documentation' && match[2] ? match[2] : match[1];
      const linkTitle = type === 'documentation' && match[2] ? match[1] : undefined;
      
      let title = linkTitle || 'Dokumentasi';
      let description = 'Panduan JKT48Connect';
      
      // Enhanced URL-based title and description mapping
      const urlMappings = [
        {
          check: (url: string) => url.includes('/what-is-jkt48connect'),
          title: 'Apa itu JKT48Connect',
          description: 'Pengenalan dan overview JKT48Connect API'
        },
        {
          check: (url: string) => url.includes('/all-live'),
          title: 'All Live Streams',
          description: 'Panduan lengkap semua platform live streaming'
        },
        {
          check: (url: string) => url.includes('/idn'),
          title: 'IDN Live',
          description: 'Implementasi IDN Live streaming API'
        },
        {
          check: (url: string) => url.includes('/showroom'),
          title: 'Showroom',
          description: 'Integrasi dengan platform Showroom'
        },
        {
          check: (url: string) => url.includes('/youtube'),
          title: 'YouTube Integration',
          description: 'Cara menggunakan YouTube API endpoints'
        },
        {
          check: (url: string) => url.includes('/recent-detail'),
          title: 'Recent Detail',
          description: 'Detail data streaming terbaru'
        },
        {
          check: (url: string) => url.includes('/recent'),
          title: 'Recent Updates',
          description: 'Data update dan activity terbaru'
        },
        {
          check: (url: string) => url.includes('/member'),
          title: 'Member Data',
          description: 'Data lengkap member JKT48'
        },
        {
          check: (url: string) => url.endsWith('/docs/ui'),
          title: 'Quick Start Guide',
          description: 'Panduan cepat memulai dengan JKT48Connect'
        }
      ];

      const mapping = urlMappings.find(m => m.check(url));
      if (mapping && !linkTitle) {
        title = mapping.title;
        description = mapping.description;
      }
      
      // Avoid duplicates
      if (!links.some(link => link.url === url)) {
        links.push({ title, url, description, type });
      }
    }
  });
  
  return links;
}

// Enhanced link component with auto-redirect functionality
function DocumentationLink({ link, index }: { 
  link: { title: string, url: string, description?: string, type: 'documentation' | 'redirect' | 'api' }, 
  index: number 
}) {
  const getIcon = () => {
    switch (link.type) {
      case 'redirect':
        return <ExternalLink className="size-3" />;
      case 'api':
        return <Code className="size-3" />;
      default:
        return <Book className="size-3" />;
    }
  };

  const getVariant = () => {
    switch (link.type) {
      case 'redirect':
        return 'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90';
      case 'api':
        return 'bg-fd-accent text-fd-accent-foreground hover:bg-fd-accent/90';
      default:
        return 'bg-fd-card hover:bg-fd-accent hover:text-fd-accent-foreground';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Auto-redirect functionality - only for redirect type links
    if (link.type === 'redirect') {
      e.preventDefault();
      // Open in new tab
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <a
      key={index}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-colors min-w-0 cursor-pointer',
        getVariant(),
        link.type === 'redirect' && 'animate-pulse'
      )}
    >
      {getIcon()}
      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">
          {link.title}
          {link.type === 'redirect' && ' (Auto-redirect)'}
        </span>
        {link.description && (
          <span className="text-xs opacity-80 truncate">{link.description}</span>
        )}
      </div>
    </a>
  );
}

function Message({ message }: { message: Message }) {
  const documentationLinks = extractDocumentationLinks(message.content);
  
  // Auto-redirect functionality
  useEffect(() => {
    const redirectLinks = documentationLinks.filter(link => link.type === 'redirect');
    
    if (redirectLinks.length > 0 && message.role === 'assistant') {
      const timer = setTimeout(() => {
        redirectLinks.forEach(link => {
          window.open(link.url, '_blank', 'noopener,noreferrer');
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [documentationLinks, message.role]);
  
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <p
          className={cn(
            'text-xs font-medium text-fd-muted-foreground',
            message.role === 'assistant' && 'text-fd-primary',
          )}
        >
          {roleName[message.role] ?? 'unknown'}
          {message.timestamp && (
            <span className="ml-2 text-xs opacity-50">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          )}
        </p>
        
        {/* Processing info indicator */}
        {message.processing_info && message.role === 'assistant' && (
          <div className="flex items-center gap-1 text-xs text-fd-muted-foreground">
            <Zap className="size-3" />
            <span className="hidden sm:inline">
              {message.processing_info.models_used.length} Models
            </span>
          </div>
        )}
      </div>
      
      <div className="prose prose-sm max-w-none">
        <Markdown text={message.content} />
      </div>
      
      {/* Enhanced documentation links rendering */}
      {documentationLinks.length > 0 && (
        <div className="mt-4 p-3 bg-fd-muted/30 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="size-4 text-fd-primary" />
            <p className="text-sm font-medium text-fd-foreground">
              {documentationLinks.some(l => l.type === 'redirect') ? 'Opening Documentation...' : 'Dokumentasi Terkait'}
            </p>
            {documentationLinks.some(l => l.type === 'redirect') && (
              <span className="text-xs text-fd-muted-foreground">
                (akan terbuka otomatis)
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {documentationLinks.map((link, index) => (
              <DocumentationLink key={index} link={link} index={index} />
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
            // Enhanced link component for handling documentation links
            a: ({ href, children, ...props }) => {
              if (href?.startsWith('https://docs.jkt48connect.my.id')) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary underline hover:no-underline inline-flex items-center gap-1 font-medium"
                    {...props}
                  >
                    {children}
                    <ExternalLink className="size-3" />
                  </a>
                );
              }
              if (href?.startsWith('https://v2.jkt48connect.my.id')) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-accent-foreground bg-fd-accent px-1.5 py-0.5 rounded text-xs font-mono inline-flex items-center gap-1"
                    {...props}
                  >
                    {children}
                    <Code className="size-3" />
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

// Enhanced custom hook with better error handling and processing info
function useCustomChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [processingInfo, setProcessingInfo] = useState<{
    models_used: string[];
    conversation_length: number;
    user_id: string;
  }>();

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.result,
          timestamp: Date.now(),
          processing_info: data.processing_info,
        };

        setMessages(prev => [...prev, assistantMessage]);
        setProcessingInfo(data.processing_info);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Chat error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi atau hubungi tim support JKT48Connect.

🔗 **Support:** https://docs.jkt48connect.my.id/docs/ui`,
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
        setMessages(prev => prev.slice(0, -1)); // Remove last assistant message
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
    processingInfo,
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
          <div className="flex flex-col gap-6 p-4 pb-0">
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
            <DialogTitle className="text-xs flex-1 flex items-center gap-1">
              <Zap className="size-3" />
              Powered by{' '}
              <a
                href="https://jkt48connect.my.id"
                target="_blank"
                className="font-medium text-fd-popover-foreground hover:text-fd-primary transition-colors"
                rel="noreferrer noopener"
              >
                JKT48Connect AI
              </a>
              {' '}• Multi-Model Pipeline (DeepSeek V3 → Kimi K2 → Qwen2 → MiniMax M1)
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
