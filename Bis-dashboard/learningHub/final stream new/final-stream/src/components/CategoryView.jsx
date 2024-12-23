import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { categoryThemes } from '../data/categoryThemes';
import { BackgroundPattern } from './ui/BackgroundPattern';
import { ProgressBar } from './ui/ProgressBar';

function CategoryView() {
  const { id } = useParams();
  const category = categories.find(c => c.id === parseInt(id));
  const theme = categoryThemes[parseInt(id)];

  if (!category) return <div>Category not found</div>;

  return (
    <div className={`min-h-screen ${theme.lightBg} relative`}>
      <BackgroundPattern color={theme.text.replace('text-', '')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className={`${theme.primary} rounded-2xl p-8 text-white shadow-xl relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
                <path d="M14 16H12V14H14V16Z" stroke="currentColor" strokeWidth="0.5" />
                <path d="M16 16H14V14H16V16Z" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
              <p className="text-lg text-white/90">{category.description}</p>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Progress</h2>
              {category.progress === 100 && (
                <Link
                  to={`/certificate/${category.id}`}
                  className={`px-6 py-3 ${theme.primary} text-white rounded-xl ${theme.hover} transition-all duration-300 transform hover:scale-105`}
                >
                  Download Certificate
                </Link>
              )}
            </div>
            <ProgressBar progress={category.progress} theme={theme} size="large" />
          </div>
        </div>

        <div className="space-y-6">
          {category.videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="block transform hover:scale-102 transition-all duration-300"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl">
                <div className="p-6 flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className={`w-32 h-20 ${theme.secondary} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      <svg className={`w-10 h-10 ${theme.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500">Duration: {video.duration}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {video.completed ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Completed
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${theme.secondary} ${theme.text}`}>
                        Start Learning →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryView;