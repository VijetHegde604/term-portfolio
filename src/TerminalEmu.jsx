import React, { useRef, useState, useEffect } from 'react';
import Terminal from 'react-console-emulator';
import { fetchProgrammingJoke, fetchCatImage } from './api';
import personalInfo from './data/personalInfo.json';

// Directory-aware commands (cleaned, single definition)
function getCommands(terminalRef, currentSection, setCurrentSection, personalInfo) {
    // Safe accessors with fallbacks
    const safeInfo = personalInfo || {};
    const safeGet = (obj, path, fallback = 'N/A') => {
        try {
            const keys = path.split('.');
            let value = obj;
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    return fallback;
                }
            }
            return value || fallback;
        } catch {
            return fallback;
        }
    };

    const dirs = {
        root: ['about', 'education', 'skills', 'experience', 'projects', 'publications', 'achievements', 'contact', 'resume', 'tour', 'simple', 'play', 'fastfetch', 'neofetch', 'cat', 'matrix', 'joke'],
        about: [], education: [], skills: [], experience: [], projects: [], publications: [], achievements: [], contact: [], resume: [], tour: [], simple: [], play: [], fastfetch: [], neofetch: [], cat: [], matrix: [], joke: [],
    };
    function getLs(section) {
        if (dirs[section]) return dirs[section].map(x => x + (dirs[x] && dirs[x].length ? '/' : '')).join('  ') || '(empty)';
        return '(empty)';
    }
    const link = (href, label = href) => `<a href="${href}" target="_blank">${label}</a>`;
    const list = (items = []) => items.map(item => `• ${item}`).join('\n');
    const section = (title, body) => `<span class="term-heading">${title}</span>\n${body}`;
    const aboutFn = () => section('About', safeGet(safeInfo, 'fullDescription', 'About section'));
    const educationFn = () => {
        const education = safeGet(safeInfo, 'education', []);
        return section('Education', education.map(item => `• <strong>${item.institution}</strong>, ${item.location} — ${item.degree} (${item.period})${item.details ? `\n  ${item.details}` : ''}`).join('\n\n'));
    };
    const skillsFn = () => {
        const groups = safeGet(safeInfo, 'skillGroups', []);
        if (Array.isArray(groups) && groups.length) {
            return section('Skills', groups.map(group => `• <strong>${group.category}</strong>: ${group.items.join(', ')}`).join('\n'));
        }
        const skills = safeGet(safeInfo, 'skills', []);
        const skillsArray = Array.isArray(skills) ? skills : [];
        return section('Skills', skillsArray.map(skill => `• ${skill}`).join('\n'));
    };
    const experienceFn = () => {
        const experience = safeGet(safeInfo, 'experience', []);
        return section('Experience', experience.map(job => `<strong>${job.company}</strong> — ${job.role} (${job.period})\n${list(job.highlights)}`).join('\n\n'));
    };
    const projectsFn = () => {
        const projects = safeGet(safeInfo, 'projects', []);
        const projectsArray = Array.isArray(projects) ? projects : [];
        return section('Projects', projectsArray.map(project => {
            const name = project?.name || 'Untitled Project';
            const githubUrl = project?.githubUrl || '#';
            const tech = project?.techStack?.length ? `\n  Tech: ${project.techStack.join(', ')}` : '';
            const bullets = project?.highlights?.length ? `\n${project.highlights.map(point => `  - ${point}`).join('\n')}` : '';
            const demo = project?.demoUrl ? ` | ${link(project.demoUrl, 'Demo')}` : '';
            return `<strong>${name}</strong> (${project.date || 'Current'})\n  ${project.description || ''}${bullets}${tech}\n  ${link(githubUrl, 'GitHub')}${demo}`;
        }).join('\n\n'));
    };
    const publicationsFn = () => section('Publications', safeGet(safeInfo, 'publications', []).map(pub => `• <strong>${pub.title}</strong> — ${pub.venue}, ${pub.date}\n  DOI: ${pub.doi}`).join('\n\n'));
    const achievementsFn = () => section('Achievements', list(safeGet(safeInfo, 'achievements', [])));
    const contactFn = () => {
        const email = safeGet(safeInfo, 'contact.email', 'N/A');
        const linkedin = safeGet(safeInfo, 'contact.linkedin', '#');
        const github = safeGet(safeInfo, 'contact.github', '#');
        const phone = safeGet(safeInfo, 'contact.phone', 'N/A');
        return section('Contact', `• Email: <a href="mailto:${email}">${email}</a>\n• Phone: ${phone}\n• LinkedIn: ${link(linkedin, 'linkedin.com/in/vijeth-hegde')}\n• GitHub: ${link(github, 'github.com/VijetHegde604')}`);
    };
    const friendlyTourFn = () => `<div class="friendly-card">
  <div class="friendly-kicker">Not a terminal person? Start here ✨</div>
  <div class="friendly-title">Pick a path and type the highlighted word.</div>
  <div class="friendly-grid">
    <div><strong>👋 Meet me</strong><code>simple</code><span>A plain-English intro without tech overload.</span></div>
    <div><strong>🧭 Quick snapshot</strong><code>fastfetch</code><span>A beautiful dashboard-style summary.</span></div>
    <div><strong>🛠️ What I build</strong><code>projects</code><span>Real apps, ML ideas, and developer tooling.</span></div>
    <div><strong>🎈 Have fun</strong><code>play</code><span>Try a tiny easter egg and a few friendly prompts.</span></div>
  </div>
</div>`;
    const simpleFn = () => `<div class="friendly-card friendly-card--warm">
  <div class="friendly-kicker">Plain-English version</div>
  <div class="friendly-title">I build useful software that feels fast, reliable, and easy to use.</div>
  <p>Think of me as someone who connects the visible app people click with the invisible systems that store data, answer requests, and make smart features work.</p>
  <div class="friendly-grid">
    <div><strong>🌐 Web apps</strong><span>Interfaces people can use comfortably.</span></div>
    <div><strong>⚙️ Backends</strong><span>The engine room that keeps apps running.</span></div>
    <div><strong>🤖 AI/ML</strong><span>Features that recognize, classify, or recommend.</span></div>
    <div><strong>🐧 Linux/dev tools</strong><span>Clean setups that make development smoother.</span></div>
  </div>
</div>`;
    const playFn = () => `<div class="friendly-card playful-card">
  <div class="friendly-kicker">Achievement unlocked 🕹️</div>
  <div class="friendly-title">You found the playful corner.</div>
  <p>Try <code>cat</code>, <code>cat says hire Vijet</code>, <code>joke</code>, or <code>matrix</code>. If you are short on time, type <code>contact</code> and say hello.</p>
  <pre>   (づ｡◕‿‿◕｡)づ  thanks for exploring!</pre>
</div>`;
    const fastfetchFn = () => {
        const skills = safeGet(safeInfo, 'skills', []);
        const skillGroups = safeGet(safeInfo, 'skillGroups', []);
        const projects = safeGet(safeInfo, 'projects', []);
        const education = safeGet(safeInfo, 'education.0.degree', 'Computer Science');
        const firstName = safeGet(safeInfo, 'name', 'Developer').split(' ')[0];
        const stackLine = Array.isArray(skillGroups) && skillGroups.length
            ? skillGroups.slice(0, 3).map(group => `${group.category}: ${group.items.slice(0, 4).join(', ')}`).join(' · ')
            : Array.isArray(skills) ? skills.slice(0, 8).join(' · ') : 'React · APIs · Linux';
        const projectLine = Array.isArray(projects) ? projects.map(project => project.name).slice(0, 3).join(' / ') : 'Portfolio';
        const highlights = [
            ['Role', safeGet(safeInfo, 'title', 'Engineer')],
            ['Location', safeGet(safeInfo, 'location', 'Earth')],
            ['Education', education],
            ['Stack', stackLine],
            ['Projects', projectLine],
            ['Contact', safeGet(safeInfo, 'contact.email', 'N/A')]
        ];

        const logo = String.raw`__   __ _  _
\ \ / /| || |   ${firstName.toLowerCase()}@portfolio
 \   / | __ |   ─────────────────────
  \_/  |_||_|   uptime  building useful software
      ▄████▄     shell   portfolio.sh
     ██▀  ▀██    theme   aurora glass + CRT glow
     ██▄▄▄▄██    status  open to great teams
      ▀████▀`;

        return `<div class="fastfetch-card">
<pre class="fastfetch-logo">${logo}</pre>
<div class="fastfetch-info">
  ${highlights.map(([label, value]) => `<div><span>${label}</span><p>${value}</p></div>`).join('')}
  <div class="fastfetch-palette" aria-label="terminal color palette"><i></i><i></i><i></i><i></i><i></i><i></i></div>
</div>
</div>`;
    };
    const whoamiText = safeGet(safeInfo, 'whoami', 'Personal information');
    const whoamiFn = function () {
        const id = `whoami-anim-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const text = whoamiText;

        // Try multiple times to find the element
        let attempts = 0;
        const maxAttempts = 50;

        const tryAnimate = () => {
            const el = document.getElementById(id);
            if (!el) {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(tryAnimate, 50);
                } else {
                    // Fallback: just show the text without animation
                    const fallbackEl = document.getElementById(id);
                    if (fallbackEl) {
                        fallbackEl.innerHTML = text.replace(/\n/g, '<br>');
                    }
                }
                return;
            }

            // Element found, start animation
            let i = 0;
            let cursorVisible = true;
            let isAnimating = true;

            function getDelay(char) {
                if (char === '\n') return 180 + Math.random() * 60;
                if (/[.,!?]/.test(char)) return 120 + Math.random() * 60;
                if (char === ' ') return 30 + Math.random() * 30;
                return 14 + Math.random() * 22;
            }

            function type() {
                const currentEl = document.getElementById(id);
                if (!currentEl || !isAnimating) return;

                if (i <= text.length) {
                    currentEl.innerHTML = text.slice(0, i).replace(/\n/g, '<br>') + `<span style='color:#38bdf8;font-weight:bold;'>${cursorVisible ? '▍' : '&nbsp;'}</span>`;
                    let delay = getDelay(text[i - 1] || '');
                    i++;
                    setTimeout(type, delay);
                } else {
                    // After typing, keep blinking the cursor for a while
                    let blinkCount = 0;
                    function blink() {
                        const blinkEl = document.getElementById(id);
                        if (!blinkEl || !isAnimating) return;

                        cursorVisible = !cursorVisible;
                        blinkEl.innerHTML = text.replace(/\n/g, '<br>') + `<span style='color:#38bdf8;font-weight:bold;'>${cursorVisible ? '▍' : '&nbsp;'}</span>`;
                        blinkCount++;
                        if (blinkCount < 16) setTimeout(blink, 350);
                        else blinkEl.innerHTML = text.replace(/\n/g, '<br>');
                        isAnimating = false;
                    }
                    setTimeout(blink, 350);
                }
            }

            type();
        };

        setTimeout(tryAnimate, 50);

        return `<span id='${id}' style='display: block; min-height: 1.5em;'>Loading...</span>`;
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
        education: {
            description: 'Show education details',
            usage: 'education',
            fn: educationFn
        },
        skills: {
            description: 'List of my skills by category',
            usage: 'skills',
            fn: skillsFn
        },
        experience: {
            description: 'Show professional experience',
            usage: 'experience',
            fn: experienceFn
        },
        projects: {
            description: 'Showcase my projects',
            usage: 'projects',
            fn: projectsFn
        },
        contact: {
            description: 'Contact information',
            usage: 'contact',
            fn: contactFn
        },


        publications: {
            description: 'Show publications',
            usage: 'publications',
            fn: publicationsFn
        },
        achievements: {
            description: 'Show achievements',
            usage: 'achievements',
            fn: achievementsFn
        },
        resume: {
            description: 'Show a concise resume overview',
            usage: 'resume',
            fn: () => [aboutFn(), educationFn(), skillsFn(), experienceFn(), projectsFn(), publicationsFn(), achievementsFn(), contactFn()].join('\n\n')
        },
        tour: {
            description: 'Friendly guide for non-technical visitors', usage: 'tour', fn: friendlyTourFn
        },
        simple: {
            description: 'Plain-English overview of what I do', usage: 'simple', fn: simpleFn
        },
        play: {
            description: 'Playful easter eggs and fun prompts', usage: 'play', fn: playFn
        },
        fastfetch: {
            description: 'Beautiful system-style portfolio summary', usage: 'fastfetch', fn: fastfetchFn
        },
        neofetch: {
            description: 'Alias for fastfetch', usage: 'neofetch', fn: fastfetchFn
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
        },
        cat: {
            description: 'Display a random cat - Usage: cat, cat gif, cat says [text]',
            usage: 'cat [options]',
            fn: async function (...args) {
                try {
                    const command = args.join(' ').toLowerCase();
                    let options = { width: 360, height: 260, fontSize: 32 };

                    // Parse command arguments
                    if (command.includes('gif')) {
                        options.type = 'gif';
                    }

                    if (command.includes('says')) {
                        const textMatch = command.match(/says\s+(.+)/);
                        if (textMatch) {
                            options.text = textMatch[1];
                        }
                    }

                    if (command.match(/^(orange|cute|fluffy|sleep|happy|grumpy|fat|small)/)) {
                        const tagMatch = command.match(/^(orange|cute|fluffy|sleep|happy|grumpy|fat|small)/);
                        if (tagMatch) {
                            options.tag = tagMatch[1];
                        }
                    }

                    const catUrl = await fetchCatImage(options);

                    if (catUrl) {
                        return `<figure class="cat-frame"><img class="cat-image" src="${catUrl}" alt="Random Cat" onerror="this.onerror=null; this.parentElement.innerHTML='❌ Failed to load cat image. Try again!';" /><figcaption>🐾 Tiny serotonin packet delivered. Try <code>cat says hello</code> too!</figcaption></figure>`;
                    } else {
                        return '❌ Could not fetch cat image. Please try again!';
                    }
                } catch (e) {
                    return `❌ Error: ${e.message}`;
                }
            }
        }
    };
}

export default function TerminalEmu() {
    const terminalRef = useRef(null);
    const [currentSection, setCurrentSection] = useState('root');
    const commands = getCommands(terminalRef, currentSection, setCurrentSection, personalInfo);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Autofocus input on page load
    useEffect(() => {
        const focusInput = () => {
            // Try multiple selectors
            const selectors = [
                '.react-console-emulator__input',
                'textarea',
                'input[type="text"]',
                '[contenteditable="true"]'
            ];

            for (const selector of selectors) {
                const input = document.querySelector(selector);
                if (input && input.focus) {
                    try {
                        input.focus();
                        break;
                    } catch (e) {
                        console.warn('Could not focus input:', e);
                    }
                }
            }
        };

        // Try multiple times to ensure it works after terminal initialization
        const timeouts = [
            setTimeout(focusInput, 100),
            setTimeout(focusInput, 300),
            setTimeout(focusInput, 600),
            setTimeout(focusInput, 1000),
            setTimeout(focusInput, 2000)
        ];

        focusInput(); // Try immediately

        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, []);

    // Autocomplete functionality
    useEffect(() => {
        const commandList = Object.keys(commands);
        let lastValue = '';

        function updateSuggestions() {
            const input = document.querySelector('.react-console-emulator__input') ||
                document.querySelector('textarea') ||
                document.querySelector('input[type="text"]') ||
                document.querySelector('[contenteditable="true"]');
            if (!input) return;

            const currentValue = (input.value || input.textContent || '').trim();

            // Only update if value changed
            if (currentValue === lastValue) return;
            lastValue = currentValue;

            if (currentValue === '') {
                setShowSuggestions(false);
                setSuggestions([]);
                return;
            }

            // Filter commands that start with the current input
            const filtered = commandList.filter(cmd =>
                cmd.toLowerCase().startsWith(currentValue.toLowerCase()) &&
                cmd !== currentValue
            );

            setSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
            setShowSuggestions(filtered.length > 0);
        }

        function handleTabCompletion(e) {
            if (e.key !== 'Tab') return;

            const input = document.querySelector('.react-console-emulator__input') ||
                document.querySelector('textarea') ||
                document.querySelector('input[type="text"]') ||
                document.querySelector('[contenteditable="true"]');
            if (!input) return;

            const currentValue = (input.value || input.textContent || '').trim();

            if (currentValue && suggestions.length > 0) {
                e.preventDefault();
                const firstSuggestion = suggestions[0];

                // Set the input value to the completed command
                if (input.value !== undefined) {
                    input.value = firstSuggestion;
                } else if (input.textContent !== undefined) {
                    input.textContent = firstSuggestion;
                }

                // Dispatch events to notify React
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));

                // Hide suggestions after completion
                setShowSuggestions(false);
                setSuggestions([]);
            }
        }

        const interval = setInterval(updateSuggestions, 100);
        const handleInput = () => updateSuggestions();
        const handleKeyup = () => updateSuggestions();
        const handleKeydown = (e) => handleTabCompletion(e);

        document.addEventListener('input', handleInput);
        document.addEventListener('keyup', handleKeyup);
        document.addEventListener('keydown', handleKeydown);

        setTimeout(updateSuggestions, 500);

        return () => {
            clearInterval(interval);
            document.removeEventListener('input', handleInput);
            document.removeEventListener('keyup', handleKeyup);
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [commands, suggestions]);

    // Handle link clicks in terminal output
    useEffect(() => {
        const handleClick = (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const url = link.getAttribute('href');
                // Only prevent default if it's not a protocol link (has://)
                if (url && url.includes('://')) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                } else if (url && url.startsWith('mailto:')) {
                    window.location.href = url;
                }
            }
        };

        const container = document.querySelector('.react-console-emulator');
        if (container) {
            container.addEventListener('click', handleClick);
            return () => container.removeEventListener('click', handleClick);
        }
    }, []);

    return (
        <div className="terminal-shell fixed inset-0 flex items-center justify-center animate-fade-in" style={{ minHeight: '100vh', minWidth: '100vw', transition: 'background 0.5s' }}>
            <div className="terminal-orb terminal-orb--cyan" aria-hidden="true" />
            <div className="terminal-orb terminal-orb--violet" aria-hidden="true" />
            <div className="terminal-scanline" aria-hidden="true" />
            <div className="w-full h-full flex items-center justify-center relative z-10">
                <Terminal
                    ref={terminalRef}
                    commands={commands}
                    autoFocus={true}
                    welcomeMessage={
                        `╭─ ${personalInfo?.name || 'Developer'} · Terminal Portfolio\n│  ${personalInfo?.shortDescription || ''}\n╰─ Type 'help' for commands or 'resume' for the full overview.\n\nNew here? type tour · simple · fastfetch · projects · cat\n`
                    }
                    promptSymbol={'> '}
                    dangerMode={true}
                    style={{ background: 'rgba(2, 6, 23, 0.92)', color: '#bbf7d0', fontFamily: 'monospace', width: 'min(1120px, calc(100vw - 32px))', height: 'min(760px, calc(100vh - 32px))', borderRadius: 18, border: '1px solid rgba(56, 189, 248, 0.35)', boxShadow: '0 28px 90px rgba(0,0,0,.55), 0 0 60px rgba(56,189,248,.16)', transition: 'background 0.5s' }}
                />
                {/* Autocomplete suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                    <div
                        id="autocomplete-suggestions"
                        style={{
                            position: 'absolute',
                            bottom: '60px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#1a1a1a',
                            border: '1px solid #38bdf8',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            maxWidth: '400px',
                            zIndex: 1000,
                            fontFamily: 'monospace',
                            fontSize: '13px',
                        }}
                    >
                        <div style={{ color: '#888', marginBottom: '4px', fontSize: '11px' }}>
                            Suggestions (press Tab to complete):
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {suggestions.map((suggestion, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        color: idx === 0 ? '#fff' : '#38bdf8',
                                        padding: '4px 8px',
                                        borderRadius: '3px',
                                        background: idx === 0 ? '#38bdf8' : '#0a1729',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: idx === 0 ? '1px solid #7dd3fc' : '1px solid transparent',
                                        boxShadow: idx === 0 ? '0 0 8px rgba(56, 189, 248, 0.4)' : 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#38bdf8';
                                        e.target.style.color = '#000';
                                        e.target.style.borderColor = '#38bdf8';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = idx === 0 ? '#38bdf8' : '#0a1729';
                                        e.target.style.color = idx === 0 ? '#fff' : '#38bdf8';
                                        e.target.style.borderColor = idx === 0 ? '#7dd3fc' : 'transparent';
                                    }}
                                    onClick={() => {
                                        const input = document.querySelector('.react-console-emulator__input');
                                        if (input) {
                                            input.value = suggestion;
                                            input.dispatchEvent(new Event('input', { bubbles: true }));
                                        }
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {suggestion}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                                @keyframes fade-in {
                                    from { opacity: 0; }
                                    to { opacity: 1; }
                                }
                                .animate-fade-in {
                    animation: fade-in 0.8s ease-in-out;
                                }
                
                                /* Custom styles for react-console-emulator */
                .react-console-emulator {
                    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
                }
                
                                .react-console-emulator__entry {
                    color: #38bdf8 !important;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                                }
                
                                .react-console-emulator__entry + .react-console-emulator__result {
                    margin-top: 4px;
                    border-left: 3px solid #38bdf8;
                    padding-left: 1em;
                    background: linear-gradient(90deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%);
                }
                
                                .react-console-emulator__result {
                    color: #aaffaa !important;
                    line-height: 1.6;
                }
                
                .react-console-emulator__result a {
                    color: #38bdf8 !important;
                    cursor: pointer !important;
                    text-decoration: none !important;
                    border-bottom: 1px solid #38bdf8;
                    transition: all 0.2s ease !important;
                }
                
                .react-console-emulator__result a:hover {
                    color: #7dd3fc !important;
                    border-bottom-color: #7dd3fc;
                    background: rgba(56, 189, 248, 0.1);
                    padding: 2px 4px;
                    border-radius: 2px;
                }
                
                /* Autocomplete styling */
                #autocomplete-suggestions {
                    animation: slideUp 0.2s ease-out;
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                
                /* Scrollbar styling */
                ::-webkit-scrollbar {
                    width: 10px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #1a1a1a;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #38bdf8;
                    border-radius: 5px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #7dd3fc;
                }
                
                /* Cat image styling */
                .react-console-emulator__result img,
                .react-console-emulator__result div img {
                    max-width: min(100%, 400px) !important;
                    max-height: 320px !important;
                    width: auto !important;
                    height: auto !important;
                    object-fit: contain !important;
                    border: 3px solid #38bdf8 !important;
                    border-radius: 8px !important;
                    margin: 20px auto !important;
                    box-shadow: 0 0 25px rgba(56, 189, 248, 0.4) !important;
                    animation: catAppear 0.6s ease-out !important;
                    display: block !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                }
                
                @keyframes catAppear {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
