import React from 'react';
import { useParams } from 'react-router-dom';
import ArticleMetaBar from '../../components/domain/ArticleMetaBar';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // En una implementación real, estos datos vendrían de la API
  const article = {
    id: id || '1',
    title: 'Lorem Ipsum Dolor Sit Amet',
    date: 'April 4, 2024',
    readTime: '5 min read',
    imageUrl: 'https://picsum.photos/1200/600?random=1',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://picsum.photos/100/100?random=10'
    },
    content: `
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse potenti. Integer euismod, sapien a iaculis placerat, ulticies eleunt et pulvtnar.</p>
      
      <p>Duis eget ligula id felis aliquet volutpat. Cras ec ser, eléaten uc consectetuer, nel quam, út se a, tellus ac clusi. Suspendisse potenti. Integer euismod, sapien a iaculis placerat, dloitse, nec ia vulputate lec turpis nlous.</p>
      
      <p>Suspendisse potenti. Integer euismoolurici a odi ia a.s ret iaculis placerat. Donec eu tortor atl felis. Pellentesque genenatuus et magna. Donec c conseq uliricicles, orci a portitor at, soutam at luctus pe ilbercorper in. Pellentesque-tima u wis, tindsegt lacis.</p>
      
    `,
  };
  
  // Artículos relacionados
  const relatedArticles = [
    {
      id: '2',
      title: 'Top 10 RPG Games You Must Play This Year',
      imageUrl: 'https://picsum.photos/400/300?random=2',
      date: 'March 28, 2024'
    },
    {
      id: '3',
      title: 'The Evolution of Gaming Graphics',
      imageUrl: 'https://picsum.photos/400/300?random=3',
      date: 'March 15, 2024'
    }
  ];
  
  // Artículos populares
  const popularArticles = [
    {
      id: '4',
      title: 'Indie Games That Revolutionized the Industry',
      imageUrl: 'https://picsum.photos/400/300?random=4',
      date: 'February 20, 2024'
    },
    {
      id: '5',
      title: 'The Future of Cloud Gaming',
      imageUrl: 'https://picsum.photos/400/300?random=5',
      date: 'January 15, 2024'
    },
    {
      id: '6',
      title: 'How AI is Changing Game Development',
      imageUrl: 'https://picsum.photos/400/300?random=6',
      date: 'December 10, 2023'
    }
  ];

  return (
    <div className="bg-black min-h-screen pb-12">
      {/* Hero image con mejor contraste */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <img 
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient más pronunciado para asegurar contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>
      
      {/* Article content */}
      <div className="container mx-auto px-4 md:px-8 relative -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content - 3/4 width on large screens */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight drop-shadow-lg">
              {article.title}
            </h1>
            
            <div className="text-gray-400 mb-10 flex items-center">
              <span>{article.date}</span>
              <span className="mx-2">•</span>
              <span>{article.readTime}</span>
            </div>
            
            <ArticleMetaBar 
              authorName={article.author.name}
              authorAvatar={article.author.avatar}
            />
            
            <div className="prose prose-lg prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            
            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-2">
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">Gaming</span>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">RPG</span>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">Adventure</span>
            </div>
          </div>
          
          {/* Sidebar - 1/4 width on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-6 text-white">Related Articles</h2>
              <div className="space-y-6">
                {relatedArticles.map(article => (
                  <div key={article.id} className="group">
                    <a href={`/articles/${article.id}`} className="block">
                      <div className="mb-2 overflow-hidden rounded">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-medium group-hover:text-purple-400 transition-colors">{article.title}</h3>
                      <p className="text-sm text-gray-400">{article.date}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Popular Articles - Full width below */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-8 text-white">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularArticles.map(article => (
              <a 
                key={article.id}
                href={`/articles/${article.id}`}
                className="group"
              >
                <div className="overflow-hidden rounded-lg mb-3">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-bold group-hover:text-purple-400 transition-colors">{article.title}</h3>
                <p className="text-sm text-gray-400">{article.date}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;