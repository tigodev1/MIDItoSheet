import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

export default function NowPlaying() {
  const [currentTime, setCurrentTime] = useState(154); // 2:34 in seconds
  const [duration, setDuration] = useState(355); // 5:55 in seconds
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: jobs } = useQuery({
    queryKey: ['/api/conversion-jobs'],
    refetchInterval: 2000,
  });

  const activeJob = jobs?.find((job: any) => job.status === 'processing');

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => prev < duration ? prev + 1 : prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 spotify-header flex items-center px-4 space-x-4 z-50">
      <div className="flex items-center space-x-3 w-80">
        <div className="w-12 h-12 bg-gradient-to-br from-spotify-green to-green-700 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div>
          <p className="font-medium text-sm">
            {activeJob ? `Converting: ${activeJob.sourceUrl || 'MIDI File'}` : 'No active conversion'}
          </p>
          <p className="text-xs text-spotify-gray">
            {activeJob ? `${activeJob.type === 'youtube-to-midi' ? 'YouTube to MIDI' : 'MIDI to Sheet'}` : 'Ready to convert'}
          </p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-spotify-hover rounded-full"
        >
          <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </Button>
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          size="sm"
          className="w-10 h-10 bg-spotify-green hover:bg-green-600 rounded-full p-0"
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-spotify-hover rounded-full"
        >
          <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 w-80 justify-end">
        <span className="text-xs text-spotify-gray font-mono">{formatTime(currentTime)}</span>
        <div className="w-32 relative">
          <Progress value={progress} className="bg-gray-700 h-1" />
        </div>
        <span className="text-xs text-spotify-gray font-mono">{formatTime(duration)}</span>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-spotify-hover rounded-full"
        >
          <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}
