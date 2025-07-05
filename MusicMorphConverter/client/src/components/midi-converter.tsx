import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useFileUpload } from "@/hooks/use-file-upload";

interface SheetSettings {
  clef: string;
  keySignature: string;
  timeSignature: string;
}

export default function MidiConverter() {
  const [settings, setSettings] = useState<SheetSettings>({
    clef: "treble",
    keySignature: "C",
    timeSignature: "4/4",
  });
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const { toast } = useToast();
  const { files, uploadFile, removeFile, isUploading } = useFileUpload();

  const { data: audioFiles } = useQuery({
    queryKey: ['/api/audio-files'],
  }) as any;

  const { data: currentJob } = useQuery({
    queryKey: ['/api/conversion-jobs', currentJobId],
    enabled: currentJobId !== null,
    refetchInterval: currentJobId ? 1000 : false,
  }) as any;

  const convertMutation = useMutation({
    mutationFn: async (data: { fileId: number; settings: SheetSettings }) => {
      const response = await apiRequest('POST', '/api/convert/midi-to-sheet', data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentJobId(data.id);
      toast({
        title: "Conversion Started",
        description: "Your MIDI file is being converted to sheet music.",
      });
    },
    onError: (error) => {
      toast({
        title: "Conversion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleConvert = (fileId: number) => {
    convertMutation.mutate({ fileId, settings });
  };

  const isConverting = currentJob?.status === 'processing';
  const isCompleted = currentJob?.status === 'completed';

  return (
    <div className="space-y-6">
      <div className="spotify-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold">MIDI to Sheet Music</h3>
            <p className="text-spotify-gray text-sm">Generate beautiful sheet music from MIDI files</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-gray-700 hover:border-spotify-green rounded-xl p-8 text-center transition-all duration-200 cursor-pointer">
            <input
              type="file"
              accept=".mid,.midi"
              onChange={handleFileUpload}
              className="hidden"
              id="midi-upload"
            />
            <label htmlFor="midi-upload" className="cursor-pointer">
              <svg className="w-12 h-12 text-spotify-gray mb-4 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <p className="text-lg font-medium text-spotify-white mb-2">Drop your MIDI files here</p>
              <p className="text-spotify-gray text-sm">or click to browse</p>
            </label>
          </div>

          {/* Recently Uploaded Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-spotify-gray">Recently Uploaded</h4>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    <div>
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-spotify-gray ml-2">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-red-500/20 rounded-full"
                    >
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Uploaded Files */}
          {audioFiles && audioFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-spotify-gray">Available Files</h4>
              {audioFiles.filter((file: any) => file.fileType === 'midi').map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    <div>
                      <span className="font-medium">{file.originalName}</span>
                      <span className="text-sm text-spotify-gray ml-2">
                        {(file.fileSize / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleConvert(file.id)}
                      disabled={convertMutation.isPending || isConverting}
                      className="spotify-button"
                    >
                      Convert
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-spotify-gray mb-2 block">Clef</Label>
              <Select value={settings.clef} onValueChange={(value) => setSettings({...settings, clef: value})}>
                <SelectTrigger className="spotify-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="treble">Treble Clef</SelectItem>
                  <SelectItem value="bass">Bass Clef</SelectItem>
                  <SelectItem value="alto">Alto Clef</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-spotify-gray mb-2 block">Key Signature</Label>
              <Select value={settings.keySignature} onValueChange={(value) => setSettings({...settings, keySignature: value})}>
                <SelectTrigger className="spotify-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C">C Major</SelectItem>
                  <SelectItem value="G">G Major</SelectItem>
                  <SelectItem value="D">D Major</SelectItem>
                  <SelectItem value="A">A Major</SelectItem>
                  <SelectItem value="E">E Major</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-spotify-gray mb-2 block">Time Signature</Label>
              <Select value={settings.timeSignature} onValueChange={(value) => setSettings({...settings, timeSignature: value})}>
                <SelectTrigger className="spotify-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4/4">4/4</SelectItem>
                  <SelectItem value="3/4">3/4</SelectItem>
                  <SelectItem value="2/4">2/4</SelectItem>
                  <SelectItem value="6/8">6/8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Progress Bar */}
          {currentJob && (isConverting || isCompleted) && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-between text-sm">
                <span className="text-spotify-gray">
                  {isCompleted ? 'Sheet music generated!' : 'Generating sheet music...'}
                </span>
                <span className="text-spotify-white font-mono">{Math.round(currentJob.progress || 0)}%</span>
              </div>
              <Progress value={currentJob.progress || 0} className="bg-gray-800" />
            </div>
          )}

          {isCompleted && (
            <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span className="text-purple-500 font-medium">Sheet music generated successfully!</span>
              </div>
              <p className="text-sm text-purple-400 mt-2">
                Your sheet music "{currentJob.outputFileName}" is ready for download.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
