import React, { useState } from 'react';
import { Play, BookOpen, Shield, Factory, Award, FlaskConical, FileCheck, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Video {
  title: string;
  duration: string;
  standards: string[];
  thumbnail: string;
}

interface Category {
  title: string;
  icon: React.FC<any>;
  description: string;
  videos: Video[];
}

const LearningHub = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories: Category[] = [
    {
      title: 'Construction Standards',
      icon: Shield,
      description: 'Learn about essential safety protocols and standards',
      videos: [
        { title: 'Story 1 - Construction Safety', duration: '5:30', standards: ['IS 12345', 'IS 67890'], thumbnail: './learningHub/final stream new/final-stream/src/asserts/cons1.jpg' }
      ]
    },
    {
      title: 'Food Standards',
      icon: Factory,
      description: 'Master food safety protocols and standards',
      videos: [
        { title: 'Story 1 - Food Safety', duration: '6:15', standards: ['IS 98765'], thumbnail: './learningHub/final stream new/final-stream/src/asserts/food1.jpg' }
      ]
    },
    {
      title: 'Textile Standards',
      icon: Award,
      description: 'Understanding textile standards and regulations',
      videos: [
        { title: 'Story 1 - Textile Standards', duration: '7:30', standards: ['IS 87654'], thumbnail: './learningHub/final stream new/final-stream/src/asserts/tech1.jpg' }
      ]
    },
    {
      title: 'Transportation Standards',
      icon: FlaskConical,
      description: 'Learn various transportation standards and regulations',
      videos: [
        { title: 'Story 1 - Transportation Standards', duration: '8:15', standards: ['IS 54321'], thumbnail: './learningHub/final stream new/final-stream/src/asserts/trans1.jpg' }
      ]
    }
  ];

  const handleVideoClick = (videoTitle: string) => {
    const videoPathMap: { [key: string]: string } = {
      'Story 1 - Construction Safety': '/learningHub/final stream new/final-stream/src/asserts/category1/construction1.mp4',
      'Story 1 - Food Safety': '/learningHub/final stream new/final-stream/src/asserts/category2/food1.mp4',
      'Story 1 - Textile Standards': '/learningHub/final stream new/final-stream/src/asserts/category4/textile1.mp4',
      'Story 1 - Transportation Standards': '/learningHub/final stream new/final-stream/src/asserts/category5/transport1.mp4'
    };

    const videoPath = videoPathMap[videoTitle];
    if (videoPath) {
      window.open(videoPath, '_blank');
    } else {
      alert('Video not found');
    }
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    videos: category.videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.standards.some(standard => standard.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => category.videos.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-rose-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-blue-600" />
              Learning Hub
            </h1>
            <p className="mt-2 text-gray-600">Enhance your knowledge with our comprehensive learning resources</p>
          </div>
          <Link 
  to="http://localhost:5174/"
  target="_blank"
  rel="noopener noreferrer"
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
>
  View More
  <ArrowRight className="w-4 h-4" />
</Link>

        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos or standards..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <category.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Show only the first video */}
                  {category.videos.length > 0 && (
                    <div
                      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                      onClick={() => handleVideoClick(category.videos[0].title)}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={category.videos[0].thumbnail || '/default-video.jpg'}
                          alt={category.videos[0].title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = '/default-video.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {category.videos[0].title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500">{category.videos[0].duration}</span>
                          <div className="flex items-center gap-1">
                            <FileCheck className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-500">
                              {category.videos[0].standards.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningHub;
