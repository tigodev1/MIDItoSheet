import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Play, Download, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SearchResult {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  url: string;
  views: number;
  publishedAt: string;
  description: string;
}

interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  author: string;
  views: string;
  description: string;
}

export default function YouTubeConverter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<SearchResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const queryClient = useQueryClient();

  // Search videos
  const { data: searchResults, isLoading: isSearching, refetch: searchVideos } = useQuery({
    queryKey: ["youtube-search", searchQuery],
    queryFn: () => apiRequest(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}&limit=10`),
    enabled: false
  });

  // Get video info
  const { data: videoInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: ["youtube-info", selectedVideo?.url],
    queryFn: () => apiRequest(`/api/youtube/info?url=${encodeURIComponent(selectedVideo?.url || "")}`),
    enabled: !!selectedVideo?.url
  });

  // Convert to MIDI mutation
  const convertMutation = useMutation({
    mutationFn: ({ url, settings }: { url: string; settings: any }) =>
      apiRequest("/api/convert/youtube-to-midi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, settings }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversion-jobs"] });
      setIsConverting(false);
    },
    onError: () => {
      setIsConverting(false);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchVideos();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };

  const handleConvert = () => {
    if (selectedVideo) {
      setIsConverting(true);
      convertMutation.mutate({
        url: selectedVideo.url,
        settings: {
          quality: "high",
          format: "standard"
        }
      });
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatDuration = (duration: string) => {
    return duration || "0:00";
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="spotify-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube to MIDI Converter</span>
          </CardTitle>
          <CardDescription>
            Search for YouTube videos and convert them to MIDI files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search YouTube videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && searchResults.length > 0 && (
        <Card className="spotify-card">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((video: SearchResult) => (
                <div
                  key={video.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedVideo?.id === video.id
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-700 hover:border-gray-600 bg-black/20"
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="flex space-x-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{video.title}</h3>
                      <p className="text-spotify-gray text-sm mt-1">{video.channel}</p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-spotify-gray">
                        <span>{formatViews(video.views)}</span>
                        <span>•</span>
                        <span>{formatDuration(video.duration)}</span>
                        <span>•</span>
                        <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(video.url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Watch
                        </Button>
                        {selectedVideo?.id === video.id && (
                          <Badge className="bg-green-500 text-white">Selected</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Video Info */}
      {selectedVideo && (
        <Card className="spotify-card">
          <CardHeader>
            <CardTitle>Selected Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-48 h-36 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
                <p className="text-spotify-gray mb-2">by {selectedVideo.channel}</p>
                <div className="space-y-1 text-sm text-spotify-gray mb-4">
                  <p>Duration: {formatDuration(selectedVideo.duration)}</p>
                  <p>Views: {formatViews(selectedVideo.views)}</p>
                  <p>Published: {new Date(selectedVideo.publishedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleConvert}
                    disabled={isConverting || convertMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isConverting || convertMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Convert to MIDI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {selectedVideo.description && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-spotify-gray text-sm line-clamp-3">
                  {selectedVideo.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conversion Status */}
      {convertMutation.isError && (
        <Card className="spotify-card border-red-500">
          <CardContent className="pt-6">
            <div className="text-red-400">
              <p className="font-semibold">Conversion Failed</p>
              <p className="text-sm">Please try again or check if the video is available.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {convertMutation.isSuccess && (
        <Card className="spotify-card border-green-500">
          <CardContent className="pt-6">
            <div className="text-green-400">
              <p className="font-semibold">Conversion Started!</p>
              <p className="text-sm">Your MIDI file will be ready shortly. Check the audio preview section to see the progress.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}