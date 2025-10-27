# Vijet's Portfolio: The Terminal Interface

A unique, interactive portfolio built with **React** that simulates a classic command-line interface (CLI). Navigate my projects, skills, and resume by typing simple commands.

## 🚀 Live Demo

🌐 ****

---

## ✨ Features

* **💻 Authentic Terminal Emulation:** Built using `react-console-emulator` for a truly interactive CLI experience.
* **📚 Command History & Navigation:** Use the **Up** and **Down** arrow keys to cycle through past commands.
* **🛠️ Custom Commands:** Dedicated commands to retrieve key portfolio information (e.g., `projects`, `cat`).
* **🤣 API Integration:** Real-time programming jokes and cat images from public APIs.
* **🎨 Zsh-style Autocomplete:** Tab completion with command suggestions as you type.
* **🎯 Smart Input Focus:** Automatic focus on page load for immediate typing.

---

## ⚙️ Technologies Used

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, JavaScript | Core application framework. |
| **Terminal** | `react-console-emulator` | Component for the CLI UI and command handling. |
| **Styling** | TailwindCSS | Customizing the terminal look and feel. |
| **API** | JokeAPI, Cataas.com | Fetching random programming jokes and cat images. |
| **Deployment** | Netlify | Hosting the live application. |

---

## 📋 Commands

Here is a list of commands you can run in the terminal:

| Command | Description | Example |
| :--- | :--- | :--- |
| `help` | Displays a list of all available commands | `help` |
| `about` | Learn about my background and passion | `about` |
| `whoami` | Displays all details **with typewriter animation** | `whoami` |
| `skills` | Showcases technical competencies | `skills` |
| `projects` | Lists key projects with clickable links | `projects` |
| `contact` | Displays email and social media links | `contact` |
| `cat` | Shows a random cat image! 🐱 | `cat`, `cat gif`, `cat says hello` |
| `joke` | Fetches a random programming joke | `joke` |
| `date` | Shows current date and time | `date` |
| `ls` | Lists available sections | `ls` |
| `cd` | Navigate to sections | `cd about` |
| `echo` | Prints the input text | `echo Hello World` |

---

## 📝 Customizing Your Portfolio

All personal information is stored in `src/data/personalInfo.json`. You can easily customize your portfolio by editing this file:

### Available Fields:
- **name**: Your name
- **shortDescription**: Brief intro description
- **fullDescription**: Detailed about section
- **asciiArt**: ASCII art banner (multi-line string)
- **whoami**: Full biographical information with animations
- **skills**: Array of your skills
- **projects**: Array of projects with:
  - `name`: Project name
  - `description`: Project description
  - `githubUrl`: GitHub repository URL
  - `demoUrl`: Optional demo URL
- **contact**: Contact information object
  - `email`: Your email address
  - `linkedin`: LinkedIn profile URL
  - `github`: GitHub profile URL
- **commands**: Command suggestions array

### Example:
```json
{
  "name": "Your Name",
  "skills": ["React", "Node.js", "TypeScript"],
  "projects": [
    {
      "name": "My Project",
      "description": "A cool project",
      "githubUrl": "https://github.com/username/project",
      "demoUrl": "https://project-demo.com"
    }
  ],
  "contact": {
    "email": "your@email.com",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/username"
  }
}
```

---

## 🎨 Features Implemented

✅ **Input Autofocus:** Automatic focus on input field when page loads  
✅ **Zsh-style Autocomplete:** Tab completion and real-time command suggestions  
✅ **JSON Configuration:** Central data management for easy personalization  
✅ **Clickable Links:** All project and contact links open properly in new tabs  
✅ **Animated whoami:** Typewriter animation for biographical info  
✅ **Cat Command:** Fun random cat images powered by [Cataas.com](https://cataas.com/)  
✅ **Improved Styling:** Modern terminal aesthetics with JetBrains Mono font  
✅ **Error Handling:** Graceful handling of all edge cases and undefined values  

---
