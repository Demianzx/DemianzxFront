import React, { useState, useEffect } from 'react';
import CategoryFilter from '../../components/domain/CategoryFilter';
import ArticleGridItem from '../../components/domain/ArticleGridItem';

// Ejemplo de datos de artículos (en una implementación real, estos vendrían de una API)
const allArticles = [
  {
    id: '1',
    title: 'Top 10 FPS Games of 2024',
    date: 'April 24, 2024',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    category: 'PC'
  },
  {
    id: '2',
    title: 'Exploring the World of Indie Games',
    date: 'April 24, 2024',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    category: 'Indie'
  },
  {
    id: '3',
    title: 'The Future of Virtual Reality Gaming',
    date: 'April 24, 2024',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    category: 'VR'
  },
  {
    id: '4',
    title: 'New Adventures in "CyberQuest"',
    date: 'April 24, 2024',
    imageUrl: 'https://picsum.photos/600/400?random=4',
    category: 'Console'
  },
  {
    id: '5',
    title: 'The Evolution of Racing Games',
    date: 'April 24, 2024',
    imageUrl: 'https://picsum.photos/600/400?random=5',
    category: 'Console'
  },
  {
    id: '6',
    title: 'Mobile Gaming: The New Frontier',
    date: 'April 23, 2024',
    imageUrl: 'https://picsum.photos/600/400?random=6',
    category: 'Mobile'
  },
  {
    id: '7',
    title: 'Classic RPGs That Defined a Generation',
    date: 'April 22, 2024',
    imageUrl: 'https://picsum.photos/600/400?random=7',
    category: 'PC'
  },
  {
    id: '8',
    title: 'The Art of Game Design',
    date: 'April 21, 2024',
    imageUrl: 'https://picsum.photos/600/400?random=8',
    category: 'Indie'
  },
];

const ArticlesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayedArticles, setDisplayedArticles] = useState(allArticles);
  
  // Categorías disponibles (en una implementación real, podrían venir de la API)
  const categories = ['All', 'PC', 'Console', 'Mobile', 'VR'];
  
  // Filtrar artículos cuando cambia la categoría
  useEffect(() => {
    if (activeCategory === 'All') {
      setDisplayedArticles(allArticles);
    } else {
      setDisplayedArticles(allArticles.filter(article => article.category === activeCategory));
    }
  }, [activeCategory]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-8">Articles</h1>
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {displayedArticles.map(article => (
          <ArticleGridItem
            key={article.id}
            id={article.id}
            title={article.title}
            date={article.date}
            imageUrl={article.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;