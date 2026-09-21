export interface HTMLAudioState {
  volume: number;
  playing: boolean;
}

export interface HTMLAudioProps {
  src: string;
  autoReplay?: boolean;
}

export function useAudio(props: HTMLAudioProps) {
  const ref = useRef<HTMLAudioElement | null>(null);

  if (!ref.current && typeof Audio !== "undefined") {
    ref.current = new Audio(props.src);
  }

  const [state, setState] = useState<HTMLAudioState>({
    volume: 1,
    playing: false
  });

  const controls = {
    play: (): Promise<void> | void => {
      const el = ref.current;
      if (el) {
        setState((s) => ({ ...s, playing: true }));
        return el.play().catch(() => {});
      }
    },

    pause: (): Promise<void> | void => {
      const el = ref.current;
      if (el) {
        setState((s) => ({ ...s, playing: false }));
        return el.pause();
      }
    },

    toggle: (play?: boolean): Promise<void> | void => {
      const el = ref.current;
      if (el) {
        const shouldPlay = play !== undefined ? play : el.paused;
        if (shouldPlay) {
          setState((s) => ({ ...s, playing: true }));
          return el.play().catch(() => {});
        } else {
          setState((s) => ({ ...s, playing: false }));
          return el.pause();
        }
      }
    },

    volume: (value: number): void => {
      const el = ref.current;
      if (el) {
        value = Math.min(1, Math.max(0, value));
        el.volume = value;
        setState((s) => ({ ...s, volume: value }));
      }
    },

    seek: (time: number): void => {
      const el = ref.current;
      if (el && isFinite(time)) {
        el.currentTime = time;
      }
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onPlay = () => setState((s) => ({ ...s, playing: true }));
    const onPause = () => setState((s) => ({ ...s, playing: false }));
    const onEnded = () => {
      if (props.autoReplay) {
        controls.play();
      } else {
        setState((s) => ({ ...s, playing: false }));
      }
    };

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [props.autoReplay]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const currentSrc = el.getAttribute("src") || el.src;
    if (props.src && !currentSrc.endsWith(props.src)) {
      const wasPlaying = !el.paused || state.playing;
      el.src = props.src;
      el.load();
      if (wasPlaying) {
        el.play().catch(() => {});
      }
    }
  }, [props.src]);

  return [ref.current!, state, controls, ref as React.RefObject<HTMLAudioElement>] as const;
}
