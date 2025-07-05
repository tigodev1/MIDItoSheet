import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CreditsData {
  app: {
    name: string;
    version: string;
    description: string;
  };
  credits: {
    author: string;
    contributors: string[];
    libraries: string[];
    version: string;
    license: string;
    repository: string;
  };
}

export default function Credits() {
  const [creditsData, setCreditsData] = useState<CreditsData | null>(null);

  useEffect(() => {
    // Load config from server
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setCreditsData(data))
      .catch(err => console.error('Failed to load credits:', err));
  }, []);

  if (!creditsData) {
    return (
      <div className="space-y-6">
        <div className="spotify-card p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded w-3/4"></div>
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
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold">About {creditsData.app.name}</h3>
            <p className="text-spotify-gray text-sm">Version {creditsData.credits.version}</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* App Info */}
          <div className="p-4 bg-black/20 rounded-lg">
            <h4 className="font-medium text-spotify-green mb-2">Application</h4>
            <p className="text-sm text-spotify-gray mb-3">{creditsData.app.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-spotify-gray">Version:</span>
                <span className="ml-2 font-mono">{creditsData.credits.version}</span>
              </div>
              <div>
                <span className="text-spotify-gray">License:</span>
                <span className="ml-2">{creditsData.credits.license}</span>
              </div>
            </div>
          </div>

          {/* Author & Contributors */}
          <div className="p-4 bg-black/20 rounded-lg">
            <h4 className="font-medium text-spotify-green mb-3">Contributors</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{creditsData.credits.author}</p>
                  <p className="text-xs text-spotify-gray">Lead Developer</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Special Thanks</h5>
                <div className="space-y-1">
                  {creditsData.credits.contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-spotify-green rounded-full"></div>
                      <span className="text-sm text-spotify-gray">{contributor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="p-4 bg-black/20 rounded-lg">
            <h4 className="font-medium text-spotify-green mb-3">Technology Stack</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {creditsData.credits.libraries.map((library, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-black/30 rounded-lg">
                  <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span className="text-sm">{library}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.open(creditsData.credits.repository, '_blank')}
              className="flex-1 spotify-button"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Source Code
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 hover:border-spotify-green text-spotify-gray hover:text-spotify-white"
              onClick={() => window.open(`mailto:support@midistudio.app?subject=${encodeURIComponent('MIDI Studio Feedback')}`, '_blank')}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Send Feedback
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-xs text-spotify-gray">
              Made with ❤️ for musicians and creators worldwide
            </p>
            <p className="text-xs text-spotify-gray mt-1">
              © 2025 MIDI Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Credits() {
  return (
    <div className="space-y-6">
      <Card className="spotify-card">
        <CardHeader>
          <CardTitle>Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Author</h3>
              <p className="text-spotify-gray">Tigo</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Libraries Used</h3>
              <ul className="text-spotify-gray space-y-1">
                <li>• React & TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Radix UI Components</li>
                <li>• TanStack Query</li>
                <li>• Express.js</li>
                <li>• YouTube Data API v3</li>
                <li>• ytdl-core</li>
                <li>• FFmpeg</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Version</h3>
              <p className="text-spotify-gray">1.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
