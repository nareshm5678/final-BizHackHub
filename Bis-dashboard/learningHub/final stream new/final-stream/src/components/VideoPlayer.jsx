import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';

function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    // Find the video and category
    let foundVideo;
    let foundCategory;

    categories.forEach((category) => {
      const video = category.videos.find((v) => v.id === id);
      if (video) {
        foundVideo = video;
        foundCategory = category;
      }
    });

    if (foundVideo && foundCategory) {
      setCurrentVideo(foundVideo);
      setCurrentCategory(foundCategory);
      
      // Fetch progress from server
      fetchProgress(foundCategory.id);
    }
  }, [id]);

  const fetchProgress = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        // Update video completion status based on server data
        if (currentVideo) {
          if (currentVideo.id.startsWith('qms-')) {
            setIsCompleted(data.video1);
            currentVideo.completed = data.video1;
          } else if (currentVideo.id.startsWith('env-')) {
            setIsCompleted(data.video2);
            currentVideo.completed = data.video2;
          } else if (currentVideo.id.startsWith('cert-')) {
            setIsCompleted(data.video3);
            currentVideo.completed = data.video3;
          }
        }
        // Update category progress
        if (currentCategory) {
          currentCategory.progress = data.progress;
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleCompletion = async () => {
    setIsCompleted(true);
    currentVideo.completed = true;

    try {
      const response = await fetch('http://localhost:5000/api/progress/updateProgress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: currentCategory.id.toString(),
          videoId: currentVideo.id,
          completed: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const data = await response.json();
      console.log('Progress updated:', data);

      // Update category progress
      currentCategory.progress = data.progress;

      // Show completion message and redirect after delay
      setTimeout(() => {
        navigate(`/category/${currentCategory.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (!currentVideo) return <div>Video not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-gray-800">
          <video controls className="w-full h-full" src={currentVideo.src} />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{currentVideo.title}</h1>
          <p className="mt-2 text-gray-600">Duration: {currentVideo.duration}</p>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleCompletion}
              disabled={isCompleted}
              className={`px-4 py-2 rounded-md ${
                isCompleted ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCompleted ? 'Completed!' : 'Mark as Complete'}
            </button>

            <div className="text-sm text-gray-500">Part of: {currentCategory?.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
