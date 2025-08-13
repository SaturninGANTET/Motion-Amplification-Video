import React from 'react';

const DisplayVideo = ({ selectedVideo }:any) => {
  const videoUrl = selectedVideo ? URL.createObjectURL(selectedVideo) : undefined;
  return (
    <div className="p-4 bg-gray-200 h-5/6 flex items-center justify-center">
      {selectedVideo ? (
        <video
          controls
          src={videoUrl}
          className="max-w-full max-h-full"
        ></video>
      ) : (
        <p>No video selected</p>
      )}
    </div>
  );
};

export default DisplayVideo;
