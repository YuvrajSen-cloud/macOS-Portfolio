import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioContext } from "~/context/AudioContext";
import music from "~/configs/music";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  audio: string;
}

const getTracks = (musicData: typeof music): Track[] => [
  {
    id: "1",
    title: "Dreamer",
    artist: "Ozzy Osbourne",
    album: "Down to Earth",
    duration: "4:45",
    cover: musicData.cover,
    audio: "/music/dreamer.mp3",
  },
  {
    id: "2",
    title: "Dancin (KRONO Remix)",
    artist: "Aaron Smith",
    album: "Dancin",
    duration: "3:15",
    cover: "/music/dancin.png",
    audio: "/music/dancin.mp3",
  },
  {
    id: "3",
    title: "Loser",
    artist: "Tame Impala",
    album: "Loser",
    duration: "3:34",
    cover: "/music/loser.png",
    audio: "/music/loser.mp3",
  },
  {
    id: "4",
    title: "Earrings",
    artist: "Malcolm Todd",
    album: "Sweet Boy",
    duration: "2:58",
    cover: "/music/earrings.png",
    audio: "/music/earrings.mp3",
  },
  {
    id: "5",
    title: "Freaks",
    artist: "Surf Curse",
    album: "Buds",
    duration: "2:27",
    cover: "/music/freaks.png",
    audio: "/music/freaks.mp3",
  },
];

