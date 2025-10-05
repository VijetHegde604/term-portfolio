import React, { useRef, useState, useEffect } from 'react';
import Terminal from 'react-console-emulator';
import { fetchProgrammingJoke } from './api';

// Directory-aware commands (cleaned, single definition)
function getCommands(terminalRef, currentSection, setCurrentSection) {
    const dirs = {
        root: ['about', 'skills', 'projects', 'contact', 'social', 'banner', 'matrix', 'joke'],
        about: [], skills: [], projects: [], contact: [], social: [], banner: [], matrix: [], joke: [],
    };
    function getLs(section) {
        if (dirs[section]) return dirs[section].map(x => x + (dirs[x] && dirs[x].length ? '/' : '')).join('  ') || '(empty)';
        return '(empty)';
    }
    const aboutFn = () => `Hi, I am Vijeth Hegde, a passionate developer!\nI love building web apps and exploring new tech.`;
    const whoamiText = `👋 Hi! I'm Vijeth Hegde, a passionate Full Stack Developer from India.\n\nI love building interactive web apps, exploring new tech, and solving real-world problems with code.\n\nSkills: JavaScript, React, Node.js, Python, CSS, Tailwind CSS, REST APIs, and more.\nInterests: UI/UX, open source, terminal UIs, and AI.\nCurrently: Working on cool projects and always learning!\n\nContact: vijethegde604@gmail.com | linkedin.com/in/vijeth-hegde | github.com/VijetHegde604\n\n“Always hacking, always learning.”`;
    const whoamiFn = function () {
        const id = `whoami-anim-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        setTimeout(() => {
            const el = document.getElementById(id);
            if (!el) return;
            const text = whoamiText;
            let i = 0;
            let cursorVisible = true;
            function getDelay(char) {
                if (char === '\n') return 180 + Math.random() * 60;
                if (/[.,!?]/.test(char)) return 120 + Math.random() * 60;
                if (char === ' ') return 30 + Math.random() * 30;
                return 14 + Math.random() * 22;
            }
            function type() {
                if (!el) return;
                if (i <= text.length) {
                    el.innerHTML = text.slice(0, i).replace(/\n/g, '<br>') + `<span style='color:#38bdf8;font-weight:bold;'>${cursorVisible ? '▍' : '&nbsp;'}</span>`;
                    let delay = getDelay(text[i - 1] || '');
                    i++;
                    setTimeout(type, delay);
                } else {
                    // After typing, keep blinking the cursor for a while
                    let blinkCount = 0;
                    function blink() {
                        if (!el) return;
                        cursorVisible = !cursorVisible;
                        el.innerHTML = text.replace(/\n/g, '<br>') + `<span style='color:#38bdf8;font-weight:bold;'>${cursorVisible ? '▍' : '&nbsp;'}</span>`;
                        blinkCount++;
                        if (blinkCount < 16) setTimeout(blink, 350);
                        else el.innerHTML = text.replace(/\n/g, '<br>');
                    }
                    setTimeout(blink, 350);
                }
            }
            type();
        }, 80);
        // No bubble, just plain terminal output
        return `<span id='${id}'></span>`;
    };
    return {
        echo: {
            description: 'Prints the input text', usage: 'echo [text]', fn: (...args) => args.length ? args.join(' ') : ''
        },
        about: {
            description: 'About me', usage: 'about', fn: aboutFn
        },
        whoami: {
            description: 'Show all details about me', usage: 'whoami', fn: whoamiFn
        },
        skills: {
            description: 'List of my skills', usage: 'skills', fn: () => `Skills:\n- JavaScript\n- React\n- Node.js\n- CSS\n- Tailwind CSS\n- Python`
        },
        projects: {
            description: 'Showcase my projects', usage: 'projects', fn: () => `Projects:\n- <a href=\"https://github.com/VijetHegde604/term-portfolio\" target=\"_blank\" style='color: #38bdf8;'>Portfolio Terminal (this!)</a>\n- <a href=\"https://github.com/VijetHegde604/project2\" target=\"_blank\" style='color: #38bdf8;'>Project 2</a>: Description\n- <a href=\"https://github.com/VijetHegde604/project3\" target=\"_blank\" style='color: #38bdf8;'>Project 3</a>: Description`
        },
        contact: {
            description: 'Contact information', usage: 'contact', fn: () => `Contact me at: <a href=\"mailto:vijethegde604@gmail.com\" style='color: #38bdf8;'>vijethegde604@gmail.com</a>\nLinkedIn: <a href=\"https://linkedin.com/in/vijeth-hegde\" target=\"_blank\" style='color: #38bdf8;'>linkedin.com/in/vijeth-hegde</a>`
        },
        date: {
            description: 'Show current date and time', usage: 'date', fn: () => new Date().toLocaleString()
        },
        ls: {
            description: 'List available sections (like a directory)', usage: 'ls', fn: () => getLs(currentSection)
        },
        cd: {
            description: 'Navigate to a section (simulated)', usage: 'cd <section>', fn: (section) => {
                const valid = Object.keys(dirs);
                if (!section) return 'Usage: cd <section>';
                if (!valid.includes(section.replace(/\/$/, ''))) return `No such section: ${section}`;
                if (section.endsWith('/')) section = section.slice(0, -1);
                setCurrentSection(section);
                if (dirs[section] && dirs[section].length === 0) {
                    return `Switched to ${section}/ (empty directory)`;
                }
                return `Switched to ${section}/. Type ls to view contents.`;
            }
        },
        matrix: {
            description: 'Matrix rain animation (easter egg)', usage: 'matrix', fn: () => `\n\nWake up, Neo...\n\n(Imagine green code rain here!)`
        },
        joke: {
            description: 'Tells a random programming joke', usage: 'joke', fn: function () {
                setTimeout(async () => {
                    const output = await fetchProgrammingJoke();
                    if (terminalRef.current) {
                        terminalRef.current.pushToStdout(`\n\n${output}\n\n`);
                    }
                }, 100);
                return 'Fetching a programming joke...';
            }
        }
    };
}

