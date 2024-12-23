import React from 'react';

export function ProgressBar({ progress, theme, showLabel = true, size = "medium" }) {
  const heights = {
    small: "h-2",
    medium: "h-4",
    large: "h-6"
  };

  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`${theme.progress} ${heights[size]} rounded-full transition-all duration-500 relative`}
        style={{ width: `${progress}%` }}
      >
        {showLabel && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
            {progress}%
          </span>
        )}
      </div>
    </div>
  );
}