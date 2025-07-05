import { conversionJobs, audioFiles, userSessions, type ConversionJob, type InsertConversionJob, type AudioFile, type InsertAudioFile, type UserSession, type InsertUserSession } from "@shared/schema";

export interface IStorage {
  // Conversion Jobs
  createConversionJob(job: InsertConversionJob): Promise<ConversionJob>;
  getConversionJob(id: number): Promise<ConversionJob | undefined>;
  updateConversionJob(id: number, updates: Partial<ConversionJob>): Promise<ConversionJob | undefined>;
  listConversionJobs(): Promise<ConversionJob[]>;

  // Audio Files
  createAudioFile(file: InsertAudioFile): Promise<AudioFile>;
  getAudioFile(id: number): Promise<AudioFile | undefined>;
  listAudioFiles(): Promise<AudioFile[]>;
  deleteAudioFile(id: number): Promise<boolean>;

  // User Sessions
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSession(sessionId: string): Promise<UserSession | undefined>;
  updateUserSession(sessionId: string, updates: Partial<UserSession>): Promise<UserSession | undefined>;
}

export class MemStorage implements IStorage {
  private conversionJobs: Map<number, ConversionJob>;
  private audioFiles: Map<number, AudioFile>;
  private userSessions: Map<string, UserSession>;
  private currentJobId: number;
  private currentFileId: number;
  private currentSessionId: number;

  constructor() {
    this.conversionJobs = new Map();
    this.audioFiles = new Map();
    this.userSessions = new Map();
    this.currentJobId = 1;
    this.currentFileId = 1;
    this.currentSessionId = 1;
  }

  async createConversionJob(insertJob: InsertConversionJob): Promise<ConversionJob> {
    const id = this.currentJobId++;
    const job: ConversionJob = {
      ...insertJob,
      id,
      status: insertJob.status ?? 'pending',
      progress: insertJob.progress ?? 0,
      sourceUrl: insertJob.sourceUrl ?? null,
      sourceFileName: insertJob.sourceFileName ?? null,
      outputFileName: insertJob.outputFileName ?? null,
      settings: insertJob.settings ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversionJobs.set(id, job);
    return job;
  }

  async getConversionJob(id: number): Promise<ConversionJob | undefined> {
    return this.conversionJobs.get(id);
  }

  async updateConversionJob(id: number, updates: Partial<ConversionJob>): Promise<ConversionJob | undefined> {
    const job = this.conversionJobs.get(id);
    if (!job) return undefined;

    const updatedJob = { ...job, ...updates, updatedAt: new Date() };
    this.conversionJobs.set(id, updatedJob);
    return updatedJob;
  }

  async listConversionJobs(): Promise<ConversionJob[]> {
    return Array.from(this.conversionJobs.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createAudioFile(insertFile: InsertAudioFile): Promise<AudioFile> {
    const id = this.currentFileId++;
    const file: AudioFile = {
      ...insertFile,
      id,
      duration: insertFile.duration ?? null,
      metadata: insertFile.metadata ?? null,
      createdAt: new Date(),
    };
    this.audioFiles.set(id, file);
    return file;
  }

  async getAudioFile(id: number): Promise<AudioFile | undefined> {
    return this.audioFiles.get(id);
  }

  async listAudioFiles(): Promise<AudioFile[]> {
    return Array.from(this.audioFiles.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async deleteAudioFile(id: number): Promise<boolean> {
    return this.audioFiles.delete(id);
  }

  async createUserSession(insertSession: InsertUserSession): Promise<UserSession> {
    const id = this.currentSessionId++;
    const session: UserSession = {
      ...insertSession,
      id,
      lastActivity: insertSession.lastActivity ?? new Date(),
      preferences: insertSession.preferences ?? null,
    };
    this.userSessions.set(insertSession.sessionId, session);
    return session;
  }

  async getUserSession(sessionId: string): Promise<UserSession | undefined> {
    return this.userSessions.get(sessionId);
  }

  async updateUserSession(sessionId: string, updates: Partial<UserSession>): Promise<UserSession | undefined> {
    const session = this.userSessions.get(sessionId);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.userSessions.set(sessionId, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();