import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'youtube', label: 'YouTube to MIDI', icon: 'youtube' },
    { id: 'midi', label: 'MIDI to Sheet', icon: 'music' },
    { id: 'preview', label: 'Audio Preview', icon: 'headphones' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'credits', label: 'Credits', icon: 'info' },
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      home: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      music: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      ),
      headphones: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      ),
    };
    return icons[iconName as keyof typeof icons];
  };

  return (
    <div className="w-60 spotify-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-spotify-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold">MIDI Studio</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full spotify-nav-item flex items-center space-x-3 text-left",
                activeTab === item.id && "active"
              )}
            >
              {getIcon(item.icon)}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="pt-6 border-t border-gray-800">
          <h3 className="text-sm font-semibold text-spotify-gray mb-3">Recent Projects</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg text-spotify-gray hover:text-spotify-white hover:bg-spotify-hover transition-all duration-200 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <span className="text-sm truncate">No recent projects</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
