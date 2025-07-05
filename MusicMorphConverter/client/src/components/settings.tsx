import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface AudioSettings {
  sampleRate: string;
  bitDepth: string;
  noiseReduction: number;
}

interface MidiSettings {
  velocitySensitivity: number;
  noteQuantization: string;
  multiTrack: boolean;
}

export default function Settings() {
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    sampleRate: '44100',
    bitDepth: '16',
    noiseReduction: 50,
  });

  const [midiSettings, setMidiSettings] = useState<MidiSettings>({
    velocitySensitivity: 75,
    noteQuantization: '1/16',
    multiTrack: true,
  });

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('audioSettings', JSON.stringify(audioSettings));
    localStorage.setItem('midiSettings', JSON.stringify(midiSettings));
  };

  return (
    <div className="space-y-6">
      <div className="spotify-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Advanced Configuration</h3>
            <p className="text-spotify-gray text-sm">Fine-tune your conversion settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-spotify-green">Audio Processing</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Sample Rate</Label>
                <Select value={audioSettings.sampleRate} onValueChange={(value) => setAudioSettings({...audioSettings, sampleRate: value})}>
                  <SelectTrigger className="w-32 spotify-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="44100">44.1 kHz</SelectItem>
                    <SelectItem value="48000">48 kHz</SelectItem>
                    <SelectItem value="96000">96 kHz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Bit Depth</Label>
                <Select value={audioSettings.bitDepth} onValueChange={(value) => setAudioSettings({...audioSettings, bitDepth: value})}>
                  <SelectTrigger className="w-32 spotify-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">16-bit</SelectItem>
                    <SelectItem value="24">24-bit</SelectItem>
                    <SelectItem value="32">32-bit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Noise Reduction</Label>
                  <span className="text-sm font-mono">{audioSettings.noiseReduction}%</span>
                </div>
                <Slider
                  value={[audioSettings.noiseReduction]}
                  onValueChange={(value) => setAudioSettings({...audioSettings, noiseReduction: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-spotify-green">MIDI Settings</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Velocity Sensitivity</Label>
                  <span className="text-sm font-mono">{midiSettings.velocitySensitivity}%</span>
                </div>
                <Slider
                  value={[midiSettings.velocitySensitivity]}
                  onValueChange={(value) => setMidiSettings({...midiSettings, velocitySensitivity: value[0]})}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Note Quantization</Label>
                <Select value={midiSettings.noteQuantization} onValueChange={(value) => setMidiSettings({...midiSettings, noteQuantization: value})}>
                  <SelectTrigger className="w-32 spotify-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1/16">1/16</SelectItem>
                    <SelectItem value="1/8">1/8</SelectItem>
                    <SelectItem value="1/4">1/4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Multi-track</Label>
                <Switch
                  checked={midiSettings.multiTrack}
                  onCheckedChange={(checked) => setMidiSettings({...midiSettings, multiTrack: checked})}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveSettings} className="spotify-button">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <Card className="spotify-card">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-spotify-gray">
            Settings page will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
