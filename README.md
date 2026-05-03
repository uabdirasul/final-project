# Chat App - Authentication System

A modern chat application with a complete OOP-based authentication system built with TypeScript, HTML5, and Tailwind CSS.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Default Credentials](#default-credentials)
- [Available Commands](#available-commands)

---

## 📦 Prerequisites

Before running this project, ensure you have the following installed on your machine:

### Required Software

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
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

## 📂 Project Structure

```
final-project/
├── src/
│   ├── lib/
│   │   ├── User.ts              # User data model and validation
│   │   ├── StorageService.ts    # localStorage database operations
│   │   ├── AuthService.ts       # Authentication logic (login, register)
│   │   └── AuthGuard.ts         # Route protection (optional)
│   │
│   ├── signin/
│   │   ├── signin.ts            # Sign-in form controller
│   │   └── signin.html          # Sign-in page UI
│   │
│   ├── register/
│   │   ├── register.ts          # Registration form controller
│   │   └── register.html        # Registration page UI
│   │
│   ├── index.ts                 # Main app controller
│   └── index.html               # Home page (protected)
│
├── dist/                        # Compiled JavaScript (generated)
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

---

## 🎯 Usage Guide

### 1. First Time Visiting the App

When you visit the application for the first time:

1. A default account is automatically created in localStorage
2. You are redirected to the **Sign In** page (no account logged in)
3. Use the default credentials to log in

### 2. Sign In

**Default Account:**

- Username: `abdirasul`
- Password: `password123`

**Steps:**

1. Go to the Sign In page
2. Enter username and password
3. Click "Sign In"
4. If credentials match, you're logged in and redirected to the home page
5. If credentials don't match, an error message appears: "Invalid username or password"

### 3. Register a New Account

**Required Fields:**

- Username (3+ characters)
- Email (must be valid email format)
- Password (3+ characters)
- Confirm Password (must match password)

**Steps:**

1. Click "Register" link on the Sign In page, or go to `/register/register.html`
2. Fill in all required fields
3. Click "Register"
4. If successful, new account is created AND you're automatically logged in
5. You're redirected to the home page
6. If there are errors, a message tells you what went wrong

**Example Registration:**

- Username: `john_doe`
- Email: `john@example.com`
- Password: `secure123`
- Confirm: `secure123`

### 4. Using the Home Page

Once logged in:

- Your username is displayed in the top-right: "Logged in as: [username]"
- Click the **Logout** button to end your session
- You'll be redirected to the Sign In page

### 5. Access Control

- **Unauthenticated users cannot access the home page** - they'll be redirected to Sign In
- **Authenticated users cannot access Sign In/Register pages** - they'll be redirected to Home
- **Logging out** clears your session and returns you to Sign In

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