export default function MusicApp() {
  const TRACKS = useMemo(() => getTracks(music), []);
  const { audioState, controls, currentTrack, playTrack: contextPlayTrack, audioRef } = useAudioContext();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  const activeTrack = useMemo(() => {
    return TRACKS.find((t) => t.audio === currentTrack?.audio) || TRACKS[0];
  }, [TRACKS, currentTrack]);

  // Sync real audio progress
  useEffect(() => {
    const el = audioRef?.current;
    if (!el) return;

    const onTimeUpdate = () => {
      if (el.duration && isFinite(el.duration)) {
        setProgress((el.currentTime / el.duration) * 100);
      }
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [audioRef]);

  const playTrack = (track: Track) => {
    setProgress(0);
    contextPlayTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      cover: track.cover,
      audio: track.audio,
    });
  };

  const currentIdx = TRACKS.findIndex((t) => t.id === activeTrack.id);
  const playNext = () => {
    const nextIdx = (currentIdx + 1) % TRACKS.length;
    playTrack(TRACKS[nextIdx]);
  };
  const playPrev = () => {
    const prevIdx = (currentIdx - 1 + TRACKS.length) % TRACKS.length;
    playTrack(TRACKS[prevIdx]);
  };

  const totalSeconds = (dur: string) => {
    const [m, s] = dur.split(":").map(Number);
    return (m || 0) * 60 + (s || 0);
  };

  const currentDuration = audioRef?.current?.duration && isFinite(audioRef.current.duration)
    ? Math.floor(audioRef.current.duration)
    : totalSeconds(activeTrack.duration);

  const progressSeconds = Math.floor((progress / 100) * currentDuration);
  const remainingSeconds = Math.max(0, currentDuration - progressSeconds);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        
        background: "var(--lg-bg)",
        backdropFilter: "var(--lg-blur-light)",
        WebkitBackdropFilter: "var(--lg-blur-light)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
        color: "var(--c-text)",
      }}
    >
      {/* Player bar (Top) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "var(--lg-border)",
          background: "var(--lg-bg-tinted)",
          backdropFilter: "var(--lg-blur-light)",
          WebkitBackdropFilter: "var(--lg-blur-light)",
          padding: "12px 24px",
          gap: "24px",
          height: "72px",
          flexShrink: 0
        }}
      >
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", width: "180px" }}>
          <button
            onClick={playPrev}
            style={{ background: "none", border: "none", color: "var(--c-text-secondary)", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
            title="Previous Track"
          >
            <span className="i-ph:skip-back-fill" style={{ width: "24px", height: "24px" }} />
          </button>
          <button
            onClick={() => controls.toggle(!audioState.playing)}
            style={{
              background: "var(--system-pink, #FF2D55)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 12px rgba(255,45,85,0.3)"
            }}
          >
            <span className={audioState.playing ? "i-ph:pause-fill" : "i-ph:play-fill"} style={{ width: "20px", height: "20px" }} />
          </button>
          <button
            onClick={playNext}
            style={{ background: "none", border: "none", color: "var(--c-text-secondary)", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
            title="Next Track"
          >
            <span className="i-ph:skip-forward-fill" style={{ width: "24px", height: "24px" }} />
          </button>
        </div>

        {/* Track info & Progress (LCD Display) */}
        <div style={{ flex: 1, maxWidth: "500px", margin: "0 auto", background: "var(--c-bg-tertiary)", borderRadius: "8px", border: "1px solid var(--c-border)", padding: "6px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <img src={activeTrack.cover} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: "cover", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }} />
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeTrack.title} <span style={{ fontWeight: 400, color: "var(--c-text-secondary)" }}>— {activeTrack.artist}</span>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "10px", color: "var(--c-text-tertiary)", minWidth: 28 }}>{fmt(progressSeconds)}</span>
            <div
              style={{ flex: 1, height: 4, background: "var(--c-bg-tertiary)", borderRadius: 2, overflow: "hidden", cursor: "pointer" }}
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                setProgress(pct * 100);
                const el = audioRef?.current;
                if (el && el.duration && isFinite(el.duration)) {
                  el.currentTime = pct * el.duration;
                }
              }}
            >
              <div style={{ width: `${progress}%`, height: "100%", background: "var(--c-text)", borderRadius: 2, transition: "width 0.1s linear" }} />
            </div>
            <span style={{ fontSize: "10px", color: "var(--c-text-tertiary)", minWidth: 28, textAlign: "right" }}>-{fmt(remainingSeconds)}</span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ width: "180px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
          <span 
            className="i-ph:speaker-low" 
            style={{ width: "16px", height: "16px", color: "var(--c-text-secondary)", cursor: "pointer" }} 
            onClick={() => {
              setVolume(0);
              controls.volume(0);
            }}
          />
          <div 
            style={{ width: "80px", height: 6, background: "var(--c-bg-tertiary)", borderRadius: 3, overflow: "hidden", cursor: "pointer" }}
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const newVol = Math.round(pct * 100);
              setVolume(newVol);
              controls.volume(newVol / 100);
            }}
          >
             <div style={{ width: `${volume}%`, height: "100%", background: "var(--c-text-secondary)", borderRadius: 3 }} />
          </div>
          <span 
            className="i-ph:speaker-high" 
            style={{ width: "16px", height: "16px", color: "var(--c-text-secondary)", cursor: "pointer" }} 
            onClick={() => {
              setVolume(100);
              controls.volume(1);
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "200px",
          flexShrink: 0,
          borderRight: "var(--lg-border)",
          background: "var(--lg-bg-tinted)",
          backdropFilter: "var(--lg-blur-light)",
          WebkitBackdropFilter: "var(--lg-blur-light)",
          display: "flex",
          flexDirection: "column",
          padding: "16px 12px",
          gap: "4px"
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: "16px", padding: "0 8px" }}>
            <div style={{ display: "flex", alignItems: "center", background: "var(--c-bg-tertiary)", borderRadius: "6px", padding: "4px 8px", gap: "6px" }}>
                <span className="i-ph:magnifying-glass" style={{ width: "12px", height: "12px", color: "var(--c-text-secondary)" }} />
                <span style={{ fontSize: "12px", color: "var(--c-text-tertiary)" }}>Search</span>
            </div>
        </div>

        {[
          { icon: "i-ph:music-note", label: "Listen Now" },
          { icon: "i-ph:magnifying-glass", label: "Browse" },
          { icon: "i-ph:radio", label: "Radio" },
          { icon: "i-ph:music-notes-simple", label: "Library" },
        ].map(({ icon, label }) => (
          <button
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              background: label === "Library" ? "rgba(255,45,85,0.15)" : "transparent",
              border: "none",
              cursor: "pointer",
              color: label === "Library" ? "var(--system-pink, #FF2D55)" : "var(--c-text)",
              fontSize: "13px",
              fontWeight: label === "Library" ? 600 : 500,
              borderRadius: "6px",
              textAlign: "left",
              width: "100%",
              transition: "background 0.15s ease",
            }}
          >
            <span className={icon} style={{ width: "16px", height: "16px", flexShrink: 0, color: label === "Library" ? "var(--system-pink, #FF2D55)" : "var(--system-pink, #FF2D55)" }} />
            {label}
          </button>
        ))}

        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--c-text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            padding: "16px 12px 4px",
          }}
        >
          Library
        </div>
        {["Songs", "Albums", "Artists", "Playlists"].map((item) => (
          <button
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--c-text)",
              fontSize: "13px",
              fontWeight: 500,
              textAlign: "left",
              width: "100%",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Track list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 800,
              padding: "0 0 24px 0",
              color: "var(--c-text)",
              letterSpacing: "-0.5px"
            }}
          >
            Library
          </div>
          {TRACKS.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => playTrack(track)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "12px 16px",
                cursor: "pointer",
                background:
                  activeTrack.id === track.id
                    ? "rgba(255,45,85,0.1)"
                    : "transparent",
                borderRadius: "12px",
                margin: "4px 0",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (activeTrack.id !== track.id)
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--c-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                if (activeTrack.id !== track.id)
                  (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <img
                src={track.cover}
                alt={track.album}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: activeTrack.id === track.id ? 600 : 500,
                    color:
                      activeTrack.id === track.id ? "var(--system-pink, #FF2D55)" : "var(--c-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {track.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--c-text-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {track.artist}
                </div>
              </div>
              <span style={{ fontSize: "12px", color: "var(--c-text-tertiary)", flexShrink: 0 }}>
                {track.duration}
              </span>
              {activeTrack.id === track.id && audioState.playing && (
                <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", flexShrink: 0 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 6, 10, 4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      style={{
                        width: 3,
                        borderRadius: 2,
                        background: "var(--system-pink, #FF2D55)",
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </div>
    </div>
  );
}
