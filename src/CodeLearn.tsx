import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Code2, Search, Menu, X, Sun, Moon, ChevronRight, ChevronLeft,
  Play, RotateCcw, Copy, Check, User, LogOut, Flame, BookOpen,
  Award, ArrowRight, CheckCircle2, XCircle, Circle, Terminal,
  Github, Twitter, Layers, FileCode, Braces, Hash, ListChecks,
} from "lucide-react";

/* =========================================================================
   DESIGN TOKENS
   Ink-charcoal base (not pure black) with a warm amber accent for primary
   actions and a cool cyan for secondary / "in progress" states. Light mode
   uses a paper-white background rather than cream. Code blocks are the one
   place monospace earns its keep. Radius is used with intent: generous on
   hero surfaces, tight on utility chrome.
   ========================================================================= */

const palette = {
  dark: {
    bg: "#12141B",
    bgRaised: "#181B24",
    bgSunken: "#0D0F15",
    border: "#262A36",
    text: "#E7E9EE",
    textMuted: "#9096A6",
    textFaint: "#5C6274",
  },
  light: {
    bg: "#FBFAF8",
    bgRaised: "#FFFFFF",
    bgSunken: "#F1F0EC",
    border: "#E4E2DB",
    text: "#1B1C22",
    textMuted: "#5B5D68",
    textFaint: "#8B8D97",
  },
  amber: "#F0A93C",
  amberDark: "#C77F16",
  cyan: "#3FC1D0",
  green: "#5FB57B",
  red: "#E2685B",
};

function useTheme() {
  const [isDark, setIsDark] = useState(true);
  const c = isDark ? palette.dark : palette.light;
  return { isDark, setIsDark, c };
}

/* =========================================================================
   MOCK DATA
   ========================================================================= */

const LANGUAGES = [
  { id: "html", name: "HTML", full: "HyperText Markup Language", desc: "The markup that gives every web page its structure.", difficulty: "Beginner", lessons: 8, active: true, category: "Web Development", color: "#E2685B" },
  { id: "css", name: "CSS", full: "Cascading Style Sheets", desc: "Style layouts, color, type, and motion on the web.", difficulty: "Beginner", lessons: 8, active: true, category: "Web Development", color: "#3FC1D0" },
  { id: "javascript", name: "JavaScript", full: "The language of the browser", desc: "Add logic and interactivity to any web page.", difficulty: "Beginner", lessons: 10, active: true, category: "Web Development", color: "#F0A93C" },
  { id: "python", name: "Python", full: "Readable, general-purpose programming", desc: "A clean syntax that's often a first language.", difficulty: "Beginner", lessons: 13, active: true, category: "Programming Languages", color: "#5FB57B" },
  { id: "java", name: "Java", full: "Class-based, object-oriented programming", desc: "Widely used for backend systems and Android.", difficulty: "Intermediate", lessons: 9, active: true, category: "Programming Languages", color: "#C77F16" },
  { id: "typescript", name: "TypeScript", full: "JavaScript with static types", desc: "Catch mistakes before your code ever runs.", difficulty: "Intermediate", lessons: 11, active: false, category: "Web Development", color: "#4E7FD1" },
  { id: "c", name: "C", full: "Low-level systems programming", desc: "Understand memory and how computers really work.", difficulty: "Advanced", lessons: 12, active: false, category: "Programming Languages", color: "#8790A6" },
  { id: "cpp", name: "C++", full: "C with objects and more control", desc: "Performance-critical software and game engines.", difficulty: "Advanced", lessons: 14, active: false, category: "Programming Languages", color: "#6A7FDB" },
  { id: "csharp", name: "C#", full: "Microsoft's object-oriented language", desc: "Build apps, games, and services on .NET.", difficulty: "Intermediate", lessons: 12, active: false, category: "Programming Languages", color: "#8B5FBF" },
  { id: "go", name: "Go", full: "Simple, fast, and built for concurrency", desc: "A modern language for servers and tools.", difficulty: "Intermediate", lessons: 10, active: false, category: "Programming Languages", color: "#3FC1D0" },
  { id: "php", name: "PHP", full: "A language built for the web", desc: "Still powers a huge share of the web's backends.", difficulty: "Beginner", lessons: 9, active: false, category: "Backend / Database", color: "#7C7FDB" },
  { id: "sql", name: "SQL", full: "Structured Query Language", desc: "Ask questions of a database and get answers back.", difficulty: "Beginner", lessons: 8, active: false, category: "Backend / Database", color: "#E2685B" },
];

const CATEGORIES = ["Web Development", "Programming Languages", "Backend / Database"];

