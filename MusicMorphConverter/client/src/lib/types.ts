export interface ConversionJob {
  id: number;
  type: 'youtube-to-midi' | 'midi-to-sheet';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sourceUrl?: string;
  sourceFileName?: string;
  outputFileName?: string;
  progress: number;
  settings?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioFile {
  id: number;
  fileName: string;
  originalName: string;
  fileType: 'midi' | 'mp3' | 'wav' | 'sheet';
  fileSize: number;
  duration?: number;
  metadata?: string;
  createdAt: Date;
}

export interface YouTubeConversionSettings {
  quality: 'high' | 'medium' | 'low';
  format: 'standard' | 'multitrack' | 'pianoroll';
}

export interface SheetMusicSettings {
  clef: 'treble' | 'bass' | 'alto';
  keySignature: string;
  timeSignature: string;
}