export default function TerminalEmu() {
    const terminalRef = useRef(null);
    const [currentSection, setCurrentSection] = useState('root');
    const commands = getCommands(terminalRef, currentSection, setCurrentSection);

    useEffect(() => {
        // Robust placeholder logic
        let placeholder;
        function updatePlaceholder() {
            const input = document.querySelector('.react-console-emulator__input');
            if (!input) return;
            placeholder = document.getElementById('terminal-placeholder');
            if (!placeholder) {
                placeholder = document.createElement('div');
                placeholder.id = 'terminal-placeholder';
                placeholder.innerText = 'Try: about, skills, projects, contact, ls, help...';
                placeholder.style.position = 'absolute';
                placeholder.style.left = '0.5em';
                placeholder.style.top = '0';
                placeholder.style.height = '100%';
                placeholder.style.display = 'flex';
                placeholder.style.alignItems = 'center';
                placeholder.style.pointerEvents = 'none';
                placeholder.style.color = '#aaa';
                placeholder.style.opacity = '0.4';
                placeholder.style.fontStyle = 'italic';
                placeholder.style.fontSize = '1em';
                placeholder.style.zIndex = '2';
                input.parentElement.style.position = 'relative';
                input.parentElement.appendChild(placeholder);
            }
            placeholder.style.display = input.value === '' ? 'flex' : 'none';
        }
        const observer = new MutationObserver(updatePlaceholder);
        const interval = setInterval(updatePlaceholder, 200);
        setTimeout(updatePlaceholder, 500);
        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center animate-fade-in" style={{ minHeight: '100vh', minWidth: '100vw', transition: 'background 0.5s' }}>
            <div className="w-full h-full flex items-center justify-center">
                <Terminal
                    ref={terminalRef}
                    commands={commands}
                    welcomeMessage={
                        `Welcome to Vijeth's Terminal Portfolio!\n\nType help to get the list of commands.\n\nTry matrix for a surprise!\n\nEnjoy exploring!\n`
                    }
                    promptSymbol={'> '}
                    dangerMode={true}
                    style={{ background: 'black', color: 'lime', fontFamily: 'monospace', width: '100vw', height: '100vh', borderRadius: 0, transition: 'background 0.5s' }}
                />
            </div>
            <style>{`
                                @keyframes fade-in {
                                    from { opacity: 0; }
                                    to { opacity: 1; }
                                }
                                .animate-fade-in {
                                    animation: fade-in 1.2s;
                                }
                                /* Custom styles for react-console-emulator */
                                .react-console-emulator__entry {
                                    color: #38bdf8 !important; /* User input color (cyan) */
                                    font-weight: bold;
                                }
                                .react-console-emulator__entry + .react-console-emulator__result {
                                    margin-top: 2px;
                                    border-left: 2px solid #38bdf8;
                                    padding-left: 0.75em;
                                }
                                .react-console-emulator__result {
                                    color: #aaffaa !important; /* Output color (light green) */
                                }
                                /* Placeholder suggestion styling */
                                #terminal-placeholder {
                                    user-select: none;
                                    transition: opacity 0.2s;
                                }
                        `}</style>
        </div>
    );
}

