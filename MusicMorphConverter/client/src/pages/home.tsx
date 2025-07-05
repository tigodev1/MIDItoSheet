import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import YouTubeConverter from "@/components/youtube-converter";
import MidiConverter from "@/components/midi-converter";
import NowPlaying from "@/components/now-playing";
import { useMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/sidebar";
import TopNavigation from "@/components/top-navigation";
import AudioPreview from "@/components/audio-preview";
import Settings from "@/components/settings";
import Credits from "@/components/credits";

type ActiveTab = 'home' | 'youtube' | 'midi' | 'preview' | 'settings' | 'credits';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'youtube':
        return <YouTubeConverter />;
      case 'midi':
        return <MidiConverter />;
      case 'preview':
        return <AudioPreview />;
      case 'settings':
        return <Settings />;
      case 'credits':
        return <Credits />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="p-8 bg-gradient-to-br from-green-600 to-green-700 rounded-xl border border-white/10 backdrop-filter backdrop-blur-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome to MIDI Studio</h2>
                  <p className="text-white/90">Transform your favorite YouTube videos into MIDI files and generate beautiful sheet music</p>
                </div>
                <div className="hidden md:block">
                  <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="spotify-card p-6 cursor-pointer" onClick={() => setActiveTab('youtube')}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">YouTube to MIDI</h3>
                    <p className="text-spotify-gray text-sm">Convert YouTube videos to MIDI</p>
                  </div>
                </div>
              </div>

              <div className="spotify-card p-6 cursor-pointer" onClick={() => setActiveTab('midi')}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">MIDI to Sheet Music</h3>
                    <p className="text-spotify-gray text-sm">Generate sheet music from MIDI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="spotify-card p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3 bg-black/20 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">No recent conversions</p>
                    <p className="text-sm text-spotify-gray">Start converting to see your activity here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-spotify-black text-spotify-white">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${isMobile ? 'spotify-sidebar' : 'w-60 spotify-sidebar'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab as ActiveTab);
            if (isMobile) setSidebarOpen(false);
          }} 
        />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isMobile ? 'spotify-main-mobile' : ''}`}>
        <TopNavigation 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenu={isMobile}
        />

        <main className={`flex-1 overflow-y-auto scrollbar-thin p-6 ${isMobile ? 'main-content-mobile' : ''}`}>
          {renderContent()}
        </main>
      </div>

      <NowPlaying />
    </div>
  );
}