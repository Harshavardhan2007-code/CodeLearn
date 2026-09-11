# CodeLearn

An interactive coding education platform built with React and TypeScript. CodeLearn lets you learn programming languages through structured lessons, a built-in code viewer, and hands-on exercises — all in a clean, distraction-free interface with dark and light mode support.

---

## Features

- **12 Programming Languages** — HTML, CSS, JavaScript, Python, Java, TypeScript, C, C++, C#, Go, PHP, and SQL
- **Structured Lessons** — Each language has step-by-step lessons covering core concepts with explanations, syntax examples, and expected output
- **Interactive Exercises** — Multiple-choice quizzes to test your understanding after each topic
- **Code Reference Panel** — Quick-access reference cards for methods, properties, and keywords per language
- **Search** — Instantly search across languages, topics, and lessons
- **User Progress Tracking** — Track lessons completed, exercises done, and your learning streak
- **Dark / Light Mode** — Toggle between a dark ink-charcoal theme and a clean paper-white theme
- **Responsive Design** — Works across desktop and mobile screen sizes

## Languages Covered

| Language   | Category              | Difficulty   | Lessons |
|------------|-----------------------|--------------|---------|
| HTML       | Web Development       | Beginner     | 8       |
| CSS        | Web Development       | Beginner     | 8       |
| JavaScript | Web Development       | Beginner     | 10      |
| Python     | Programming Languages | Beginner     | 13      |
| Java       | Programming Languages | Intermediate | 9       |
| TypeScript | Web Development       | Intermediate | 11      |
| C          | Programming Languages | Advanced     | 12      |
| C++        | Programming Languages | Advanced     | 14      |
| C#         | Programming Languages | Intermediate | 12      |
| Go         | Programming Languages | Intermediate | 10      |
| PHP        | Backend / Database    | Beginner     | 9       |
| SQL        | Backend / Database    | Beginner     | 8       |

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type-safe JavaScript
- **Tailwind CSS v4** — Utility-first styling
- **Vite** — Fast development server and build tool
- **Lucide React** — Icon library

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
codelearn-project/
├── src/
│   ├── main.tsx          # App entry point
│   ├── App.tsx           # Root component
│   ├── CodeLearn.tsx     # Main application (lessons, exercises, navigation)
│   └── index.css         # Global styles
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Screenshots

> Dark mode — language selection, lesson view, exercises, and reference panel all in one seamless experience.

## License

This project is open source and available under the [MIT License](LICENSE).
