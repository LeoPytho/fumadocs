import Link from 'next/link';
import { blog } from '@/lib/source';

export default function Page(): React.ReactElement {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? b.file.name).getTime() -
      new Date(a.data.date ?? a.file.name).getTime(),
  );
  
  const svg = `<svg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'>
  <filter id='noiseFilter'>
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency='0.65' 
      numOctaves='3' 
      stitchTiles='stitch'/>
  </filter>
  
  <rect width='100%' height='100%' filter='url(#noiseFilter)'/>
</svg>`;

  return (
    <main className="min-h-screen">
      {/* Hero Section dengan bentuk melengkung */}
      <div
        className="relative overflow-hidden px-6 py-16 md:px-12 md:py-24"
        style={{
          backgroundImage: [
            'radial-gradient(circle at 70% 10%, rgba(255,50,100,0.5), transparent)',
            'radial-gradient(circle at 0% 80%, rgba(190,0,255,0.5), transparent)',
            'radial-gradient(circle at 50% 50%, rgba(50,50,255,0.3), transparent)',
            `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
          ].join(', '),
        }}
      >
        {/* Decorative curved bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            className="h-12 w-full md:h-20"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 Q300,0 600,60 T1200,40 V120 H0 Z"
              fill="white"
              className="fill-fd-background"
            />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            JKT48Connect
            <span className="block text-3xl font-normal md:text-4xl">Blog</span>
          </h1>
          <div className="mx-auto h-1 w-24 bg-fd-foreground mb-6"></div>
          <p className="text-lg md:text-xl opacity-90">
            Light and gorgeous. like the moon
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12 md:px-12">
        {/* Blog Posts Grid dengan layout masonry-style */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post, index) => (
            <Link
              key={post.url}
              href={post.url}
              className={`group relative overflow-hidden rounded-2xl bg-fd-card shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-fd-accent hover:text-fd-accent-foreground ${
                index % 3 === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Card dengan gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fd-primary/20 to-fd-secondary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              
              <div className="relative p-6">
                {/* Date badge */}
                <div className="absolute right-4 top-4 rounded-full bg-fd-muted px-3 py-1 text-xs font-medium text-fd-muted-foreground">
                  {new Date(post.data.date ?? post.file.name).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold leading-tight group-hover:text-fd-accent-foreground">
                    {post.data.title}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-fd-muted-foreground line-clamp-3">
                    {post.data.description}
                  </p>
                  
                  {/* Read more indicator */}
                  <div className="flex items-center text-sm font-medium">
                    <span className="mr-2 text-fd-primary">Read more</span>
                    <svg 
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Empty state jika tidak ada posts */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 rounded-full bg-fd-muted flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-fd-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-fd-muted-foreground">Check back later for new content!</p>
          </div>
        )}
      </div>
    </main>
  );
}