const TOPICS = {
  html: ["Introduction", "Elements", "Attributes", "Headings & Paragraphs", "Links", "Images", "Lists", "Forms"],
  css: ["Introduction", "Selectors", "Colors", "Box Model", "Flexbox", "Grid", "Typography", "Responsive Design"],
  javascript: ["Introduction", "Variables", "Data Types", "Operators", "Functions", "Conditionals", "Loops", "Arrays", "Objects", "DOM Basics"],
  python: ["Introduction", "Syntax", "Variables", "Data Types", "Numbers", "Strings", "Lists", "Tuples", "Dictionaries", "Conditions", "Loops", "Functions", "Classes"],
  java: ["Introduction", "Syntax", "Variables", "Data Types", "Operators", "Conditionals", "Loops", "Methods", "Classes & Objects"],
};

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Lesson content: languageId -> slug -> { title, explanation, syntax, code, output }
const LESSONS = {
  python: {
    introduction: {
      title: "Python Introduction",
      explanation: "Python is a general-purpose language known for code that reads almost like plain English. It's used for web backends, data analysis, automation, and as a first language for many new programmers.",
      syntax: "print(\"Hello, World!\")",
      code: `print("Hello, World!")\nprint("Learning Python one step at a time.")`,
      output: "Hello, World!\nLearning Python one step at a time.",
    },
    syntax: {
      title: "Python Syntax",
      explanation: "Python uses indentation, not curly braces, to group statements. A colon starts a new block, and every line inside that block must be indented by the same amount.",
      syntax: "if condition:\n    # indented block",
      code: `age = 20\nif age >= 18:\n    print("You can vote")\nelse:\n    print("Not yet")`,
      output: "You can vote",
    },
    variables: {
      title: "Python Variables",
      explanation: "Variables are used to store data values. Python has no command for declaring a variable — it's created the moment you first assign a value to it.",
      syntax: "variable_name = value",
      code: `name = "John"\nage = 25\n\nprint(name)\nprint(age)`,
      output: "John\n25",
    },
    "data-types": {
      title: "Python Data Types",
      explanation: "Every value in Python has a type. Common built-in types include str for text, int and float for numbers, bool for true/false, and list, tuple, and dict for collections.",
      syntax: "type(value)",
      code: `name = "Ada"\nage = 36\nheight = 1.7\nis_coder = True\n\nprint(type(name), type(age), type(height), type(is_coder))`,
      output: "<class 'str'> <class 'int'> <class 'float'> <class 'bool'>",
    },
    numbers: {
      title: "Python Numbers",
      explanation: "Python supports integers, floating-point numbers, and complex numbers. Arithmetic works the way you'd expect, with ** for exponents and // for floor division.",
      syntax: "a + b, a - b, a * b, a / b, a ** b",
      code: `x = 10\ny = 3\n\nprint(x + y)\nprint(x // y)\nprint(x ** 2)`,
      output: "13\n3\n100",
    },
    strings: {
      title: "Python Strings",
      explanation: "Strings are sequences of characters wrapped in single or double quotes. You can slice them, join them, and format them with f-strings.",
      syntax: "f\"{value}\"",
      code: `first = "Ada"\nlast = "Lovelace"\n\nfull = f"{first} {last}"\nprint(full.upper())`,
      output: "ADA LOVELACE",
    },
    lists: {
      title: "Python Lists",
      explanation: "A list is an ordered, changeable collection that can hold items of different types. Lists are written with square brackets.",
      syntax: "my_list = [item1, item2, item3]",
      code: `fruits = ["apple", "banana", "cherry"]\nfruits.append("mango")\n\nprint(fruits)\nprint(fruits[1])`,
      output: "['apple', 'banana', 'cherry', 'mango']\nbanana",
    },
    tuples: {
      title: "Python Tuples",
      explanation: "A tuple is like a list, but once created it cannot be changed. Tuples are written with round brackets and are useful for fixed collections of values.",
      syntax: "my_tuple = (item1, item2)",
      code: `point = (10, 20)\nx, y = point\n\nprint(x)\nprint(y)`,
      output: "10\n20",
    },
    dictionaries: {
      title: "Python Dictionaries",
      explanation: "A dictionary stores data as key-value pairs. Keys must be unique, and you look up a value using its key rather than a numeric position.",
      syntax: "my_dict = {key: value}",
      code: `student = {"name": "Ada", "age": 36}\nstudent["age"] = 37\n\nprint(student["name"], student["age"])`,
      output: "Ada 37",
    },
    conditions: {
      title: "Python Conditions",
      explanation: "Conditional statements let a program make decisions. Python uses if, elif, and else to run different code depending on a condition.",
      syntax: "if condition:\n    ...\nelif other:\n    ...\nelse:\n    ...",
      code: `temp = 15\nif temp > 25:\n    print("Warm")\nelif temp > 10:\n    print("Mild")\nelse:\n    print("Cold")`,
      output: "Mild",
    },
    loops: {
      title: "Python Loops",
      explanation: "Loops let you repeat a block of code. A for loop iterates over a sequence, while a while loop repeats as long as a condition stays true.",
      syntax: "for item in sequence:\n    ...",
      code: `for i in range(3):\n    print(f"Lesson {i + 1}")`,
      output: "Lesson 1\nLesson 2\nLesson 3",
    },
    functions: {
      title: "Python Functions",
      explanation: "A function is a reusable block of code that only runs when it's called. You can pass data into it as parameters and get data back with return.",
      syntax: "def function_name(parameters):\n    return value",
      code: `def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Ada"))`,
      output: "Hello, Ada!",
    },
    classes: {
      title: "Python Classes",
      explanation: "A class is a blueprint for creating objects that bundle data and behavior together. Python classes use the __init__ method to set up a new object.",
      syntax: "class ClassName:\n    def __init__(self, ...):\n        ...",
      code: `class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        return f"{self.name} says woof!"\n\nd = Dog("Rex")\nprint(d.bark())`,
      output: "Rex says woof!",
    },
  },
  javascript: {
    introduction: {
      title: "JavaScript Introduction",
      explanation: "JavaScript is the language that runs in every web browser. It lets you react to clicks, update the page without reloading, and talk to servers.",
      syntax: "console.log(\"message\")",
      code: `console.log("Hello, World!");\nconsole.log("JavaScript runs in the browser.");`,
      output: "Hello, World!\nJavaScript runs in the browser.",
    },
    variables: {
      title: "JavaScript Variables",
      explanation: "Variables store values so you can reuse or update them later. Modern JavaScript prefers let for values that change and const for values that don't.",
      syntax: "let name = value;\nconst name = value;",
      code: `let score = 10;\nconst playerName = "Maya";\n\nscore = score + 5;\nconsole.log(playerName, score);`,
      output: "Maya 15",
    },
    "data-types": {
      title: "JavaScript Data Types",
      explanation: "JavaScript has a handful of primitive types — string, number, boolean, undefined, and null — plus object types like arrays and objects.",
      syntax: "typeof value",
      code: `let a = "text";\nlet b = 42;\nlet c = true;\n\nconsole.log(typeof a, typeof b, typeof c);`,
      output: "string number boolean",
    },
    operators: {
      title: "JavaScript Operators",
      explanation: "Operators combine values. Arithmetic operators do math, comparison operators compare values, and logical operators combine true/false results.",
      syntax: "a + b, a === b, a && b",
      code: `let x = 8;\nlet y = 3;\n\nconsole.log(x % y);\nconsole.log(x > y && y > 0);`,
      output: "2\ntrue",
    },
    functions: {
      title: "JavaScript Functions",
      explanation: "Functions group reusable logic. You can define them with the function keyword or as an arrow function, a shorter modern syntax.",
      syntax: "const name = (params) => { return value; }",
      code: `const add = (a, b) => a + b;\n\nconsole.log(add(4, 7));`,
      output: "11",
    },
    conditionals: {
      title: "JavaScript Conditionals",
      explanation: "if, else if, and else let your program branch based on a condition, running only the block whose condition is true.",
      syntax: "if (condition) { ... } else { ... }",
      code: `const hour = 14;\nif (hour < 12) {\n  console.log("Morning");\n} else {\n  console.log("Afternoon");\n}`,
      output: "Afternoon",
    },
    loops: {
      title: "JavaScript Loops",
      explanation: "Loops repeat code. A for loop is common when you know how many times to repeat, while a for...of loop is handy for arrays.",
      syntax: "for (let i = 0; i < n; i++) { ... }",
      code: `const colors = ["red", "green", "blue"];\nfor (const color of colors) {\n  console.log(color);\n}`,
      output: "red\ngreen\nblue",
    },
    arrays: {
      title: "JavaScript Arrays",
      explanation: "An array holds an ordered list of values. Arrays come with built-in methods like map, filter, and push for working with their contents.",
      syntax: "const arr = [item1, item2];",
      code: `const nums = [1, 2, 3, 4];\nconst doubled = nums.map(n => n * 2);\n\nconsole.log(doubled);`,
      output: "[ 2, 4, 6, 8 ]",
    },
    objects: {
      title: "JavaScript Objects",
      explanation: "An object stores related data as key-value pairs. You access a property with dot notation or square brackets.",
      syntax: "const obj = { key: value };",
      code: `const user = { name: "Sam", age: 29 };\nuser.age += 1;\n\nconsole.log(user.name, user.age);`,
      output: "Sam 30",
    },
    "dom-basics": {
      title: "JavaScript DOM Basics",
      explanation: "The DOM is the browser's live representation of a page. JavaScript can select elements and change their text, style, or structure.",
      syntax: "document.querySelector(\"selector\")",
      code: `// In a browser:\nconst title = document.querySelector("h1");\ntitle.textContent = "Updated!";`,
      output: "(Updates the page's heading text)",
    },
  },
  html: {
    introduction: {
      title: "HTML Introduction",
      explanation: "HTML describes the structure of a web page using elements. Every element is written with a tag, and most tags come in opening and closing pairs.",
      syntax: "<tagname>content</tagname>",
      code: `<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>`,
      output: "Renders a page with the heading \"Hello, World!\"",
    },
    elements: {
      title: "HTML Elements",
      explanation: "An HTML element usually consists of a start tag, content, and an end tag. Some elements, like <img>, are self-closing and have no content between tags.",
      syntax: "<p>Some text</p>",
      code: `<h2>About Me</h2>\n<p>I'm learning HTML on CodeLearn.</p>`,
      output: "Shows a heading followed by a paragraph",
    },
    attributes: {
      title: "HTML Attributes",
      explanation: "Attributes provide extra information about an element and are written inside the opening tag as name/value pairs.",
      syntax: "<tag attribute=\"value\">",
      code: `<a href="https://example.com" target="_blank">Visit site</a>`,
      output: "A link labeled \"Visit site\" that opens in a new tab",
    },
    "headings-paragraphs": {
      title: "Headings & Paragraphs",
      explanation: "HTML offers six levels of headings, <h1> through <h6>, and the <p> tag for regular paragraphs of text.",
      syntax: "<h1>...</h1>\n<p>...</p>",
      code: `<h1>Main Title</h1>\n<h2>Subheading</h2>\n<p>Body copy goes here.</p>`,
      output: "A large title, a smaller subheading, and a paragraph",
    },
    links: {
      title: "HTML Links",
      explanation: "The <a> tag creates a hyperlink. The href attribute sets the destination the link points to.",
      syntax: "<a href=\"url\">link text</a>",
      code: `<a href="/languages">Browse Languages</a>`,
      output: "A clickable link that reads \"Browse Languages\"",
    },
    images: {
      title: "HTML Images",
      explanation: "The <img> tag embeds an image. It has no closing tag and requires a src attribute pointing to the image file.",
      syntax: "<img src=\"path\" alt=\"description\">",
      code: `<img src="logo.png" alt="CodeLearn logo" width="120">`,
      output: "Displays the image at 120px wide",
    },
    lists: {
      title: "HTML Lists",
      explanation: "Unordered lists (<ul>) show bullet points, and ordered lists (<ol>) show numbers. Each item goes inside an <li> tag.",
      syntax: "<ul>\n  <li>item</li>\n</ul>",
      code: `<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>`,
      output: "A bulleted list of three items",
    },
    forms: {
      title: "HTML Forms",
      explanation: "Forms collect input from a visitor. Inputs go inside a <form> element, each with a type like text, email, or password.",
      syntax: "<form>\n  <input type=\"text\">\n</form>",
      code: `<form>\n  <label>Email</label>\n  <input type="email" placeholder="you@example.com">\n  <button>Subscribe</button>\n</form>`,
      output: "A small subscribe form with a label, input, and button",
    },
  },
  css: {
    introduction: {
      title: "CSS Introduction",
      explanation: "CSS controls how HTML looks — colors, spacing, fonts, and layout. A rule targets one or more elements with a selector and a set of declarations.",
      syntax: "selector {\n  property: value;\n}",
      code: `h1 {\n  color: #F0A93C;\n  font-size: 32px;\n}`,
      output: "Every <h1> turns amber and grows larger",
    },
    selectors: {
      title: "CSS Selectors",
      explanation: "Selectors decide which elements a rule applies to: by tag, by class (.name), by id (#name), or by relationship to other elements.",
      syntax: ".class-name { ... }",
      code: `.card {\n  border-radius: 12px;\n  padding: 16px;\n}`,
      output: "Every element with class=\"card\" gets rounded padding",
    },
    colors: {
      title: "CSS Colors",
      explanation: "Colors can be named, or given as hex, rgb, or hsl values. Hex is the most common shorthand you'll see in real projects.",
      syntax: "color: #RRGGBB;",
      code: `body {\n  background-color: #12141B;\n  color: #E7E9EE;\n}`,
      output: "A dark background with light, readable text",
    },
    "box-model": {
      title: "CSS Box Model",
      explanation: "Every element is a box made of content, padding, border, and margin, in that order from the inside out.",
      syntax: "padding: 8px;\nmargin: 16px;\nborder: 1px solid;",
      code: `.box {\n  padding: 12px;\n  border: 1px solid #262A36;\n  margin: 8px;\n}`,
      output: "A boxed element with visible spacing on every side",
    },
    flexbox: {
      title: "CSS Flexbox",
      explanation: "Flexbox lays out children in a row or column and makes it easy to align, space, and reorder them.",
      syntax: "display: flex;\njustify-content: center;",
      code: `.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
      output: "Nav items spread evenly with vertical centering",
    },
    grid: {
      title: "CSS Grid",
      explanation: "Grid lays elements out in rows and columns at once, which suits card layouts and page-level structure well.",
      syntax: "display: grid;\ngrid-template-columns: repeat(3, 1fr);",
      code: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}`,
      output: "A three-column grid with even gaps",
    },
    typography: {
      title: "CSS Typography",
      explanation: "Typography properties control font family, size, weight, and line height — the biggest factors in how readable a page feels.",
      syntax: "font-family: ...;\nline-height: 1.5;",
      code: `p {\n  font-family: system-ui, sans-serif;\n  line-height: 1.6;\n  font-size: 16px;\n}`,
      output: "More comfortable, readable paragraph text",
    },
    "responsive-design": {
      title: "Responsive Design",
      explanation: "Media queries apply different styles depending on the screen size, so a layout that works on desktop still works on mobile.",
      syntax: "@media (max-width: 640px) { ... }",
      code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}\n\n@media (max-width: 640px) {\n  .grid {\n    grid-template-columns: 1fr;\n  }\n}`,
      output: "Three columns on desktop, one column on mobile",
    },
  },
  java: {
    introduction: {
      title: "Java Introduction",
      explanation: "Java is a class-based, object-oriented language that runs on the Java Virtual Machine, which is why it works nearly the same on any device.",
      syntax: "System.out.println(\"message\");",
      code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
      output: "Hello, World!",
    },
    syntax: {
      title: "Java Syntax",
      explanation: "Every Java application needs at least one class, and execution starts from a special main method. Statements end with a semicolon.",
      syntax: "public class Name { ... }",
      code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Java uses classes for everything.");\n  }\n}`,
      output: "Java uses classes for everything.",
    },
    variables: {
      title: "Java Variables",
      explanation: "Java is statically typed, so every variable declares its type up front. Once declared, a variable can only hold values of that type.",
      syntax: "type name = value;",
      code: `String name = "Kenji";\nint age = 28;\n\nSystem.out.println(name + " is " + age);`,
      output: "Kenji is 28",
    },
    "data-types": {
      title: "Java Data Types",
      explanation: "Common primitive types include int, double, boolean, and char. String is technically an object type, but behaves like a primitive in everyday use.",
      syntax: "int, double, boolean, char, String",
      code: `int count = 5;\ndouble price = 9.99;\nboolean inStock = true;\n\nSystem.out.println(count + " items at $" + price);`,
      output: "5 items at $9.99",
    },
    operators: {
      title: "Java Operators",
      explanation: "Java supports the usual arithmetic, comparison, and logical operators, plus increment/decrement shorthand like ++ and --.",
      syntax: "a + b, a == b, a && b",
      code: `int score = 10;\nscore++;\n\nSystem.out.println(score);\nSystem.out.println(score > 5);`,
      output: "11\ntrue",
    },
    conditionals: {
      title: "Java Conditionals",
      explanation: "if, else if, and else branch execution based on a boolean condition, just like most C-family languages.",
      syntax: "if (condition) { ... } else { ... }",
      code: `int hour = 20;\nif (hour < 12) {\n  System.out.println("Morning");\n} else {\n  System.out.println("Evening");\n}`,
      output: "Evening",
    },
    loops: {
      title: "Java Loops",
      explanation: "A for loop repeats a fixed number of times, and a while loop repeats as long as a condition holds true.",
      syntax: "for (int i = 0; i < n; i++) { ... }",
      code: `for (int i = 1; i <= 3; i++) {\n  System.out.println("Lesson " + i);\n}`,
      output: "Lesson 1\nLesson 2\nLesson 3",
    },
    methods: {
      title: "Java Methods",
      explanation: "A method is a named block of reusable code that belongs to a class. It can take parameters and return a value.",
      syntax: "returnType methodName(parameters) { ... }",
      code: `static int add(int a, int b) {\n  return a + b;\n}\n\nSystem.out.println(add(4, 7));`,
      output: "11",
    },
    "classes-objects": {
      title: "Classes & Objects",
      explanation: "A class is a blueprint; an object is an instance made from it. Objects hold their own copies of the class's fields.",
      syntax: "ClassName obj = new ClassName();",
      code: `class Dog {\n  String name;\n  Dog(String name) { this.name = name; }\n  String bark() { return name + " says woof!"; }\n}\n\nDog d = new Dog("Rex");\nSystem.out.println(d.bark());`,
      output: "Rex says woof!",
    },
  },
};

