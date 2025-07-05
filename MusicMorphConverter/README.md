# MIDI Studio - YouTube to MIDI Converter

A Spotify-inspired web application that converts YouTube videos to MIDI files and generates beautiful sheet music. Built with React, TypeScript, and Express.js.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- FFmpeg installed on your system
- YouTube Data API v3 key (optional, for enhanced search)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Install FFmpeg:**

**Windows:**
- Download from https://ffmpeg.org/download.html
- Add to PATH environment variable

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt update
sudo apt install ffmpeg
```

3. **Configure the application:**

Edit `config.json` to customize settings:

```json
{
  "app": {
    "name": "MIDI Studio",
    "version": "1.0.0"
  },
  "youtube": {
    "apiKey": "YOUR_YOUTUBE_API_KEY_HERE",
    "maxResults": 25
  },
  "conversion": {
    "youtubeMidiDefaults": {
      "quality": "high",
      "format": "standard"
    }
  },
  "features": {
    "youtubeSearch": true,
    "realtimeProgress": true
  }
}
```

4. **Start the application:**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔑 API Keys Setup

### YouTube Data API v3 (Optional but Recommended)

The YouTube search feature works without an API key but is rate-limited. For full functionality:

1. **Go to Google Cloud Console:**
   - Visit https://console.cloud.google.com/

2. **Create a new project or select existing:**
   - Click "Select a project" → "New Project"
   - Name it "MIDI Studio" or your preferred name

3. **Enable YouTube Data API v3:**
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

4. **Create API credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

5. **Configure the key:**
   - Add the key to `config.json` under `youtube.apiKey`
   - OR set environment variable: `YOUTUBE_API_KEY=your_key_here`

6. **Restrict the API key (recommended):**
   - In Google Cloud Console, click on your API key
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Save the changes

### Alternative: YouTube Search without API Key

The app includes a fallback search using `youtube-sr` library that works without API keys but has limitations:
- Slower search results
- Fewer details per video
- Potential rate limiting

## 🎵 How to Use

### Converting YouTube Videos to MIDI

1. **Navigate to "YouTube to MIDI" tab**

2. **Search for videos:**
   - Type in the search box (e.g., "piano music")
   - Select a video from results
   - OR paste a YouTube URL directly

3. **Configure conversion settings:**
   - Quality: High/Medium/Low
   - Format: Standard MIDI/Multi-track/Piano Roll

4. **Start conversion:**
   - Click "Convert to MIDI"
   - Watch real-time progress
   - Download when complete

### Converting MIDI to Sheet Music

1. **Navigate to "MIDI to Sheet" tab**

2. **Upload MIDI file:**
   - Drag and drop .mid/.midi files
   - OR click to browse files

3. **Configure sheet music settings:**
   - Clef: Treble/Bass/Alto
   - Key Signature: C Major, G Major, etc.
   - Time Signature: 4/4, 3/4, etc.

4. **Generate sheet music:**
   - Click "Convert" on uploaded file
   - Download PDF when ready

## 🛠️ Technical Details

### File Processing Pipeline

1. **YouTube Download:**
   - Uses `ytdl-core` to download audio
   - Extracts highest quality audio stream
   - Converts to WAV using FFmpeg

2. **MIDI Conversion:**
   - Audio analysis for note detection
   - Converts to standard MIDI format
   - Applies user-selected quality settings

3. **Sheet Music Generation:**
   - Parses MIDI note data
   - Applies musical notation rules
   - Generates PDF with music notation

### Supported Formats

**Input:**
- YouTube URLs (any format)
- MIDI files (.mid, .midi)
- Audio files (MP3, WAV, FLAC)

**Output:**
- MIDI files (.mid)
- Sheet music (PDF)
- Audio previews (WAV)

## 📱 Mobile Responsiveness

The application automatically adapts to different screen sizes and orientations:

- **Portrait mode:** Bottom navigation tabs
- **Landscape mode:** Compact sidebar
- **Mobile:** Slide-out sidebar with overlay
- **Tablet:** Adaptive layout based on screen size

## 🎨 Customization

### Themes and Colors

Edit CSS variables in `client/src/index.css`:

```css
:root {
  --spotify-green: hsl(141, 76%, 48%);
  --spotify-black: hsl(0, 0%, 7%);
  --spotify-dark: hsl(0, 0%, 9%);
}
```

### Configuration Options

Modify `config.json` for:
- App branding and metadata
- Default conversion settings
- Feature toggles
- API limits and timeouts

## 🚨 Troubleshooting

### Common Issues

**1. "FFmpeg not found" error:**
```bash
# Verify FFmpeg installation
ffmpeg -version

# If not found, install it:
# Windows: Download from ffmpeg.org
# macOS: brew install ffmpeg
# Linux: sudo apt install ffmpeg
```

**2. YouTube download fails:**
- Check internet connection
- Verify YouTube URL is valid
- Some videos may be region-blocked

**3. File upload not working:**
- Check file is .mid or .midi format
- Ensure file size under 50MB
- Verify uploads directory has write permissions

**4. Search not working:**
- Add YouTube API key to config.json
- Check API key restrictions in Google Cloud Console
- Verify API quotas aren't exceeded

### Performance Tips

**For better conversion speed:**
- Use SSD storage for uploads directory
- Ensure adequate RAM (4GB+ recommended)
- Close other applications during conversion

**For mobile devices:**
- Use WiFi for large video downloads
- Convert shorter videos (under 10 minutes)
- Clear browser cache if app feels slow

## 🔧 Development

### Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   └── hooks/       # Custom React hooks
├── server/          # Express backend
│   ├── routes.ts    # API endpoints
│   └── storage.ts   # Data management
├── shared/          # Shared types
└── config.json     # Application configuration
```

### Adding New Features

1. **Update data models** in `shared/schema.ts`
2. **Add API endpoints** in `server/routes.ts`
3. **Create UI components** in `client/src/components/`
4. **Update configuration** in `config.json`

### Environment Variables

Optional environment variables:
```bash
YOUTUBE_API_KEY=your_youtube_api_key
NODE_ENV=development
PORT=5000
```

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙋‍♂️ Support

For issues or questions:
1. Check this README for common solutions
2. Verify all dependencies are installed correctly
3. Test with a simple YouTube video first
4. Check browser console for error messages

The application should work without any API keys for basic functionality, with enhanced features available when properly configured.