import { useState, useEffect } from 'react';

const VideoPreview = ({ selectedVideo, setSelectedVideo,refreshKey } : any) => {
  const [videos, setVideos] = useState([]);
  const handleVideoClick = (video:File) => {
    setSelectedVideo(video); // Update the selected video
  };

  const fetchMyVideos = async()=>{
    await fetch('/api/videos',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async(res)=>{
      let response = await res.json()
      console.log(response)
      setVideos(response)
    })
  }

  useEffect(()=>{
    fetchMyVideos()
  },[refreshKey])


  return (
    <div className="h-4/6 mt-4 rounded-md bg-gray-200 overflow-y-auto">
      <div className="grid gap-4 grid-cols-1 p-4">
        {videos.length >0 && videos.map((video:any, index) => (
          <div
            key={index}
            className={`p-2 bg-white rounded-md shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${
              video === selectedVideo ? 'border border-blue-500' : ''
            }`}
            onClick={() => handleVideoClick(video)}
          >
              <video>
                <source
                  src={`/api/videos/${video.filename}`}
                />
              </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPreview;
