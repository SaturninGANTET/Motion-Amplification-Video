import { useState, useEffect } from 'react';

const VideoPreview = ({ selectedVideo, setSelectedVideo,refreshKey } : any) => {
  const [videos, setVideos] = useState([]);
  const handleVideoClick = (video:any) => {
    setSelectedVideo(video); // Update the selected video
  };

  const fetchMyVideos = async()=>{
    await fetch('/api/videos',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: localStorage.getItem('email')
      })
    }).then(async(res)=>{
      let response = await res.json()
      console.log(response.videos)
       setVideos(response.videos)
    })
  }

  useEffect(()=>{
    fetchMyVideos()
  },[refreshKey])


  return (
    <div className="h-4/6 mt-4 rounded-md bg-gray-200 overflow-y-auto">
      <div className="grid gap-4 grid-cols-1 p-4">
        {videos.length >0 && videos.map((video, index) => (
          <div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPreview;
