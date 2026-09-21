import React, { useState, useRef, useEffect } from "react";
import terminalConfig from "~/configs/terminal";
import type { TerminalData } from "~/types";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const EMOJIS = ["\\(o_o)/", "(˚Δ˚)b", "(^-^*)", "(‵′)", "\\(°ˊДˋ°)/"];

const getEmoji = () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

// Matrix rain animation
const HowDare = ({ setRMRF }: { setRMRF: (value: boolean) => void }) => {
  const FONT_SIZE = 12;
  const [emoji, setEmoji] = useState("");
  const [drops, setDrops] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    canvas.height = container.offsetHeight;
    canvas.width = container.offsetWidth;

    const columns = Math.floor(canvas.width / FONT_SIZE);
    setDrops(Array(columns).fill(1));
    setEmoji(getEmoji());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#2e9244";
      ctx.font = `${FONT_SIZE}px monospace`;

      drops.forEach((y, x) => {
        const text = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        ctx.fillText(text, x * FONT_SIZE, y * FONT_SIZE);
      });

      setDrops((prev) =>
        prev.map((y) => {
          if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) return 1;
          return y + 1;
        })
      );
    }, 33);

    return () => clearInterval(interval);
  }, [drops]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 bg-black text-white cursor-pointer select-none"
      onClick={() => setRMRF(false)}
    >
      <canvas ref={canvasRef} className="size-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 pointer-events-none">
        <div className="text-4xl">{emoji}</div>
        <div className="text-2xl font-bold text-red-400">HOW DARE YOU!</div>
        <div className="text-sm text-gray-400">Click anywhere to return to safety</div>
      </div>
    </div>
  );
};

interface HistoryEntry {
  id: string;
  command: string;
  dir: string;
  result?: React.ReactNode;
}

