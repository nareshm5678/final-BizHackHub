import React from 'react';
import { categories } from '../data/categories';
import { categoryThemes } from '../data/categoryThemes';
import { BackgroundPattern } from './ui/BackgroundPattern';
import { ProgressBar } from './ui/ProgressBar';
import { CategoryCard } from './ui/CategoryCard';

function Dashboard() {
  const calculateOverallProgress = () => {
    const totalProgress = categories.reduce((acc, cat) => acc + cat.progress, 0);
    return Math.round((totalProgress / categories.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative">
      <BackgroundPattern />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            BIS Standards Learning Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master industry standards through interactive learning and earn certificates
          </p>
        </div>

        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Overall Progress</h2>
              <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                {calculateOverallProgress()}% Completed
              </span>
            </div>
            <ProgressBar 
              progress={calculateOverallProgress()} 
              theme={categoryThemes[1]} 
              size="large" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              theme={categoryThemes[category.id]} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;