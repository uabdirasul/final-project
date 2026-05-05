# Chat App - Authentication System

## A modern chat application with a complete OOP-based authentication system built with TypeScript, HTML5, and Tailwind CSS.

## 📦 Prerequisites

Before running this project, ensure you have the following installed on your machine:

### Required Software

- **Node.js** (v14 or higher, mine v24.11.1) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

Both commands should return version numbers. If not, please install Node.js.

---

## 🚀 Installation

### Step 1: Clone or Download the Project

**Using Git:**

```bash
git clone https://github.com/uabdirasul/final-project.git
cd final-project
```

**Or manually download and extract the project folder.**

### Step 2: Install Dependencies

Navigate to the project directory and install all required npm packages:

```bash
npm install
```

This will install:

- `typescript` - TypeScript compiler
- `live-server` - Local development server
- `chokidar-cli` - File watcher for development
- `concurrently` - Run multiple commands concurrently

The installation progress will be displayed in your terminal.

---

## 🎮 Running the Project

### Option 1: Development Mode (Recommended)

Run TypeScript compiler in watch mode, auto-reload HTML files, and start the live server:

```bash
npm run dev
```

This command:

- Compiles TypeScript files on changes
- Watches for HTML file changes
- Automatically reloads the browser
- Serves files at `http://127.0.0.1:8080`

### Option 2: Build and Serve

If you prefer running in two separate steps:

```bash
# Build the project
npm run build

# Start the server
npm run serve
```

### Option 3: Build Only

Compile TypeScript without starting a server:

```bash
npm run build
```

Compiled files will be in the `dist/` folder.

---

## 🌐 Accessing the Application

Once the server is running, open your browser and navigate to:

```
http://127.0.0.1:8080
```

**Note:** The port might be different if 8080 is already in use. Check the terminal output for the actual URL.

### Pages

- **Home Page:** `http://127.0.0.1:8080/` (requires authentication)
- **Sign In:** `http://127.0.0.1:8080/signin/signin.html`
- **Register:** `http://127.0.0.1:8080/register/register.html`

---

## 🔐 Default Credentials

When you first run the application, a default account is created:

```
Username: abdirasul
Email: abdirasul@example.com
Password: password123
```

Use these credentials to test the application on your first visit.

---

## 🛠️ Available Commands

```bash
# Install dependencies
npm install

# Development mode (watch + auto-reload)
npm run dev

# Build the project
npm run build

# Start server (requires build first)
npm run serve

# Build and serve in one command
npm start

# Copy HTML files to dist folder
npm run copy:html
```

### What Each Command Does

| Command             | What It Does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm install`       | Downloads and installs all dependencies from package.json |
| `npm run build`     | Compiles TypeScript to JavaScript and copies HTML files   |
| `npm run dev`       | Starts watch mode, HTML watcher, and live server together |
| `npm run serve`     | Starts live-server serving the dist/ folder               |
| `npm run copy:html` | Copies HTML files from src/ to dist/                      |

---

## 📊 Test Coverage

This project has comprehensive test coverage with **90.6% overall line coverage**. All core authentication and storage services are fully tested.

### Coverage Summary

```
Total Elements:     427
Covered Elements:   387
Coverage Rate:      90.6%

Statements:         257 covered / 257 total    (89.1%)
Methods:            97 covered / 103 total     (94.2%)
Conditionals:       61 covered / 67 total      (91.0%)
```

### File-by-File Coverage

| File               | Statements | Conditionals | Methods |
| ------------------ | ---------- | ------------ | ------- |
| AuthGuard.ts       | 100%       | 100%         | 100%    |
| AuthService.ts     | 100%       | 100%         | 100%    |
| ChatRoom.ts        | 100%       | 100%         | 100%    |
| ChatRoomService.ts | 95.5%      | 83.3%        | 96.8%   |
| Message.ts         | 100%       | 100%         | 100%    |
| MessageService.ts  | 47.8%      | 50.0%        | 45.5%   |
| StorageService.ts  | 95.7%      | 100%         | 96.3%   |
| User.ts            | 100%       | 100%         | 100%    |

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```