const EXERCISES = [
  { id: "e1", lang: "python", title: "Python Basics", question: "Which keyword defines a function in Python?", options: ["function", "def", "func", "define"], answer: 1, explanation: "Python uses the def keyword, followed by a name and parentheses, to define a function." },
  { id: "e2", lang: "python", title: "Python Lists", question: "Which method adds an item to the end of a list?", options: ["list.push()", "list.add()", "list.append()", "list.insert()"], answer: 2, explanation: "append() adds a single item to the end of a list." },
  { id: "e3", lang: "javascript", title: "JavaScript Variables", question: "Which keyword declares a variable that can't be reassigned?", options: ["var", "let", "const", "static"], answer: 2, explanation: "const creates a binding that can't be reassigned after it's set." },
  { id: "e4", lang: "javascript", title: "JavaScript Arrays", question: "Which array method returns a new array with each item transformed?", options: [".filter()", ".map()", ".forEach()", ".reduce()"], answer: 1, explanation: ".map() runs a function on every item and returns a new array of the results." },
  { id: "e5", lang: "html", title: "HTML Structure", question: "Which tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<nav>"], answer: 1, explanation: "The <a> tag with an href attribute creates a clickable hyperlink." },
  { id: "e6", lang: "css", title: "CSS Layout", question: "Which property turns an element into a flex container?", options: ["display: flex;", "position: flex;", "layout: flex;", "flex: true;"], answer: 0, explanation: "display: flex; makes an element's direct children lay out with Flexbox." },
  { id: "e7", lang: "java", title: "Java Basics", question: "Which method is the entry point of a Java application?", options: ["start()", "main()", "run()", "init()"], answer: 1, explanation: "Execution begins in the public static void main(String[] args) method." },
];

