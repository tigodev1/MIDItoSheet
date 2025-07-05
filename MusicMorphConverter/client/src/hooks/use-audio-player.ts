import { useState, useRef } from 'react';

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (trackId?: number) => {
    if (trackId && trackId !== currentTrack) {
      // Switch to new track
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentTrack(trackId);
      setIsPlaying(true);

      // Create new audio element for MIDI playback simulation
      const audio = new Audio();
      audio.src = `/api/audio-files/${trackId}/preview`; // This would need backend support
      audioRef.current = audio;

      audio.play().catch(() => {
        // Fallback for unsupported formats
        console.log('Audio playback not supported for this file type');
        setIsPlaying(false);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    } else {
      // Toggle current track
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(() => {
            console.log('Audio playback failed');
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return {
    isPlaying,
    currentTrack,
    togglePlay,
    stop,
  };
}