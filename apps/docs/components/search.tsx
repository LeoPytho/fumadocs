'use client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/cn';

const API_BASE_URL = 'https://v2.jkt48connect.com/api/zenova/search';
const PRIORITY_TOKEN = 'yJ2mlQYmOQ2f';

const items = [
  {
    name: 'All',
    value: 'all',
  },
  {
    name: 'Api',
    description: 'Only results about api documentation & guides',
    value: 'ui',
  },
  {
    name: 'Core',
    description: 'Only results about core features',
    value: 'headless',
  },
  {
    name: 'Blog',
    description: 'Only results about Blog',
    value: 'blog',
  },
];

interface SearchResult {
  id: string;
  score: number;
  document: {
    category: string;
    content: string;
    id: string;
    path: string;
    section: string;
    title: string;
  };
}

interface SearchResponse {
  status: boolean;
  message: string;
  data: {
    query: string;
    tag: string;
    total: number;
    results: SearchResult[];
  };
}

export default function CustomSearchDialog(props: SharedProps) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  const fetchSearchResults = async (query: string, selectedTag: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const url = new URL(API_BASE_URL);
      url.searchParams.append('q', query);
      url.searchParams.append('tag', selectedTag);
      url.searchParams.append('limit', '30');

      const response = await fetch(url.toString(), {
        headers: {
          'x-priority-token': PRIORITY_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      
      if (data.status && data.data.results.length > 0) {
        setSearchResults(data.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSearchResults(search, tag);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, tag]);

  const formattedResults = searchResults?.map((result) => ({
    id: result.document.id,
    type: 'page' as const,
    content: result.document.content,
    url: result.document.path,
  }));

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={formattedResults || null} />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">Filter</span>
              {items.find((item) => item.value === tag)?.name}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {items.map((item, i) => {
                const isSelected = item.value === tag;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTag(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-lg text-start px-2 py-1.5',
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent',
                    )}
                  >
                    <p className="font-medium mb-0.5">{item.name}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
          <a
            href="https://jkt48connect.com"
            rel="noreferrer noopener"
            className="text-xs text-nowrap text-fd-muted-foreground"
          >
            Powered by JKT48Connect
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
