"use client"; // Needs state for customization form

import React, { useState } from 'react';
import type { Voice } from '@/app/types';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: string;
  onSelectVoice: (voiceName: string, voiceId: string) => void;
}

export default function VoiceSelector({ voices, selectedVoice, onSelectVoice }: VoiceSelectorProps) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = e.target.value;
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      onSelectVoice(voiceName, voice.id);
    }
  };

  const playPreview = (voice: Voice) => {
    if (!voice.preview) return;
    
    setIsPlaying(voice.id);
    const audio = new Audio(voice.preview);
    audio.onended = () => setIsPlaying(null);
    audio.play();
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <label htmlFor="voice-selector" className="block text-sm font-medium text-gray-700 mb-1">
          Agent Voice
        </label>
        <div className="flex items-center">
          <select
            id="voice-selector"
            value={selectedVoice}
            onChange={handleVoiceChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {voices.map((voice) => (
              <option key={voice.id} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>
          {selectedVoice && voices.find(v => v.name === selectedVoice)?.preview && (
            <button
              type="button"
              onClick={() => playPreview(voices.find(v => v.name === selectedVoice)!)}
              className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isPlaying !== null}
            >
              {isPlaying === voices.find(v => v.name === selectedVoice)?.id ? 'Playing...' : 'Preview'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}