const REFERENCES = {
  html: { label: "HTML Reference", items: [
    { name: "<div>", type: "Element", desc: "A generic block-level container." },
    { name: "<span>", type: "Element", desc: "A generic inline container." },
    { name: "href", type: "Attribute", desc: "Sets the destination URL of a link." },
    { name: "alt", type: "Attribute", desc: "Describes an image for accessibility." },
    { name: "<form>", type: "Element", desc: "Wraps a group of input controls." },
  ]},
  css: { label: "CSS Reference", items: [
    { name: "display", type: "Property", desc: "Controls an element's layout mode." },
    { name: "flex-direction", type: "Property", desc: "Sets the main axis of a flex container." },
    { name: "grid-template-columns", type: "Property", desc: "Defines column tracks in a grid." },
    { name: "transition", type: "Property", desc: "Animates a property change over time." },
    { name: "z-index", type: "Property", desc: "Controls stacking order of overlapping elements." },
  ]},
  javascript: { label: "JavaScript Reference", items: [
    { name: "Array.map()", type: "Method", desc: "Transforms every item into a new array." },
    { name: "Array.filter()", type: "Method", desc: "Keeps only items that pass a test." },
    { name: "JSON.stringify()", type: "Function", desc: "Converts a value into a JSON string." },
    { name: "addEventListener()", type: "Method", desc: "Runs a function when an event fires." },
    { name: "typeof", type: "Keyword", desc: "Returns the type of a value as a string." },
  ]},
  python: { label: "Python Reference", items: [
    { name: "len()", type: "Function", desc: "Returns the number of items in a sequence." },
    { name: "range()", type: "Function", desc: "Generates a sequence of numbers." },
    { name: "str.format()", type: "Method", desc: "Inserts values into a string template." },
    { name: "list.sort()", type: "Method", desc: "Sorts a list in place." },
    { name: "dict.get()", type: "Method", desc: "Looks up a key with a safe fallback." },
  ]},
  java: { label: "Java Reference", items: [
    { name: "System.out.println()", type: "Method", desc: "Prints a line of output to the console." },
    { name: "ArrayList", type: "Class", desc: "A resizable array-backed list." },
    { name: "String.length()", type: "Method", desc: "Returns the number of characters in a string." },
    { name: "Math.max()", type: "Method", desc: "Returns the larger of two values." },
    { name: "instanceof", type: "Keyword", desc: "Checks whether an object is of a given type." },
  ]},
};

const PROFILE = {
  name: "Alex",
  progress: 35,
  lessonsCompleted: 12,
  exercisesCompleted: 8,
  streak: 4,
  continuing: [
    { lang: "python", topic: "Variables", percent: 60 },
    { lang: "javascript", topic: "Functions", percent: 20 },
  ],
};

/* Flatten searchable index: languages + topics + lessons */
function buildSearchIndex() {
  const index = [];
  LANGUAGES.forEach((l) => {
    index.push({ type: "Language", label: l.name, sub: l.desc, lang: l.id, active: l.active });
  });
  Object.entries(TOPICS).forEach(([langId, topics]) => {
    const lang = LANGUAGES.find((l) => l.id === langId);
    topics.forEach((t) => {
      index.push({ type: "Lesson", label: `${lang.name} ${t}`, sub: `${lang.name} \u2192 ${t}`, lang: langId, topic: slugify(t), active: lang.active });
    });
  });
  return index;
}
const SEARCH_INDEX = buildSearchIndex();

/* =========================================================================
   SMALL REUSABLE PIECES
   ========================================================================= */

function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "text-slate-900 hover:brightness-95",
    secondary: "border",
    ghost: "hover:bg-black/5",
  };
  const style =
    variant === "primary"
      ? { backgroundColor: palette.amber, color: "#1B1C22" }
      : variant === "secondary"
      ? { borderColor: "currentColor" }
      : {};
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} style={style} {...props}>
      {children}
    </button>
  );
}

function ProgressBar({ percent, c }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: c.bgSunken }}>
      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: palette.amber }} />
    </div>
  );
}

function Badge({ children, tone = "muted", c }) {
  const tones = {
    muted: { backgroundColor: c.bgSunken, color: c.textMuted },
    amber: { backgroundColor: `${palette.amber}22`, color: palette.amberDark },
    green: { backgroundColor: `${palette.green}22`, color: palette.green },
    cyan: { backgroundColor: `${palette.cyan}22`, color: palette.cyan },
  };
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-md" style={tones[tone]}>
      {children}
    </span>
  );
}

function CodeBlock({ code, c }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: c.border, backgroundColor: c.bgSunken }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: c.border }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.red }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.amber }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.green }} />
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md hover:opacity-80"
          style={{ color: c.textMuted }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed" style={{ color: c.text }}>
        {code}
      </pre>
    </div>
  );
}

function LanguageCard({ lang, c, onSelect }) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5"
      style={{ borderColor: c.border, backgroundColor: c.bgRaised }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
          style={{ backgroundColor: `${lang.color}22`, color: lang.color }}
        >
          {lang.name.slice(0, 2).toUpperCase()}
        </div>
        {!lang.active && <Badge c={c}>Coming Soon</Badge>}
      </div>
      <div>
        <h3 className="font-semibold text-base" style={{ color: c.text }}>{lang.name}</h3>
        <p className="text-sm mt-1" style={{ color: c.textMuted }}>{lang.desc}</p>
      </div>
      <div className="flex items-center gap-3 text-xs mt-auto pt-2" style={{ color: c.textFaint }}>
        <span>{lang.difficulty}</span>
        <span>&middot;</span>
        <span>{lang.lessons} lessons</span>
      </div>
      <Button
        variant={lang.active ? "primary" : "secondary"}
        size="sm"
        className="w-full mt-1"
        style={!lang.active ? { color: c.textMuted, borderColor: c.border } : undefined}
        disabled={!lang.active}
        onClick={() => lang.active && onSelect(lang.id)}
      >
        {lang.active ? "Start Learning" : "Coming Soon"}
      </Button>
    </div>
  );
}

function SearchBar({ c, value, onChange, onSubmit, placeholder, large }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(value); }}
      className={`flex items-center gap-2 rounded-xl border ${large ? "px-4 py-3" : "px-3 py-2"}`}
      style={{ borderColor: c.border, backgroundColor: c.bgRaised }}
    >
      <Search size={large ? 20 : 16} style={{ color: c.textFaint }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className={`w-full bg-transparent outline-none ${large ? "text-base" : "text-sm"}`}
        style={{ color: c.text }}
      />
    </form>
  );
}

