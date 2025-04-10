import React from 'react';
import FeaturedArticle from '../../components/domain/FeaturedArticle';
import ArticleCard from '../../components/domain/ArticleCard';
import ReviewCard from '../../components/domain/ReviewCard';

// Datos de ejemplo (más adelante se reemplazarán con datos de la API)
const featuredArticle = {
  id: '1',
  title: 'The Future of Virtual Reality Gaming',
  excerpt: 'Virtual reality gaming provides vital experiences for gamers and thrilling interactive video game and in-game challenges.',
  date: 'April 24, 2024',
  imageUrl: 'https://picsum.photos/1200/600' 
};

const latestArticles = [
  {
    id: '2',
    title: 'Top 10 FPS Games of 2024',
    date: 'April 20, 2024',
    category: 'Guides',
    imageUrl: 'https://picsum.photos/400/300'
  },
  {
    id: '3',
    title: 'Exploring the World of Indie Games',
    date: 'April 18, 2024',
    category: 'Articles',
    imageUrl: 'https://picsum.photos/400/300'
  }
];

const popularReviews = [
  {
    id: '4',
    title: 'CyberQuest Review',
    date: 'April 12, 2024',
    imageUrl: 'https://picsum.photos/100/100'
  },
  {
    id: '5',
    title: 'Legends of Adventure: An Epic Journey',
    date: 'April 10, 2024',
    imageUrl: 'https://picsum.photos/100/100'
  },
  {
    id: '6',
    title: 'The Best RPGs of 2024',
    date: 'April 3, 2024',
    imageUrl: 'https://picsum.photos/100/100'
  },
  {
    id: '7',
    title: 'Mystic Odyssey Review',
    date: 'April 2, 2024',
    imageUrl: 'https://picsum.photos/100/100'
  }
];

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <FeaturedArticle {...featuredArticle} />
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section>
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map(article => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          </section>
        </div>
        
        <div>
          <section>
            <h2 className="text-2xl font-bold mb-6">Popular Reviews</h2>
            <div className="space-y-4">
              {popularReviews.map(review => (
                <ReviewCard key={review.id} {...review} />
              ))}
            </div>
          </section>
        </div>
      </div>
      
      <section className="mt-12">
        <div className="w-full h-64 bg-gray-800 rounded-lg overflow-hidden relative">
          <img 
            src="https://picsum.photos/1200/400" 
            alt="Featured game" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Coming Soon: More Gaming Content</h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;