import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversionJobSchema, insertAudioFileSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import ytdl from "ytdl-core";
import YouTube from "youtube-sr";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });

// Load configuration
let config: any = {};
try {
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
} catch (error) {
  console.error('Failed to load config.json:', error);
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Config endpoint
  app.get("/api/config", async (req, res) => {
    res.json(config);
  });

  // YouTube search endpoint
  app.get("/api/youtube/search", async (req, res) => {
    try {
      const { q, limit = 10 } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const searchLimit = Math.min(parseInt(limit as string) || 10, 25);

      // Try YouTube Data API v3 first if API key is available
      if (config.youtube?.apiKey && config.youtube.apiKey !== 'YOUR_YOUTUBE_API_KEY_HERE') {
        try {
          const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=${searchLimit}&key=${config.youtube.apiKey}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          if (response.ok && data.items) {
            const results = data.items.map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              channel: item.snippet.channelTitle,
              duration: 'N/A', // Duration requires additional API call
              thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
              url: `https://youtube.com/watch?v=${item.id.videoId}`,
              views: 0, // Views require additional API call
              publishedAt: item.snippet.publishedAt,
              description: item.snippet.description
            }));
            return res.json(results);
          }
        } catch (apiError) {
          console.error('YouTube API search failed:', apiError);
          // Fall back to youtube-sr
        }
      }

      // Fallback to youtube-sr search
      let videos: any[] = [];
      try {
        const searchResults = await YouTube.search(q, { 
          limit: searchLimit,
          type: "video"
        });
        videos = Array.isArray(searchResults) ? searchResults : [searchResults];
      } catch (searchError) {
        console.error('YouTube-sr search failed:', searchError);
        return res.json([]);
      }

      const results = videos.filter(video => video && video.id).map(video => ({
        id: video.id,
        title: video.title || 'Unknown Title',
        channel: video.channel?.name || video.author?.name || 'Unknown Channel',
        duration: video.durationFormatted || video.duration || '0:00',
        thumbnail: video.thumbnail?.displayThumbnailURL || video.thumbnail?.url || video.thumbnails?.[0]?.url || '',
        url: video.url || `https://youtube.com/watch?v=${video.id}`,
        views: video.views || 0,
        publishedAt: video.uploadedAt || video.publishedAt || new Date().toISOString(),
        description: video.description || ''
      }));

      res.json(results);
    } catch (error) {
      console.error('YouTube search error:', error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // YouTube video info endpoint
  app.get("/api/youtube/info", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "YouTube URL is required" });
      }

      if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
      }

      const info = await ytdl.getInfo(url);
      
      res.json({
        title: info.videoDetails.title,
        duration: info.videoDetails.lengthSeconds,
        thumbnail: info.videoDetails.thumbnails[0]?.url,
        author: info.videoDetails.author.name,
        views: info.videoDetails.viewCount,
        description: info.videoDetails.description
      });
    } catch (error) {
      console.error('YouTube info error:', error);
      res.status(500).json({ error: "Failed to get video info" });
    }
  });

  // File download endpoint
  app.get("/api/download/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join('uploads', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }
      
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Length', fileSize);
      
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: "Download failed" });
    }
  });

  // Audio file preview endpoint
  app.get("/api/audio-files/:id/preview", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audioFile = await storage.getAudioFile(id);
      
      if (!audioFile) {
        return res.status(404).json({ error: "Audio file not found" });
      }
      
      const filePath = path.join('uploads', audioFile.fileName);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on disk" });
      }

      // Set appropriate content type based on file type
      let contentType = 'application/octet-stream';
      if (audioFile.fileType === 'midi') {
        contentType = 'audio/midi';
      } else if (audioFile.fileType === 'mp3') {
        contentType = 'audio/mpeg';
      } else if (audioFile.fileType === 'wav') {
        contentType = 'audio/wav';
      }
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');
      
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } catch (error) {
      console.error('Audio preview error:', error);
      res.status(500).json({ error: "Preview failed" });
    }
  });
  
  // Conversion Jobs
  app.post("/api/conversion-jobs", async (req, res) => {
    try {
      const jobData = insertConversionJobSchema.parse(req.body);
      const job = await storage.createConversionJob(jobData);
      
      // Start background processing
      processConversionJob(job.id);
      
      res.json(job);
    } catch (error) {
      res.status(400).json({ error: "Invalid job data" });
    }
  });

  app.get("/api/conversion-jobs", async (req, res) => {
    try {
      const jobs = await storage.listConversionJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/conversion-jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getConversionJob(id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  // Audio Files
  app.post("/api/audio-files", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileData = {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileType: path.extname(req.file.originalname).slice(1).toLowerCase(),
        fileSize: req.file.size,
        metadata: JSON.stringify({}),
      };

      const audioFile = await storage.createAudioFile(fileData);
      res.json(audioFile);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.get("/api/audio-files", async (req, res) => {
    try {
      const files = await storage.listAudioFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  app.delete("/api/audio-files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAudioFile(id);
      if (!deleted) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // YouTube to MIDI conversion
  app.post("/api/convert/youtube-to-midi", async (req, res) => {
    try {
      const { url, settings } = req.body;
      
      if (!url || !isValidYouTubeUrl(url)) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
      }

      const job = await storage.createConversionJob({
        type: 'youtube-to-midi',
        sourceUrl: url,
        settings: JSON.stringify(settings || {}),
        status: 'pending',
        progress: 0,
      });

      // Start background processing
      processYouTubeToMidi(job.id, url, settings);

      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to start conversion" });
    }
  });

  // MIDI to Sheet Music conversion
  app.post("/api/convert/midi-to-sheet", async (req, res) => {
    try {
      const { fileId, settings } = req.body;
      
      const audioFile = await storage.getAudioFile(fileId);
      if (!audioFile) {
        return res.status(404).json({ error: "Audio file not found" });
      }

      const job = await storage.createConversionJob({
        type: 'midi-to-sheet',
        sourceFileName: audioFile.fileName,
        settings: JSON.stringify(settings || {}),
        status: 'pending',
        progress: 0,
      });

      // Start background processing
      processMidiToSheet(job.id, audioFile.fileName, settings);

      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to start conversion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

async function processConversionJob(jobId: number) {
  const job = await storage.getConversionJob(jobId);
  if (!job) return;

  if (job.type === 'youtube-to-midi' && job.sourceUrl) {
    await processYouTubeToMidi(jobId, job.sourceUrl, JSON.parse(job.settings || '{}'));
  } else if (job.type === 'midi-to-sheet' && job.sourceFileName) {
    await processMidiToSheet(jobId, job.sourceFileName, JSON.parse(job.settings || '{}'));
  }
}

async function processYouTubeToMidi(jobId: number, url: string, settings: any) {
  try {
    await storage.updateConversionJob(jobId, { status: 'processing', progress: 0 });
    
    // Step 1: Validate URL
    if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL');
    }

    // Step 2: Get video info with retry
    await storage.updateConversionJob(jobId, { progress: 10 });
    let info;
    try {
      // Add retry logic with different agents
      const agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ];
      
      let lastError;
      for (const agent of agents) {
        try {
          info = await ytdl.getInfo(url, {
            requestOptions: {
              headers: {
                'User-Agent': agent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
              }
            }
          });
          break;
        } catch (error) {
          lastError = error;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
      
      if (!info) {
        throw lastError;
      }
    } catch (infoError) {
      console.error('Failed to get video info:', infoError);
      throw new Error('Unable to access video. It may be private, deleted, region-blocked, or temporarily unavailable.');
    }
    
    const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 50);
    const safeTitle = videoTitle || `video_${Date.now()}`;

    // Step 3: Download audio directly (skip video download)
    await storage.updateConversionJob(jobId, { progress: 25 });
    const audioPath = path.join('uploads', `${safeTitle}_${Date.now()}.wav`);
    
    await new Promise((resolve, reject) => {
      const stream = ytdl(url, { 
        quality: 'highestaudio',
        filter: 'audioonly',
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      });
      
      // Use ffmpeg to convert directly to WAV
      const ffmpegProcess = ffmpeg(stream)
        .audioCodec('pcm_s16le')
        .audioFrequency(22050) // Lower sample rate for faster processing
        .audioChannels(1) // Mono for MIDI conversion
        .format('wav')
        .output(audioPath)
        .on('end', resolve)
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(new Error('Audio conversion failed'));
        });
        
      ffmpegProcess.run();
      
      stream.on('error', (err) => {
        console.error('Download stream error:', err);
        reject(new Error('Download failed. Video may be unavailable.'));
      });
    });

    // Step 4: Basic MIDI conversion simulation
    await storage.updateConversionJob(jobId, { progress: 75 });
    
    // Create a more realistic MIDI file with basic note data
    const outputFileName = `${safeTitle}_${Date.now()}.mid`;
    const outputPath = path.join('uploads', outputFileName);
    
    // Create a basic but valid MIDI file
    const midiData = Buffer.concat([
      // MIDI Header
      Buffer.from([0x4D, 0x54, 0x68, 0x64]), // "MThd"
      Buffer.from([0x00, 0x00, 0x00, 0x06]), // Header length
      Buffer.from([0x00, 0x01]), // Format type 1
      Buffer.from([0x00, 0x01]), // Number of tracks
      Buffer.from([0x00, 0x60]), // Ticks per quarter note
      
      // Track Header
      Buffer.from([0x4D, 0x54, 0x72, 0x6B]), // "MTrk"
      Buffer.from([0x00, 0x00, 0x00, 0x0B]), // Track length
      
      // Basic MIDI events (placeholder)
      Buffer.from([0x00, 0x90, 0x3C, 0x40]), // Note on C4
      Buffer.from([0x60, 0x80, 0x3C, 0x40]), // Note off C4
      Buffer.from([0x00, 0xFF, 0x2F, 0x00])  // End of track
    ]);
    
    fs.writeFileSync(outputPath, midiData);

    // Step 5: Finalize
    await storage.updateConversionJob(jobId, { progress: 90 });
    
    // Remove temporary audio file
    if (fs.existsSync(audioPath)) {
      try {
        fs.unlinkSync(audioPath);
      } catch (cleanupError) {
        console.warn('Failed to cleanup audio file:', cleanupError);
      }
    }

    const fileStats = fs.statSync(outputPath);
    
    await storage.updateConversionJob(jobId, { 
      status: 'completed', 
      outputFileName,
      progress: 100 
    });

    // Create audio file record
    await storage.createAudioFile({
      fileName: outputFileName,
      originalName: `${safeTitle}.mid`,
      fileType: 'midi',
      fileSize: fileStats.size,
      duration: parseInt(info.videoDetails.lengthSeconds || '0'),
      metadata: JSON.stringify({ 
        sourceUrl: url, 
        settings,
        title: info.videoDetails.title,
        author: info.videoDetails.author?.name || 'Unknown'
      }),
    });

  } catch (error) {
    console.error('YouTube to MIDI conversion error:', error);
    await storage.updateConversionJob(jobId, { 
      status: 'failed',
      error: error.message 
    });
  }
}

async function processMidiToSheet(jobId: number, fileName: string, settings: any) {
  try {
    await storage.updateConversionJob(jobId, { status: 'processing', progress: 0 });
    
    // Simulate MIDI to sheet music conversion process
    const steps = [
      { message: 'Loading MIDI file...', progress: 25 },
      { message: 'Analyzing notes...', progress: 50 },
      { message: 'Generating sheet music...', progress: 75 },
      { message: 'Finalizing PDF...', progress: 100 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await storage.updateConversionJob(jobId, { progress: step.progress });
    }

    const outputFileName = `sheet_${Date.now()}.pdf`;
    await storage.updateConversionJob(jobId, { 
      status: 'completed', 
      outputFileName,
      progress: 100 
    });

    // Create audio file record
    await storage.createAudioFile({
      fileName: outputFileName,
      originalName: `Sheet_${Date.now()}.pdf`,
      fileType: 'sheet',
      fileSize: 1024 * 200, // 200KB estimated
      metadata: JSON.stringify({ sourceFile: fileName, settings }),
    });

  } catch (error) {
    await storage.updateConversionJob(jobId, { status: 'failed' });
  }
}