export default function Terminal() {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState<string>("");
  const [rmrf, setRmrf] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll on new entries
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const getDirName = () => {
    if (currentPath.length === 0) return "~";
    return currentPath.join("/");
  };

  const getChildrenForPath = (path: string[]): TerminalData[] => {
    let curr: TerminalData[] = terminalConfig;
    for (const seg of path) {
      const folder = curr.find((item) => item.type === "folder" && item.title === seg);
      if (folder && folder.children) {
        curr = folder.children;
      } else {
        return [];
      }
    }
    return curr;
  };

  const executeCommand = (fullInput: string) => {
    const trimmed = fullInput.trim();
    const currentDir = getDirName();

    if (!trimmed) {
      setEntries((prev) => [
        ...prev,
        { id: `entry-${Date.now()}-${Math.random()}`, command: "", dir: currentDir }
      ]);
      return;
    }

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ").trim();

    let result: React.ReactNode = null;

    if (trimmed.startsWith("rm -rf") || cmd === "matrix") {
      setRmrf(true);
      result = <span className="text-red-400">Initiating system override...</span>;
    } else if (cmd === "help") {
      result = (
        <div className="py-1 space-y-1.5 text-xs text-gray-200">
          <div className="text-emerald-400 font-semibold mb-1">Available Shell Commands:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            <div><span className="text-yellow-300 font-mono font-semibold">ls [flags]</span> : List files and folders</div>
            <div><span className="text-yellow-300 font-mono font-semibold">cd &lt;dir&gt;</span> : Change directory (`..` for parent, `~` for root)</div>
            <div><span className="text-yellow-300 font-mono font-semibold">cat &lt;file&gt;</span> : Display file contents</div>
            <div><span className="text-yellow-300 font-mono font-semibold">pwd</span> : Print current working directory</div>
            <div><span className="text-yellow-300 font-mono font-semibold">whoami</span> : Print current logged in user</div>
            <div><span className="text-yellow-300 font-mono font-semibold">tree</span> : Visual tree hierarchy of files</div>
            <div><span className="text-yellow-300 font-mono font-semibold">open &lt;app|url&gt;</span> : Launch macOS app or external link</div>
            <div><span className="text-yellow-300 font-mono font-semibold">date</span> : Display current system time & date</div>
            <div><span className="text-yellow-300 font-mono font-semibold">echo [text]</span> : Print text to the terminal</div>
            <div><span className="text-yellow-300 font-mono font-semibold">history</span> : List previously entered commands</div>
            <div><span className="text-yellow-300 font-mono font-semibold">uname -a</span> : Display operating system information</div>
            <div><span className="text-yellow-300 font-mono font-semibold">clear</span> : Clear the terminal screen</div>
            <div><span className="text-yellow-300 font-mono font-semibold">matrix</span> : Run the Matrix code rain animation</div>
          </div>
          <div className="text-gray-400 text-xs mt-2">
            Tip: Press <span className="text-sky-300">Tab</span> for auto-completion, and <span className="text-sky-300">↑ / ↓</span> for command history.
          </div>
        </div>
      );
    } else if (cmd === "clear") {
      setEntries([]);
      return;
    } else if (cmd === "ls") {
      const children = getChildrenForPath(currentPath);
      if (children.length === 0) {
        result = <span className="text-gray-400 italic">Empty directory</span>;
      } else {
        result = (
          <div className="flex flex-wrap gap-x-6 gap-y-1 py-1 font-mono text-sm">
            {children.map((item) => (
              <span
                key={item.id}
                className={
                  item.type === "folder"
                    ? "text-sky-400 font-semibold hover:underline cursor-pointer"
                    : "text-emerald-300 hover:underline cursor-pointer"
                }
                onClick={() => {
                  if (item.type === "folder") {
                    executeCommand(`cd ${item.title}`);
                  } else {
                    executeCommand(`cat ${item.title}`);
                  }
                }}
              >
                {item.type === "folder" ? `${item.title}/` : item.title}
              </span>
            ))}
          </div>
        );
      }
    } else if (cmd === "cd") {
      let target = args.replace(/\/+$/, ""); // Remove trailing slash
      if (!target || target === "~") {
        setCurrentPath([]);
      } else if (target === ".") {
        // stay in current
      } else if (target === "..") {
        if (currentPath.length > 0) {
          setCurrentPath((prev) => prev.slice(0, prev.length - 1));
        }
      } else {
        const children = getChildrenForPath(currentPath);
        const folder = children.find(
          (item) => item.type === "folder" && item.title.toLowerCase() === target.toLowerCase()
        );
        if (folder) {
          setCurrentPath((prev) => [...prev, folder.title]);
        } else {
          const isFile = children.some(
            (item) => item.type === "file" && item.title.toLowerCase() === target.toLowerCase()
          );
          if (isFile) {
            result = <span className="text-red-400">cd: not a directory: {target}</span>;
          } else {
            result = <span className="text-red-400">cd: no such file or directory: {target}</span>;
          }
        }
      }
    } else if (cmd === "cat") {
      if (!args) {
        result = <span className="text-yellow-300">usage: cat &lt;file&gt;</span>;
      } else {
        const children = getChildrenForPath(currentPath);
        const file = children.find(
          (item) => item.title.toLowerCase() === args.toLowerCase()
        );
        if (!file) {
          result = <span className="text-red-400">cat: {args}: No such file or directory</span>;
        } else if (file.type === "folder") {
          result = <span className="text-red-400">cat: {args}: Is a directory</span>;
        } else {
          result = <div className="text-gray-100 py-1">{file.content}</div>;
        }
      }
    } else if (cmd === "pwd") {
      result = (
        <span className="text-gray-300 font-mono">
          /Users/yuvraj{currentPath.length > 0 ? `/${currentPath.join("/")}` : ""}
        </span>
      );
    } else if (cmd === "whoami") {
      result = <span className="text-emerald-400 font-mono font-semibold">yuvraj</span>;
    } else if (cmd === "date") {
      result = <span className="text-gray-300 font-mono">{new Date().toString()}</span>;
    } else if (cmd === "echo") {
      result = <span className="text-gray-200">{args}</span>;
    } else if (cmd === "uname") {
      result = (
        <span className="text-gray-300 font-mono">
          Darwin MacBook-Pro.local 25.0.0 Darwin Kernel Version 25.0.0: macOS 26 Tahoe x86_64
        </span>
      );
    } else if (cmd === "history") {
      result = (
        <div className="font-mono text-xs text-gray-300 py-1 space-y-0.5">
          {history.map((h, i) => (
            <div key={i}>
              <span className="text-gray-500 w-6 inline-block">{i + 1}</span> {h}
            </div>
          ))}
        </div>
      );
    } else if (cmd === "tree") {
      result = (
        <div className="font-mono text-xs text-gray-300 py-1 leading-relaxed">
          <div className="text-sky-300 font-bold">.</div>
          <div>├── <span className="text-emerald-300">README.md</span></div>
          <div>├── <span className="text-emerald-300">my-dream.cpp</span></div>
          <div>├── <span className="text-emerald-300">resume.txt</span></div>
          <div>├── <span className="text-sky-400 font-bold">about/</span></div>
          <div>│   ├── <span className="text-emerald-300">intro.txt</span></div>
          <div>│   ├── <span className="text-emerald-300">interests.txt</span></div>
          <div>│   ├── <span className="text-emerald-300">who-cares.txt</span></div>
          <div>│   └── <span className="text-emerald-300">contact.txt</span></div>
          <div>└── <span className="text-sky-400 font-bold">skills/</span></div>
          <div>    ├── <span className="text-emerald-300">backend.txt</span></div>
          <div>    ├── <span className="text-emerald-300">languages.txt</span></div>
          <div>    └── <span className="text-emerald-300">databases-tools.txt</span></div>
          <div className="text-gray-500 mt-1">2 directories, 8 files</div>
        </div>
      );
    } else if (cmd === "open") {
      if (!args) {
        result = <span className="text-yellow-300">usage: open &lt;app-name | file | url&gt;</span>;
      } else if (args.toLowerCase() === "resume" || args.toLowerCase() === "resume.pdf") {
        const a = document.createElement("a");
        a.href = "/resume.pdf";
        a.download = "Yuvraj_Sen_Resume.pdf";
        a.target = "_blank";
        a.click();
        result = <span className="text-emerald-300">Downloading Yuvraj's resume...</span>;
      } else if (args.startsWith("http://") || args.startsWith("https://")) {
        window.open(args, "_blank");
        result = <span className="text-emerald-300">Opening {args}...</span>;
      } else {
        const appMap: Record<string, string> = {
          safari: "safari",
          spotify: "spotify",
          mail: "mail",
          photos: "photos",
          music: "music",
          messages: "messages",
          settings: "system-settings",
          calculator: "calculator",
          notes: "notes",
          appstore: "app-store",
          facetime: "facetime",
          vscode: "vscode",
          bear: "bear",
          typora: "typora",
          github: "github"
        };
        const mapped = appMap[args.toLowerCase().replace(/[\s-]/g, "")];
        if (mapped) {
          window.dispatchEvent(new CustomEvent("launchpad:openApp", { detail: mapped }));
          result = <span className="text-emerald-300">Launched {args}</span>;
        } else {
          result = (
            <span className="text-red-400">
              open: Unable to find application named '{args}'. Try: safari, spotify, music, photos, mail, notes, settings...
            </span>
          );
        }
      }
    } else if (cmd === "sudo") {
      result = (
        <div className="text-red-400 py-0.5">
          <div>[sudo] password for yuvraj: </div>
          <div>yuvraj is not in the sudoers file. This incident will be reported.</div>
        </div>
      );
    } else if (cmd === "exit") {
      result = <span className="text-gray-400 italic">[Process completed]</span>;
    } else {
      result = <span className="text-red-400">zsh: command not found: {cmd}</span>;
    }

    setEntries((prev) => [
      ...prev,
      {
        id: `entry-${Date.now()}-${Math.random()}`,
        command: trimmed,
        dir: currentDir,
        result
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputVal);
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trimStart();
      if (!current) return;

      const knownCommands = [
        "help",
        "ls",
        "cd",
        "cat",
        "clear",
        "pwd",
        "whoami",
        "tree",
        "date",
        "echo",
        "history",
        "uname",
        "open",
        "matrix",
        "exit"
      ];

      const parts = current.split(" ");
      if (parts.length === 1) {
        const match = knownCommands.find((c) => c.startsWith(parts[0].toLowerCase()));
        if (match) setInputVal(match + " ");
      } else if (parts.length === 2 && (parts[0] === "cd" || parts[0] === "cat")) {
        const children = getChildrenForPath(currentPath);
        const prefix = parts[1].toLowerCase();
        const match = children.find((item) =>
          parts[0] === "cd"
            ? item.type === "folder" && item.title.toLowerCase().startsWith(prefix)
            : item.type === "file" && item.title.toLowerCase().startsWith(prefix)
        );
        if (match) {
          setInputVal(`${parts[0]} ${match.title}`);
        }
      }
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // If user is selecting text or clicking a link, do not steal focus
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    if ((e.target as HTMLElement).tagName.toLowerCase() === "a") return;
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="terminal font-mono text-sm relative h-full bg-[#18181b]/95 text-gray-100 overflow-y-auto select-text p-3"
      onClick={handleContainerClick}
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      }}
    >
      {rmrf && <HowDare setRMRF={setRmrf} />}

      {/* Terminal banner header */}
      <div className="pb-3 border-b border-gray-800 text-xs text-gray-400 space-y-1">
        <div>Last login: {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} on ttys001</div>
        <div>
          Welcome to <span className="text-emerald-400 font-semibold">macOS 26 Tahoe</span> Terminal. Type{" "}
          <span className="text-yellow-300 font-semibold cursor-pointer underline" onClick={() => executeCommand("help")}>
            help
          </span>{" "}
          for commands or{" "}
          <span className="text-sky-300 font-semibold cursor-pointer underline" onClick={() => executeCommand("cat README.md")}>
            cat README.md
          </span>.
        </div>
      </div>

      {/* Render previous entries */}
      <div className="pt-2 space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-emerald-400 font-bold">yuvraj@macbook</span>
              <span className="text-sky-300">{entry.dir}</span>
              <span className="text-yellow-400 font-bold">%</span>
              <span className="text-white font-mono">{entry.command}</span>
            </div>
            {entry.result && <div className="pl-0">{entry.result}</div>}
          </div>
        ))}

        {/* Active prompt row */}
        <div className="flex items-center space-x-2 text-xs pt-1">
          <span className="text-emerald-400 font-bold select-none">yuvraj@macbook</span>
          <span className="text-sky-300 select-none">{getDirName()}</span>
          <span className="text-yellow-400 font-bold select-none">%</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono caret-white focus:outline-none focus:ring-0 p-0 m-0"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
}