/* =========================================================================
   NAVBAR + FOOTER
   ========================================================================= */

function Navbar({ c, isDark, setIsDark, navigate, current, loggedIn, onLogout }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const links = [
    { key: "tutorials", label: "Tutorials", page: "languages" },
    { key: "languages", label: "Languages", page: "languages" },
    { key: "exercises", label: "Exercises", page: "exercises" },
    { key: "references", label: "References", page: "references" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: c.border, backgroundColor: `${c.bg}E8` }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={() => navigate("home")} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: palette.amber }}>
            <Code2 size={18} color="#1B1C22" />
          </div>
          <span className="font-semibold text-lg" style={{ color: c.text }}>CodeLearn</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => navigate(l.page)}
              className="px-3 py-2 text-sm rounded-lg transition-colors hover:opacity-80"
              style={{ color: current === l.page ? c.text : c.textMuted, fontWeight: current === l.page ? 600 : 500 }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs">
          <SearchBar
            c={c}
            value={q}
            onChange={setQ}
            onSubmit={(val) => { navigate("search", { q: val }); }}
            placeholder="Search..."
          />
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg flex items-center justify-center border"
            style={{ borderColor: c.border, color: c.textMuted }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {loggedIn ? (
            <button
              onClick={() => navigate("dashboard")}
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm"
              style={{ backgroundColor: palette.amber, color: "#1B1C22" }}
            >
              A
            </button>
          ) : (
            <Button size="sm" onClick={() => navigate("login")}>Login</Button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ color: c.text }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-3" style={{ borderColor: c.border, backgroundColor: c.bg }}>
          <SearchBar c={c} value={q} onChange={setQ} onSubmit={(v) => { navigate("search", { q: v }); setOpen(false); }} placeholder="Search..." />
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => { navigate(l.page); setOpen(false); }}
              className="text-left text-sm py-1.5"
              style={{ color: c.text }}
            >
              {l.label}
            </button>
          ))}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: c.border }}>
            <button onClick={() => setIsDark(!isDark)} className="flex items-center gap-2 text-sm" style={{ color: c.textMuted }}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />} Theme
            </button>
            {loggedIn ? (
              <button onClick={() => { navigate("dashboard"); setOpen(false); }} className="text-sm font-medium" style={{ color: c.text }}>
                Dashboard
              </button>
            ) : (
              <Button size="sm" onClick={() => { navigate("login"); setOpen(false); }}>Login</Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ c, navigate }) {
  const cols = [
    { title: "Learn", links: [["Tutorials", "languages"], ["Languages", "languages"], ["Exercises", "exercises"], ["References", "references"]] },
    { title: "Company", links: [["About", "home"], ["Contact", "home"]] },
    { title: "Legal", links: [["Privacy", "home"], ["Terms", "home"]] },
  ];
  return (
    <footer className="border-t mt-24" style={{ borderColor: c.border }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: palette.amber }}>
              <Code2 size={15} color="#1B1C22" />
            </div>
            <span className="font-semibold" style={{ color: c.text }}>CodeLearn</span>
          </div>
          <p className="text-sm" style={{ color: c.textMuted }}>Learn. Practice. Build.</p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold mb-3" style={{ color: c.text }}>{col.title}</h4>
            <ul className="flex flex-col gap-2">
              {col.links.map(([label, page]) => (
                <li key={label}>
                  <button onClick={() => navigate(page)} className="text-sm hover:opacity-80" style={{ color: c.textMuted }}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t py-5 text-center text-xs" style={{ borderColor: c.border, color: c.textFaint }}>
        &copy; 2026 CodeLearn
      </div>
    </footer>
  );
}

/* =========================================================================
   PAGES
   ========================================================================= */

function HomePage({ c, navigate }) {
  const [q, setQ] = useState("");
  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6" style={{ backgroundColor: c.bgSunken, color: c.textMuted }}>
          <Terminal size={13} /> 5 languages ready to learn today
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto" style={{ color: c.text }}>
          Learn to code. Build your future.
        </h1>
        <p className="mt-5 text-lg max-w-xl mx-auto" style={{ color: c.textMuted }}>
          Learn programming languages with simple tutorials, examples, and hands-on practice.
        </p>
        <div className="mt-8 max-w-lg mx-auto">
          <SearchBar
            c={c}
            large
            value={q}
            onChange={setQ}
            onSubmit={(v) => navigate("search", { q: v })}
            placeholder="Search tutorials, languages, or topics..."
          />
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <Button size="lg" onClick={() => navigate("language", { lang: "python" })}>
            Start Learning <ArrowRight size={16} />
          </Button>
          <Button size="lg" variant="secondary" style={{ color: c.text, borderColor: c.border }} onClick={() => navigate("languages")}>
            Explore Languages
          </Button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: c.text }}>Popular Languages</h2>
          <button onClick={() => navigate("languages")} className="text-sm font-medium flex items-center gap-1" style={{ color: palette.amberDark }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LANGUAGES.map((l) => (
            <LanguageCard key={l.id} lang={l} c={c} onSelect={(id) => navigate("language", { lang: id })} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: BookOpen, title: "Bite-sized lessons", body: "Every topic is one focused idea with a runnable example, not a wall of text." },
          { icon: Play, title: "Try it yourself", body: "Edit HTML, CSS, and JavaScript in the browser and see the result instantly." },
          { icon: Award, title: "Practice exercises", body: "Check your understanding with short exercises after each language track." },
        ].map((f) => (
          <div key={f.title} className="p-5 rounded-2xl border" style={{ borderColor: c.border, backgroundColor: c.bgRaised }}>
            <f.icon size={20} style={{ color: palette.amber }} />
            <h3 className="font-semibold mt-3" style={{ color: c.text }}>{f.title}</h3>
            <p className="text-sm mt-1" style={{ color: c.textMuted }}>{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function LanguagesPage({ c, navigate }) {
  const [q, setQ] = useState("");
  const filtered = LANGUAGES.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold" style={{ color: c.text }}>All Languages</h1>
      <p className="mt-2" style={{ color: c.textMuted }}>Pick a language and start with lesson one.</p>
      <div className="mt-6 max-w-sm">
        <SearchBar c={c} value={q} onChange={setQ} placeholder="Filter languages..." />
      </div>
      {CATEGORIES.map((cat) => {
        const items = filtered.filter((l) => l.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat} className="mt-10">
            <h2 className="text-lg font-semibold mb-4" style={{ color: c.text }}>{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((l) => (
                <LanguageCard key={l.id} lang={l} c={c} onSelect={(id) => navigate("language", { lang: id })} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LanguageOverviewPage({ c, navigate, langId, progress }) {
  const lang = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];
  const topics = TOPICS[lang.id] || [];
  const key = `${lang.id}`;
  const pct = progress[key] || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: c.textFaint }}>
        <button onClick={() => navigate("languages")} className="hover:underline">Languages</button>
        <ChevronRight size={14} />
        <span style={{ color: c.text }}>{lang.name}</span>
      </div>

      <div className="flex items-start gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center font-mono font-bold" style={{ backgroundColor: `${lang.color}22`, color: lang.color }}>
          {lang.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-3xl font-bold" style={{ color: c.text }}>{lang.name} Tutorial</h1>
          <p className="mt-2 max-w-xl" style={{ color: c.textMuted }}>
            Learn {lang.name} from the basics with simple explanations and practical examples.
          </p>
        </div>
        <Button onClick={() => navigate("lesson", { lang: lang.id, topic: slugify(topics[0]) })}>
          {pct > 0 ? "Continue" : "Start Course"} <ArrowRight size={16} />
        </Button>
      </div>

      <div className="mt-8 p-4 rounded-xl border" style={{ borderColor: c.border, backgroundColor: c.bgRaised }}>
        <div className="flex items-center justify-between text-sm mb-2">
          <span style={{ color: c.textMuted }}>Your progress</span>
          <span style={{ color: c.text, fontWeight: 600 }}>{pct}% Complete</span>
        </div>
        <ProgressBar percent={pct} c={c} />
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
        {topics.map((t, i) => {
          const slug = slugify(t);
          const hasContent = !!(LESSONS[lang.id] && LESSONS[lang.id][slug]);
          return (
            <button
              key={t}
              onClick={() => hasContent && navigate("lesson", { lang: lang.id, topic: slug })}
              disabled={!hasContent}
              className="flex items-center gap-4 p-4 rounded-xl border text-left transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ borderColor: c.border, backgroundColor: c.bgRaised }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono shrink-0"
                style={{ backgroundColor: c.bgSunken, color: c.textMuted }}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm" style={{ color: c.text }}>{lang.name} {t}</p>
              </div>
              <ChevronRight size={16} style={{ color: c.textFaint }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LessonPage({ c, navigate, langId, topicSlug, progress, setProgress, openEditor }) {
  const lang = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];
  const topics = TOPICS[lang.id] || [];
  const lesson = (LESSONS[lang.id] && LESSONS[lang.id][topicSlug]) || null;
  const idx = topics.findIndex((t) => slugify(t) === topicSlug);

  useEffect(() => {
    if (idx >= 0) {
      const pct = Math.round(((idx + 1) / topics.length) * 100);
      setProgress((p) => ({ ...p, [lang.id]: Math.max(p[lang.id] || 0, pct) }));
    }
    window.scrollTo?.({ top: 0 });
    // eslint-disable-next-line
  }, [langId, topicSlug]);

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p style={{ color: c.textMuted }}>This lesson is coming soon.</p>
        <Button className="mt-4" onClick={() => navigate("language", { lang: langId })}>Back to course</Button>
      </div>
    );
  }

  const prevTopic = idx > 0 ? topics[idx - 1] : null;
  const nextTopic = idx < topics.length - 1 ? topics[idx + 1] : null;
  const onThisPage = ["Explanation", "Syntax", "Example", "Output"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr_200px] gap-8">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: c.textFaint }}>
            {lang.name} Course
          </p>
          <nav className="flex flex-col gap-0.5 max-h-[70vh] overflow-y-auto pr-2">
            {topics.map((t) => {
              const slug = slugify(t);
              const isCurrent = slug === topicSlug;
              const hasContent = !!(LESSONS[lang.id] && LESSONS[lang.id][slug]);
              return (
                <button
                  key={t}
                  disabled={!hasContent}
                  onClick={() => navigate("lesson", { lang: lang.id, topic: slug })}
                  className="text-left text-sm px-3 py-2 rounded-lg disabled:opacity-40"
                  style={{
                    backgroundColor: isCurrent ? c.bgSunken : "transparent",
                    color: isCurrent ? c.text : c.textMuted,
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  {t}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Center */}
      <main>
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: c.textFaint }}>
          <button onClick={() => navigate("language", { lang: lang.id })} className="hover:underline">{lang.name}</button>
          <ChevronRight size={12} />
          <span>{topics[idx]}</span>
        </div>
        <h1 className="text-3xl font-bold" style={{ color: c.text }}>{lesson.title}</h1>

        <p className="mt-5 leading-relaxed" style={{ color: c.text }}>{lesson.explanation}</p>

        <h2 className="text-sm font-semibold uppercase tracking-wide mt-8 mb-2" style={{ color: c.textFaint }}>Syntax</h2>
        <CodeBlock code={lesson.syntax} c={c} />

        <h2 className="text-sm font-semibold uppercase tracking-wide mt-8 mb-2" style={{ color: c.textFaint }}>Example</h2>
        <CodeBlock code={lesson.code} c={c} />

        <h2 className="text-sm font-semibold uppercase tracking-wide mt-8 mb-2" style={{ color: c.textFaint }}>Output</h2>
        <div className="rounded-xl border p-4 text-sm font-mono whitespace-pre-wrap" style={{ borderColor: c.border, backgroundColor: c.bgRaised, color: c.textMuted }}>
          {lesson.output}
        </div>

        <div className="mt-6">
          <Button variant="secondary" style={{ color: c.text, borderColor: c.border }} onClick={() => openEditor(lang.id, lesson.code)}>
            <Play size={15} /> Try It Yourself
          </Button>
        </div>

        <div className="flex items-center justify-between mt-12 pt-6 border-t" style={{ borderColor: c.border }}>
          {prevTopic ? (
            <button onClick={() => navigate("lesson", { lang: lang.id, topic: slugify(prevTopic) })} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: c.text }}>
              <ChevronLeft size={16} /> {prevTopic}
            </button>
          ) : <span />}
          {nextTopic ? (
            <button onClick={() => navigate("lesson", { lang: lang.id, topic: slugify(nextTopic) })} className="flex items-center gap-1.5 text-sm font-medium ml-auto" style={{ color: c.text }}>
              {nextTopic} <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={() => navigate("exercises")} className="flex items-center gap-1.5 text-sm font-medium ml-auto" style={{ color: palette.amberDark }}>
              Practice exercises <ChevronRight size={16} />
            </button>
          )}
        </div>
      </main>

      {/* Right rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: c.textFaint }}>On this page</p>
          <ul className="flex flex-col gap-2 text-sm mb-6" style={{ color: c.textMuted }}>
            {onThisPage.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <Button size="sm" className="w-full" variant="secondary" style={{ color: c.text, borderColor: c.border }} onClick={() => openEditor(lang.id, lesson.code)}>
            <Play size={14} /> Try It Yourself
          </Button>
        </div>
      </aside>
    </div>
  );
}

function ExercisesPage({ c, navigate }) {
  const [active, setActive] = useState(null); // exercise id
  const [answers, setAnswers] = useState({}); // id -> selected index
  const [done, setDone] = useState({}); // id -> true

  const submit = (ex, idx) => {
    setAnswers((a) => ({ ...a, [ex.id]: idx }));
    setDone((d) => ({ ...d, [ex.id]: true }));
  };

  const current = EXERCISES.find((e) => e.id === active);

  if (current) {
    const chosen = answers[current.id];
    const isDone = done[current.id];
    const isCorrect = chosen === current.answer;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <button onClick={() => setActive(null)} className="flex items-center gap-1 text-sm mb-6" style={{ color: c.textMuted }}>
          <ChevronLeft size={15} /> All exercises
        </button>
        <Badge c={c} tone="amber">{current.title}</Badge>
        <h1 className="text-2xl font-semibold mt-4" style={{ color: c.text }}>{current.question}</h1>
        <div className="mt-6 flex flex-col gap-3">
          {current.options.map((opt, i) => {
            const selected = chosen === i;
            let tone = c.border;
            if (isDone && selected) tone = isCorrect ? palette.green : palette.red;
            if (isDone && i === current.answer && !isCorrect) tone = palette.green;
            return (
              <button
                key={opt}
                onClick={() => !isDone && submit(current, i)}
                disabled={isDone}
                className="flex items-center justify-between px-4 py-3 rounded-xl border text-left text-sm"
                style={{ borderColor: tone, backgroundColor: c.bgRaised, color: c.text }}
              >
                <span className="font-mono">{opt}</span>
                {isDone && selected && (isCorrect ? <CheckCircle2 size={18} color={palette.green} /> : <XCircle size={18} color={palette.red} />)}
                {isDone && !selected && i === current.answer && !isCorrect && <CheckCircle2 size={18} color={palette.green} />}
              </button>
            );
          })}
        </div>
        {isDone && (
          <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: c.border, backgroundColor: c.bgSunken }}>
            <p className="text-sm font-medium mb-1" style={{ color: isCorrect ? palette.green : palette.red }}>
              {isCorrect ? "Correct!" : `Not quite — the answer is "${current.options[current.answer]}"`}
            </p>
            <p className="text-sm" style={{ color: c.textMuted }}>{current.explanation}</p>
            <Button size="sm" className="mt-4" onClick={() => setActive(null)}>Continue <ArrowRight size={14} /></Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold" style={{ color: c.text }}>Exercises</h1>
      <p className="mt-2" style={{ color: c.textMuted }}>Short checks to make sure a lesson actually stuck.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {EXERCISES.map((ex) => {
          const lang = LANGUAGES.find((l) => l.id === ex.lang);
          const isDone = done[ex.id];
          return (
            <div key={ex.id} className="p-5 rounded-2xl border flex flex-col gap-3" style={{ borderColor: c.border, backgroundColor: c.bgRaised }}>
              <div className="flex items-center justify-between">
                <Badge c={c} tone="cyan">{lang?.name}</Badge>
                {isDone && <Badge c={c} tone="green">Completed</Badge>}
              </div>
              <h3 className="font-semibold text-sm" style={{ color: c.text }}>{ex.title}</h3>
              <p className="text-sm" style={{ color: c.textMuted }}>{ex.question}</p>
              <Button size="sm" className="mt-auto w-full" variant="secondary" style={{ color: c.text, borderColor: c.border }} onClick={() => setActive(ex.id)}>
                {isDone ? "Try Again" : "Start Exercise"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReferencesPage({ c, navigate }) {
  const [selected, setSelected] = useState("html");
  const ref = REFERENCES[selected];
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold" style={{ color: c.text }}>References</h1>
      <p className="mt-2" style={{ color: c.textMuted }}>Quick lookups for keywords, functions, methods, and properties.</p>
      <div className="flex flex-wrap gap-2 mt-6">
        {Object.entries(REFERENCES).map(([id, r]) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className="px-3 py-1.5 rounded-lg text-sm border"
            style={{
              borderColor: selected === id ? palette.amber : c.border,
              backgroundColor: selected === id ? `${palette.amber}18` : "transparent",
              color: selected === id ? palette.amberDark : c.textMuted,
              fontWeight: selected === id ? 600 : 400,
            }}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {ref.items.map((item) => (
          <div key={item.name} className="p-4 rounded-xl border flex items-start gap-3" style={{ borderColor: c.border, backgroundColor: c.bgRaised }}>
            <Hash size={16} className="mt-0.5 shrink-0" style={{ color: palette.amber }} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold" style={{ color: c.text }}>{item.name}</span>
                <Badge c={c}>{item.type}</Badge>
              </div>
              <p className="text-sm mt-1" style={{ color: c.textMuted }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchPage({ c, navigate, query, setGlobalQuery }) {
  const [q, setQ] = useState(query || "");
  useEffect(() => setQ(query || ""), [query]);
  const results = q.trim()
    ? SEARCH_INDEX.filter((r) => r.label.toLowerCase().includes(q.toLowerCase()))
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6" style={{ color: c.text }}>Search</h1>
      <SearchBar c={c} large value={q} onChange={(v) => { setQ(v); setGlobalQuery(v); }} placeholder="Search tutorials, languages, or topics..." />
      <div className="mt-8 flex flex-col gap-2">
        {q.trim() && results.length === 0 && (
          <p style={{ color: c.textMuted }}>No results for &ldquo;{q}&rdquo;.</p>
        )}
        {results.map((r, i) => (
          <button
            key={i}
            disabled={!r.active}
            onClick={() => r.topic ? navigate("lesson", { lang: r.lang, topic: r.topic }) : navigate("language", { lang: r.lang })}
            className="flex items-center justify-between px-4 py-3 rounded-xl border text-left disabled:opacity-40"
            style={{ borderColor: c.border, backgroundColor: c.bgRaised }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: c.text }}>{r.label}</p>
              <p className="text-xs mt-0.5" style={{ color: c.textFaint }}>{r.sub}</p>
            </div>
            <Badge c={c}>{r.type}</Badge>
          </button>
        ))}
      </div>
    </div>
  );
}

function LoginPage({ c, navigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <div className="w-10 h-10 rounded-lg mx-auto flex items-center justify-center mb-3" style={{ backgroundColor: palette.amber }}>
          <Code2 size={20} color="#1B1C22" />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: c.text }}>Welcome back</h1>
        <p className="text-sm mt-1" style={{ color: c.textMuted }}>Log in to continue your progress.</p>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); onLogin(); }}
        className="flex flex-col gap-4 p-6 rounded-2xl border"
        style={{ borderColor: c.border, backgroundColor: c.bgRaised }}
      >
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: c.textMuted }}>Email</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: c.border, backgroundColor: c.bgSunken, color: c.text }}
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: c.textMuted }}>Password</label>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: c.border, backgroundColor: c.bgSunken, color: c.text }}
          />
        </div>
        <Button type="submit" className="w-full mt-1">Login</Button>
        <Button type="button" variant="secondary" className="w-full" style={{ color: c.text, borderColor: c.border }} onClick={onLogin}>
          Continue with Google
        </Button>
        <p className="text-center text-sm mt-1" style={{ color: c.textMuted }}>
          New here? <button type="button" onClick={onLogin} className="font-medium" style={{ color: palette.amberDark }}>Create account</button>
        </p>
      </form>
    </div>
  );
}

function DashboardPage({ c, navigate, progress }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold" style={{ color: c.text }}>Welcome back, {PROFILE.name}!</h1>
      <p className="mt-1" style={{ color: c.textMuted }}>Here's where you left off.</p>

      <h2 className="text-lg font-semibold mt-10 mb-4" style={{ color: c.text }}>Continue Learning</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROFILE.continuing.map((item) => {
          const lang = LANGUAGES.find((l) => l.id === item.lang);
          const pct = progress[item.lang] ?? item.percent;
          return (
            <button
              key={item.lang}
              onClick={() => navigate("language", { lang: item.lang })}
              className="p-5 rounded-2xl border text-left"
              style={{ borderColor: c.border, backgroundColor: c.bgRaised }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm" style={{ color: c.text }}>{lang.name} {item.topic}</span>
                <span className="text-xs" style={{ color: c.textFaint }}>{pct}%</span>
              </div>
              <div className="mt-3"><ProgressBar percent={pct} c={c} /></div>
            </button>
          );
        })}
      </div>

      <h2 className="text-lg font-semibold mt-10 mb-4" style={{ color: c.text }}>Recommended Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LANGUAGES.filter((l) => l.active).slice(0, 3).map((l) => (
          <LanguageCard key={l.id} lang={l} c={c} onSelect={(id) => navigate("language", { lang: id })} />
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3 flex-wrap">
        <Button variant="secondary" style={{ color: c.text, borderColor: c.border }} onClick={() => navigate("profile")}>
          <User size={15} /> View Profile
        </Button>
        <Button variant="secondary" style={{ color: c.text, borderColor: c.border }} onClick={() => navigate("exercises")}>
          <ListChecks size={15} /> Recent Lessons &amp; Exercises
        </Button>
      </div>
    </div>
  );
}

function ProfilePage({ c, navigate, onLogout }) {
  const stats = [
    { label: "Progress", value: `${PROFILE.progress}%`, icon: Layers },
    { label: "Lessons completed", value: PROFILE.lessonsCompleted, icon: BookOpen },
    { label: "Exercises completed", value: PROFILE.exercisesCompleted, icon: ListChecks },
    { label: "Streak", value: `${PROFILE.streak} days`, icon: Flame },
  ];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold" style={{ backgroundColor: palette.amber, color: "#1B1C22" }}>
          {PROFILE.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.text }}>{PROFILE.name}</h1>
          <p className="text-sm" style={{ color: c.textMuted }}>Learning on CodeLearn since 2026</p>
        </div>
        <button onClick={onLogout} className="ml-auto flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border" style={{ borderColor: c.border, color: c.textMuted }}>
          <LogOut size={14} /> Log out
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-xl border text-center" style={{ borderColor: c.border, backgroundColor: c.bgRaised }}>
            <s.icon size={18} className="mx-auto mb-2" style={{ color: palette.amber }} />
            <p className="text-xl font-bold" style={{ color: c.text }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: c.textMuted }}>{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-10 mb-4" style={{ color: c.text }}>Continue Learning</h2>
      <div className="flex flex-col gap-3">
        {PROFILE.continuing.map((item) => {
          const lang = LANGUAGES.find((l) => l.id === item.lang);
          return (
            <button key={item.lang} onClick={() => navigate("language", { lang: item.lang })} className="p-4 rounded-xl border flex items-center gap-4 text-left" style={{ borderColor: c.border, backgroundColor: c.bgRaised }}>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: c.text }}>{lang.name} — {item.topic}</p>
                <div className="mt-2"><ProgressBar percent={item.percent} c={c} /></div>
              </div>
              <span className="text-xs" style={{ color: c.textFaint }}>{item.percent}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   TRY IT YOURSELF — live HTML/CSS/JS editor
   ========================================================================= */

const DEFAULT_EDITOR = {
  html: "<h1>Hello, CodeLearn!</h1>\n<p>Edit this HTML and hit Run.</p>",
  css: "h1 {\n  color: #F0A93C;\n  font-family: sans-serif;\n}",
  js: "console.log('Hello from JavaScript');",
};

function EditorModal({ c, onClose, initialLang, initialCode }) {
  const isWebLang = ["html", "css", "javascript"].includes(initialLang);
  const [tab, setTab] = useState(initialLang === "css" ? "css" : initialLang === "javascript" ? "js" : "html");
  const [code, setCode] = useState(() => ({
    ...DEFAULT_EDITOR,
    ...(initialLang === "html" ? { html: initialCode } : {}),
    ...(initialLang === "css" ? { css: initialCode } : {}),
    ...(initialLang === "javascript" ? { js: initialCode } : {}),
  }));
  const [srcDoc, setSrcDoc] = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => {
    setSrcDoc(`<html><head><style>${code.css}</style></head><body>${code.html}<script>${code.js}<\/script></body></html>`);
  };
  useEffect(() => { if (isWebLang) run(); /* eslint-disable-next-line */ }, []);

  const reset = () => setCode(DEFAULT_EDITOR);

  if (!isWebLang) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "#00000099" }}>
        <div className="w-full max-w-md rounded-2xl border p-6 text-center" style={{ borderColor: c.border, backgroundColor: c.bgRaised }}>
          <FileCode size={28} className="mx-auto mb-3" style={{ color: palette.amber }} />
          <h3 className="font-semibold" style={{ color: c.text }}>
            Code execution for {initialLang === "python" ? "Python" : "this language"} is coming soon.
          </h3>
          <p className="text-sm mt-2" style={{ color: c.textMuted }}>
            You can still read and copy the example above. In-browser execution for compiled and interpreted server-side languages will follow.
          </p>
          <Button className="mt-5" onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "js", label: "JS" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "#00000099" }}>
      <div className="w-full max-w-5xl h-[85vh] rounded-2xl border overflow-hidden flex flex-col" style={{ borderColor: c.border, backgroundColor: c.bgRaised }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: c.border }}>
          <div className="flex items-center gap-2">
            <Braces size={16} style={{ color: palette.amber }} />
            <span className="font-semibold text-sm" style={{ color: c.text }}>Try It Yourself</span>
          </div>
          <button onClick={onClose} style={{ color: c.textMuted }}><X size={20} /></button>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
          <div className="flex flex-col border-b md:border-b-0 md:border-r min-h-0" style={{ borderColor: c.border }}>
            <div className="flex items-center gap-1 px-3 pt-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="px-3 py-1.5 text-xs font-mono rounded-t-lg"
                  style={{
                    backgroundColor: tab === t.id ? c.bgSunken : "transparent",
                    color: tab === t.id ? c.text : c.textFaint,
                    fontWeight: tab === t.id ? 600 : 400,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <textarea
              value={code[tab]}
              onChange={(e) => setCode((prev) => ({ ...prev, [tab]: e.target.value }))}
              spellCheck={false}
              className="flex-1 w-full p-4 font-mono text-sm outline-none resize-none min-h-[200px]"
              style={{ backgroundColor: c.bgSunken, color: c.text }}
            />
            <div className="flex items-center gap-2 p-3 border-t" style={{ borderColor: c.border }}>
              <Button size="sm" onClick={run}><Play size={13} /> Run</Button>
              <Button size="sm" variant="secondary" style={{ color: c.text, borderColor: c.border }} onClick={reset}>
                <RotateCcw size={13} /> Reset
              </Button>
              <Button
                size="sm" variant="secondary" style={{ color: c.text, borderColor: c.border }}
                onClick={() => { navigator.clipboard?.writeText(code[tab]).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />} Copy
              </Button>
            </div>
          </div>
          <div className="min-h-0 flex flex-col">
            <div className="px-3 py-2 text-xs font-mono" style={{ color: c.textFaint }}>Output</div>
            <iframe
              title="preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              className="flex-1 w-full bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ROOT APP
   ========================================================================= */

export default function CodeLearnApp() {
  const { isDark, setIsDark, c } = useTheme();
  const [route, setRoute] = useState({ page: "home", params: {} });
  const [loggedIn, setLoggedIn] = useState(false);
  const [progress, setProgress] = useState({});
  const [globalQuery, setGlobalQuery] = useState("");
  const [editor, setEditor] = useState(null); // { lang, code }

  const navigate = (page, params = {}) => {
    setRoute({ page, params });
    window.scrollTo?.({ top: 0 });
  };

  const openEditor = (lang, code) => setEditor({ lang, code });

  let body;
  switch (route.page) {
    case "languages":
      body = <LanguagesPage c={c} navigate={navigate} />;
      break;
    case "language":
      body = <LanguageOverviewPage c={c} navigate={navigate} langId={route.params.lang} progress={progress} />;
      break;
    case "lesson":
      body = (
        <LessonPage
          c={c} navigate={navigate}
          langId={route.params.lang} topicSlug={route.params.topic}
          progress={progress} setProgress={setProgress}
          openEditor={openEditor}
        />
      );
      break;
    case "exercises":
      body = <ExercisesPage c={c} navigate={navigate} />;
      break;
    case "references":
      body = <ReferencesPage c={c} navigate={navigate} />;
      break;
    case "search":
      body = <SearchPage c={c} navigate={navigate} query={route.params.q ?? globalQuery} setGlobalQuery={setGlobalQuery} />;
      break;
    case "login":
      body = <LoginPage c={c} navigate={navigate} onLogin={() => { setLoggedIn(true); navigate("dashboard"); }} />;
      break;
    case "dashboard":
      body = loggedIn
        ? <DashboardPage c={c} navigate={navigate} progress={progress} />
        : <LoginPage c={c} navigate={navigate} onLogin={() => { setLoggedIn(true); navigate("dashboard"); }} />;
      break;
    case "profile":
      body = loggedIn
        ? <ProfilePage c={c} navigate={navigate} onLogout={() => { setLoggedIn(false); navigate("home"); }} />
        : <LoginPage c={c} navigate={navigate} onLogin={() => { setLoggedIn(true); navigate("profile"); }} />;
      break;
    default:
      body = <HomePage c={c} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen font-sans transition-colors" style={{ backgroundColor: c.bg, color: c.text }}>
      <Navbar c={c} isDark={isDark} setIsDark={setIsDark} navigate={navigate} current={route.page} loggedIn={loggedIn} />
      <main>{body}</main>
      <Footer c={c} navigate={navigate} />
      {editor && <EditorModal c={c} onClose={() => setEditor(null)} initialLang={editor.lang} initialCode={editor.code} />}
    </div>
  );
}
