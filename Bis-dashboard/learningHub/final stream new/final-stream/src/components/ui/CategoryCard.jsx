import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';

export function CategoryCard({ category, theme }) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="group transform hover:scale-105 transition-all duration-300"
    >
      <div className={`rounded-xl shadow-lg overflow-hidden ${theme.lightBg} border border-gray-100`}>
        <div className={`${theme.primary} p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
              <path d="M14 16H12V14H14V16Z" stroke="currentColor" strokeWidth="0.5" />
              <path d="M16 16H14V14H16V16Z" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white relative z-10">
            {category.title}
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">{category.description}</p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm mb-1">
              <span className={`${theme.text} font-semibold`}>
                {category.progress}% Complete
              </span>
              <span className="text-gray-500">
                {category.videos.length} Videos
              </span>
            </div>
            <ProgressBar progress={category.progress} theme={theme} size="small" showLabel={false} />
          </div>
        </div>
      </div>
    </Link>
  );
}