import Link from 'next/link';
import { blog } from '@/lib/source';
import Image from 'next/image';

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
        baseFrequency='0.85' 
        numOctaves='4' 
        stitchTiles='stitch'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#noiseFilter)' opacity='0.1'/>
  </svg>`;

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="relative h-[400px] md:h-[500px] flex items-center justify-center"
          style={{
            backgroundImage: [
              'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(168,85,247,0.8))',
              'radial-gradient(circle at 30% 20%, rgba(255,182,193,0.3), transparent)',
              'radial-gradient(circle at 80% 80%, rgba(186,230,253,0.4), transparent)',
              `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
            ].join(', '),
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              JKT48Connect
              <span className="block text-3xl md:text-4xl font-light mt-2 opacity-90">
                Blog
              </span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Light and gorgeous, like the moon ✨
            </p>
            <div className="mt-8 h-1 w-24 bg-white/50 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
              Latest Post
            </h2>
            <Link
              href={featuredPost.url}
              className="group block bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  {featuredPost.data.image ? (
                    <div className="relative h-64 md:h-full">
                      <Image
                        src={featuredPost.data.image}
                        alt={featuredPost.data.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-64 md:h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <div className="text-white text-6xl opacity-50">📝</div>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {featuredPost.data.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-lg">
                    {featuredPost.data.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                    <time className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(featuredPost.data.date ?? featuredPost.file.name).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
              All Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link
                  key={post.url}
                  href={post.url}
                  className="group block bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="relative">
                    {post.data.image ? (
                      <div className="relative h-48">
                        <Image
                          src={post.data.image}
                          alt={post.data.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                        <div className="text-white text-4xl opacity-70">📄</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {post.data.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.data.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <time className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(post.data.date ?? post.file.name).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                      <div className="text-purple-500 group-hover:text-purple-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
