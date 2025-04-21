import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/Home/HomePage';
import ArticlesPage from './pages/Articles/ArticlesPage';
import ArticleDetailPage from './pages/Articles/ArticleDetailPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminPostsPage from './pages/Admin/AdminPostsPage';
import AdminPostFormPage from './pages/Admin/AdminPostFormPage';
import AdminCategoriesPage from './pages/Admin/AdminCategoriesPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminSettingsPage from './pages/Admin/AdminSettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfilePage from './pages/Profile/ProfilePage';

// Páginas (a implementar posteriormente)
const ReviewsPage = () => <div className="container mx-auto p-6">Reviews Page (Coming Soon)</div>;
const ReviewDetailPage = () => <div className="container mx-auto p-6">Review Detail Page (Coming Soon)</div>;
const AboutPage = () => <div className="container mx-auto p-6">About Page (Coming Soon)</div>;
const ContactPage = () => <div className="container mx-auto p-6">Contact Page (Coming Soon)</div>;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:id" element={<ArticleDetailPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="reviews/:id" element={<ReviewDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          
          {/* Añade la ruta para el perfil con protección */}
          <Route path="profile" element={
            <ProtectedRoute requireAdmin={false}>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Rutas de administración (protegidas) */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          {/* ... rutas de administración ... */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;