import React, { createContext, useContext, ReactNode, useState } from "react";
import music from "~/configs/music";

export interface TrackInfo {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  cover: string;
  audio: string;
}

interface AudioContextType {
  audio: HTMLAudioElement;
  audioState: any;
  currentTrack: TrackInfo;
  setCurrentTrack: (track: TrackInfo) => void;
  playTrack: (track: TrackInfo) => void;
  controls: {
    play: () => Promise<void> | void;
    pause: () => Promise<void> | void;
    toggle: (play?: boolean) => Promise<void> | void;
    volume: (value: number) => void;
    seek?: (time: number) => void;
  };
  audioRef: React.RefObject<HTMLAudioElement>;
}

// Create the context with an initial undefined value
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Create a provider component
export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>({
    id: "1",
    title: music.title,
    artist: music.artist,
    album: "Down to Earth",
    duration: "4:45",
    cover: music.cover,
    audio: music.audio
  });

  const [audio, audioState, controls, audioRef] = useAudio({
    src: currentTrack.audio, 
    autoReplay: true
  });

  const playTrack = (track: TrackInfo) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      const srcAttr = audioRef.current.getAttribute("src") || audioRef.current.src;
      if (!srcAttr.endsWith(track.audio)) {
        audioRef.current.src = track.audio;
        audioRef.current.load();
      }
      controls.play();
    }
  };

  return (
    <AudioContext.Provider value={{ audio, audioState, currentTrack, setCurrentTrack, playTrack, controls, audioRef }}>
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook to use the audio context
export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
