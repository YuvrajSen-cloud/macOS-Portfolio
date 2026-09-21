import type { TerminalData } from "~/types";

const terminal: TerminalData[] = [
  {
    id: "readme",
    title: "README.md",
    type: "file",
    content: (
      <div className="py-1 text-gray-200 space-y-1.5">
        <div className="text-emerald-400 font-bold text-base">
          Welcome to Yuvraj Sen's Terminal (macOS 26 Tahoe)
        </div>
        <div>
          Aspiring Software Engineer & B.Tech Computer Science student specializing in backend architecture with Ruby on Rails.
        </div>
        <div className="text-gray-400">
          Type <span className="text-yellow-300 font-semibold">help</span> to view all commands, or navigate using <span className="text-sky-300">ls</span> and <span className="text-sky-300">cd</span>.
        </div>
      </div>
    )
  },
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "about-me",
        title: "intro.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-1">
            <div className="text-emerald-300 font-semibold">Hi, I am Yuvraj Sen 👋</div>
            <div>
              I am a B.Tech Computer Science and Engineering student and an aspiring Software Engineer.
            </div>
            <div>
              Passionate about clean code, backend architectures, system design, and building robust web applications.
            </div>
          </div>
        )
      },
      {
        id: "about-interests",
        title: "interests.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>• Backend Engineering & API Design</div>
            <div>• Ruby on Rails & Distributed Architectures</div>
            <div>• Data Structures, Algorithms & Problem Solving</div>
            <div>• Cloud computing, database optimization & developer tooling</div>
          </div>
        )
      },
      {
        id: "about-who-cares",
        title: "who-cares.txt",
        type: "file",
        content:
          "I love backend engineering and building with Ruby on Rails. Looking for SDE opportunities and open to collaboration!"
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6 space-y-1 py-1">
            <li>
              Email:{" "}
              <a
                className="text-sky-300 underline hover:text-sky-200"
                href="mailto:senyuvaj997@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                senyuvaj997@gmail.com
              </a>
            </li>
            <li>
              Github:{" "}
              <a
                className="text-sky-300 underline hover:text-sky-200"
                href="https://github.com/yuvrajsen-cloud"
                target="_blank"
                rel="noreferrer"
              >
                @yuvrajsen-cloud
              </a>
            </li>
            <li>
              Linkedin:{" "}
              <a
                className="text-sky-300 underline hover:text-sky-200"
                href="https://www.linkedin.com/in/yuvraj-sen-772434334"
                target="_blank"
                rel="noreferrer"
              >
                yuvraj-sen-772434334
              </a>
            </li>
            <li>
              LeetCode:{" "}
              <a
                className="text-sky-300 underline hover:text-sky-200"
                href="https://leetcode.com/u/yuvraj_sen/"
                target="_blank"
                rel="noreferrer"
              >
                yuvraj_sen
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                className="text-sky-300 underline hover:text-sky-200"
                href="https://www.instagram.com/yuvraj_mr._.boombastic?stkn=NHhmMzdrbXR3Zmxx"
                target="_blank"
                rel="noreferrer"
              >
                @yuvraj_mr._.boombastic
              </a>
            </li>
          </ul>
        )
      }
    ]
  },
  {
    id: "skills",
    title: "skills",
    type: "folder",
    children: [
      {
        id: "skills-backend",
        title: "backend.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-1">
            <div className="text-emerald-300 font-semibold">Backend Development:</div>
            <div>• Ruby on Rails, RESTful API Design, MVC Architecture</div>
            <div>• Database Schema Design, Query Optimization, ORM (ActiveRecord)</div>
            <div>• Authentication, Session Management, Background Jobs</div>
          </div>
        )
      },
      {
        id: "skills-languages",
        title: "languages.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-1">
            <div className="text-emerald-300 font-semibold">Programming Languages:</div>
            <div>• Ruby, C++, Python, JavaScript, TypeScript, SQL, HTML/CSS</div>
          </div>
        )
      },
      {
        id: "skills-tools",
        title: "databases-tools.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-1">
            <div className="text-emerald-300 font-semibold">Databases & Tools:</div>
            <div>• PostgreSQL, MySQL, SQLite, Redis</div>
            <div>• Git, GitHub, Linux/Unix, Docker, Postman, VS Code</div>
          </div>
        )
      }
    ]
  },
  {
    id: "resume-file",
    title: "resume.txt",
    type: "file",
    content: (
      <div className="py-1 space-y-1">
        <div>Yuvraj Sen — Resume / Curriculum Vitae</div>
        <div>Download full PDF: <a className="text-sky-300 underline" href="/resume.pdf" target="_blank" rel="noreferrer">/resume.pdf</a></div>
        <div className="text-gray-400 text-xs">Tip: You can also type `open resume` to download it directly.</div>
      </div>
    )
  },
  {
    id: "about-dream",
    title: "my-dream.cpp",
    type: "file",
    content: (
      <div className="py-1 font-mono text-sm leading-relaxed">
        <div>
          <span className="text-purple-400">#include</span> <span className="text-green-300">&lt;iostream&gt;</span>
        </div>
        <div className="mt-1">
          <span className="text-yellow-400">int</span> <span className="text-blue-400">main</span>() {"{"}
        </div>
        <div className="ml-4">
          <span className="text-yellow-400">while</span> (<span className="text-blue-300">sleeping</span>) {"{"}
        </div>
        <div className="ml-8">
          <span className="text-emerald-400">money</span><span className="text-yellow-400">++</span>;
        </div>
        <div className="ml-4">{"}"}</div>
        <div className="ml-4"><span className="text-yellow-400">return</span> <span className="text-orange-400">0</span>;</div>
        <div>{"}"}</div>
      </div>
    )
  }
];

export default terminal;
