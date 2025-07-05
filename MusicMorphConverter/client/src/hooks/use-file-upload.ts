import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export function useFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/audio-files', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/audio-files'] });
      toast({
        title: 'Upload successful',
        description: 'Your file has been uploaded successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const uploadFile = (file: File) => {
    if (!file) return;
    
    const validTypes = ['audio/midi', 'audio/x-midi', '.mid', '.midi'];
    const isValidType = validTypes.some(type => 
      file.type.includes(type) || file.name.toLowerCase().endsWith(type)
    );
    
    if (!isValidType) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a MIDI file (.mid or .midi)',
        variant: 'destructive',
      });
      return;
    }
    
    setFiles(prev => [...prev, file]);
    uploadMutation.mutate(file);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    files,
    uploadFile,
    removeFile,
    isUploading: uploadMutation.isPending,
  };
}
