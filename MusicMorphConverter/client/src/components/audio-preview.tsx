import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/use-audio-player";

export default function AudioPreview() {
  const { isPlaying, currentTrack, togglePlay } = useAudioPlayer();

  const { data: audioFiles, isLoading } = useQuery({
    queryKey: ['/api/audio-files'],
  });

  const handlePlay = (fileId: number) => {
    togglePlay(fileId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="spotify-card p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="spotify-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Audio Preview Library</h3>
              <p className="text-spotify-gray text-sm">Listen to your converted files</p>
            </div>
          </div>
          <Button className="spotify-button">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add File
          </Button>
        </div>

        <div className="space-y-3">
          {audioFiles && audioFiles.length > 0 ? (
            audioFiles.map((file: any) => (
              <div key={file.id} className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-all duration-200">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  file.fileType === 'midi' ? 'bg-gradient-to-br from-green-600 to-green-700' :
                  file.fileType === 'sheet' ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
                  'bg-gradient-to-br from-blue-600 to-blue-700'
                }`}>
                  {file.fileType === 'midi' ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  ) : file.fileType === 'sheet' ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{file.originalName}</h4>
                  <p className="text-sm text-spotify-gray">
                    {(file.fileSize / 1024).toFixed(1)} KB • {file.fileType.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handlePlay(file.id)}
                    className="w-10 h-10 bg-spotify-green hover:bg-green-600 rounded-full p-0"
                  >
                    {currentTrack === file.id && isPlaying ? (
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
                      <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/>
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-spotify-hover rounded-full"
                  >
                    <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                    </svg>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-spotify-gray mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <h4 className="text-xl font-semibold mb-2">No audio files yet</h4>
              <p className="text-spotify-gray">Convert some YouTube videos or upload MIDI files to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
