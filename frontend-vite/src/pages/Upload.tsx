import React, { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Dropzone from '../components/Dropzone';
import VideoPreview from '../components/VideoPreview';
import DisplayVideo from '../components/DisplayVideo';
import Navbar from '../components/Navbar';
import axios from 'axios';

function Upload() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreviewKey, setVideoPreviewKey] = useState(0);

  // Handles video file drop and validation
  const onDrop = useCallback(async (acceptedFiles: any) => {
    const acceptedVideos = acceptedFiles.filter((file: any) =>
      file.name.match(/\.(mp4|avi|mov|mkv|flv|wmv|webm)$/i)
    );

    if (acceptedVideos.length > 0) {
      const videoFile = acceptedVideos[0];
      setSelectedVideo(videoFile); // Set the selected video
    }
  }, []);

  // Upload video to the server
  const handleUpload = async () => {
    if (selectedVideo) {
      setLoading(true);

      // Create FormData object to send video file
      const formData = new FormData();
      formData.append('video', selectedVideo);
      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if needed
          },
        });

        // Assuming server response contains video URL or metadata
        if (response.data) {
          console.log('Video uploaded successfully:', response.data);
          navigate('/input', {
            state: {
              selectedVideo: selectedVideo,
            },
          });
        }
      } catch (error) {
        console.error('Upload Error:', error);
        alert('There was an error uploading the video.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <div className="w-1/4 p-4 h-screen">
          <Dropzone onDrop={onDrop} loading={loading} />
          <VideoPreview
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
            refreshKey={videoPreviewKey}
          />
          {selectedVideo && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4 block"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload and Go to Input'}
            </button>
          )}
        </div>
        <div className="w-3/4 p-4 h-screen">
          <DisplayVideo selectedVideo={selectedVideo} />
        </div>
      </div>
    </div>
  );
}

export default Upload;
