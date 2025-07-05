import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TopNavigationProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export default function TopNavigation({ onMenuClick, showMenu = false }: TopNavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 spotify-header flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        {showMenu && (
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 p-0"
          >
            <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </Button>
        )}
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 p-0"
          >
            <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 p-0"
          >
            <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search for YouTube videos, MIDI files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-96 pl-10 pr-4 py-2 spotify-input"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-spotify-hover rounded-full"
        >
          <svg className="w-4 h-4 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </Button>
        <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-spotify-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
