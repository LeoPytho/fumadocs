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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Hero Section with curved design */}
      <div className="relative overflow-hidden">
        <div
          className="relative h-[400px] md:h-[500px] flex items-center justify-center"
          style={{
            backgroundImage: [
              'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
              'radial-gradient(circle at 30% 20%, rgba(255,50,100,0.3), transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(190,0,255,0.3), transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(50,50,255,0.2), transparent 50%)',
              `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
            ].join(', '),
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-20 blur-xl"></div>
          
          <div className="text-center z-10 px-8 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
              JKT48Connect
            </h1>
            <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span className="text-lg md:text-xl font-semibold text-gray-800">Blog</span>
            </div>
            <p className="text-lg md:text-xl text-gray-700 font-light italic">
              Light and gorgeous. like the moon
            </p>
          </div>
          
          {/* Curved bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" className="w-full h-16 md:h-20 fill-white">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest Articles</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Featured Post (First Post) */}
        {posts.length > 0 && (
          <div className="mb-16">
            <Link
              href={posts[0].url}
              className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
            >
              <div className="md:flex">
                <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">Featured</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="md:w-2/3 p-8 md:p-12">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                      Latest
                    </span>
                    <time className="text-sm text-gray-500 font-medium">
                      {new Date(posts[0].data.date ?? posts[0].file.name).toDateString()}
                    </time>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors">
                    {posts[0].data.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {posts[0].data.description}
                  </p>
                  <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Read More
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, index) => (
            <Link
              key={post.url}
              href={post.url}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-xs font-medium text-gray-700">#{index + 2}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                  <time className="text-xs text-gray-500 font-medium">
                    {new Date(post.data.date ?? post.file.name).toDateString()}
                  </time>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.data.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.data.description}
                </p>
                
                <div className="flex items-center text-purple-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Continue Reading
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
