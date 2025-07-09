# 🎨 AWIBI MEDTECH - Frontend Development Guide

**Version:** 1.0.0  
**Date:** July 9, 2025  
**Author:** Manus AI  
**Status:** Draft  

---

## 🎯 Purpose of this Document

This comprehensive guide is designed to take you on a complete journey through the frontend development of the AWIBI MEDTECH application. As a beginner-friendly resource, it will explain every concept, every line of code, and every decision made in building the React.js frontend. You will learn not just 'what' the code does, but 'why' it's written that way, 'how' it contributes to the overall application, and 'what' you achieve by implementing each feature. By the end of this guide, you will have a deep understanding of modern React development, state management, routing, API integration, authentication, and much more. This is not just a code walkthrough—it's a complete learning experience that will enable you to build similar applications from scratch.

---

## 🏗️ Frontend Architecture Overview

The AWIBI MEDTECH frontend is built using React.js, a powerful JavaScript library for building user interfaces. React follows a component-based architecture, where the UI is broken down into small, reusable pieces called components. This approach promotes code reusability, maintainability, and makes complex applications easier to understand and debug. [1]

### Why React.js?

React was chosen for this project for several compelling reasons:

1. **Component-Based Architecture:** React allows us to build encapsulated components that manage their own state, then compose them to make complex UIs. This means we can create a `Button` component once and use it throughout the application, ensuring consistency and reducing code duplication.

2. **Virtual DOM:** React uses a virtual representation of the DOM (Document Object Model) in memory, which allows it to efficiently update only the parts of the actual DOM that have changed. This results in better performance, especially for applications with frequent updates. [2]

3. **Unidirectional Data Flow:** Data flows in one direction in React applications, making it easier to understand how data changes affect the UI. This predictability is crucial for debugging and maintaining large applications.

4. **Rich Ecosystem:** React has a vast ecosystem of libraries and tools, including React Router for navigation, Axios for HTTP requests, and many UI component libraries.

5. **Community and Support:** React is maintained by Facebook (Meta) and has a large, active community, ensuring long-term support and continuous improvement.

### Build Tool: Vite

Instead of the traditional Create React App, this project uses Vite as the build tool. Vite offers several advantages:

1. **Lightning-Fast Development:** Vite provides instant server start and extremely fast Hot Module Replacement (HMR), meaning changes to your code are reflected in the browser almost instantly.

2. **Optimized Production Builds:** Vite uses Rollup for production builds, resulting in highly optimized bundles with features like tree-shaking (removing unused code) and code splitting.

3. **Modern JavaScript Support:** Vite supports modern JavaScript features out of the box, including ES modules, TypeScript, and JSX.

4. **Plugin Ecosystem:** Vite has a rich plugin ecosystem that allows for easy integration with various tools and frameworks.

---

## 📁 Detailed Frontend Structure

Let's examine the frontend structure in detail, understanding the purpose and logic behind each directory and file:

```
frontend/awibi-medtech-frontend/
├── public/                  # Static assets served directly by the web server
│   ├── favicon.ico          # Website icon displayed in browser tabs
│   └── index.html           # HTML template that serves as the entry point
├── src/                     # Source code directory - where all our React code lives
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Navigation header component
│   │   ├── LoadingSpinner.jsx # Loading indicator component
│   │   ├── DashboardWidgets.jsx # Dashboard-specific UI components
│   │   └── SearchableEventsList.jsx # Events list with search functionality
│   ├── contexts/            # React Context API for global state management
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── data/                # Static data and mock data for the application
│   │   ├── chapters.js      # Chapter information and data
│   │   ├── events.js        # Event information and data
│   │   ├── badges.js        # Badge system data
│   │   ├── users.js         # User data for demonstration
│   │   └── dashboard.js     # Dashboard-specific data and utilities
│   ├── lib/                 # Utility functions and configurations
│   │   └── api.js           # API client configuration and HTTP request utilities
│   ├── pages/               # Top-level components representing different application views
│   │   ├── HomePage.jsx     # Landing page of the application
│   │   ├── LoginPage.jsx    # User authentication page
│   │   ├── RegisterPage.jsx # User registration page
│   │   ├── DashboardPage.jsx # User dashboard after login
│   │   ├── ChaptersPage.jsx # Chapter discovery and management
│   │   ├── EventsPage.jsx   # Event browsing and management
│   │   ├── CommunityPage.jsx # Community features and networking
│   │   ├── CertificationPage.jsx # Certification and badge system
│   │   ├── ProfilePage.jsx  # User profile management
│   │   └── SettingsPage.jsx # Application settings and preferences
│   ├── App.jsx              # Main application component with routing
│   ├── App.css              # Global CSS styles
│   └── main.jsx             # Application entry point and React DOM rendering
├── .env                     # Development environment variables
├── .env.production          # Production environment variables
├── package.json             # Project metadata, dependencies, and scripts
├── vite.config.js           # Vite build tool configuration
└── tailwind.config.js       # Tailwind CSS framework configuration
```

---

## 🚀 Installation and Setup Process

Before diving into the code, let's understand the installation and setup process. This section will walk you through setting up the development environment and explain why each step is necessary.

### Prerequisites

Before starting, you need to have Node.js installed on your system. Node.js is a JavaScript runtime that allows you to run JavaScript outside of a web browser. It comes with npm (Node Package Manager), which is used to install and manage JavaScript packages. [3]

**Why Node.js?**
Even though we're building a frontend application that runs in the browser, we need Node.js for the development tools, build process, and package management. Modern frontend development relies heavily on build tools, transpilers, and bundlers that run on Node.js.

### Step 1: Project Initialization

```bash
# Navigate to the frontend directory
cd frontend/awibi-medtech-frontend

# Install all dependencies listed in package.json
npm install
```

**What happens during `npm install`?**
When you run `npm install`, npm reads the `package.json` file and downloads all the packages listed in the `dependencies` and `devDependencies` sections. These packages are stored in a `node_modules` directory. This process ensures that everyone working on the project has the exact same versions of all libraries, preventing compatibility issues.

### Step 2: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your specific configuration
# For development, you might have:
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-development-google-client-id
```

**Why Environment Variables?**
Environment variables allow the application to behave differently in different environments (development, testing, production) without changing the source code. For example, in development, you might connect to a local backend server, while in production, you connect to a cloud-hosted server.

### Step 3: Development Server

```bash
# Start the development server
npm run dev
```

**What happens when you run `npm run dev`?**
This command starts the Vite development server, which:
1. Compiles your React code and makes it available in the browser
2. Watches for file changes and automatically reloads the browser when you save changes
3. Provides helpful error messages and debugging information
4. Serves the application on a local port (usually http://localhost:5173)

---

## 📦 Understanding package.json

The `package.json` file is the heart of any Node.js project. Let's examine the frontend's `package.json` in detail:

```json
{
  "name": "awibi-medtech-frontend",
  "version": "3.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "axios": "^1.6.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  }
}
```

### Breaking Down Each Section:

**Basic Information:**
- `name`: The project name, used for identification and publishing
- `version`: Follows semantic versioning (major.minor.patch)
- `type`: "module" indicates this project uses ES6 modules instead of CommonJS

**Scripts Section:**
Scripts are custom commands that can be run with `npm run <script-name>`. Each script serves a specific purpose:

- `dev`: Starts the development server using Vite. This is what you use during development to see your changes in real-time.
- `build`: Creates an optimized production build of the application. This generates static files that can be deployed to a web server.
- `preview`: Allows you to preview the production build locally before deploying.
- `lint`: Runs ESLint to check for code quality issues and potential bugs.

**Dependencies vs DevDependencies:**

**Dependencies** are packages required for the application to run in production:
- `react` and `react-dom`: The core React library and DOM renderer
- `react-router-dom`: Enables client-side routing (navigation between pages)
- `axios`: HTTP client for making API requests to the backend
- `lucide-react`: Icon library providing beautiful, customizable icons

**DevDependencies** are packages only needed during development:
- `@vitejs/plugin-react`: Vite plugin that enables React support
- `vite`: The build tool and development server
- `tailwindcss`, `autoprefixer`, `postcss`: CSS framework and processing tools

---

## 🎨 Styling with Tailwind CSS

The AWIBI MEDTECH frontend uses Tailwind CSS, a utility-first CSS framework. Understanding Tailwind is crucial for working with this project's styling approach.

### What is Tailwind CSS?

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs directly in your markup. Instead of writing custom CSS, you compose styles using pre-defined classes. [4]

### Why Tailwind CSS?

1. **Rapid Development:** You can style components quickly without writing custom CSS
2. **Consistency:** Predefined spacing, colors, and sizing ensure design consistency
3. **Responsive Design:** Built-in responsive utilities make it easy to create mobile-friendly designs
4. **Customization:** Highly customizable through configuration files
5. **Performance:** Only the CSS you actually use is included in the final build

### Tailwind Configuration

The `tailwind.config.js` file customizes Tailwind for the project:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**What this configuration does:**
- `content`: Tells Tailwind which files to scan for class names
- `theme.extend.colors`: Defines custom color palette for the brand
- `theme.extend.fontFamily`: Sets custom fonts for the application

### Example of Tailwind in Action

Here's how Tailwind classes translate to CSS:

```jsx
// Tailwind classes
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>

// Equivalent CSS
.button {
  background-color: #3b82f6;  /* bg-blue-500 */
  color: white;               /* text-white */
  font-weight: bold;          /* font-bold */
  padding-top: 0.5rem;        /* py-2 */
  padding-bottom: 0.5rem;     /* py-2 */
  padding-left: 1rem;         /* px-4 */
  padding-right: 1rem;        /* px-4 */
  border-radius: 0.25rem;     /* rounded */
}

.button:hover {
  background-color: #1d4ed8;  /* hover:bg-blue-700 */
}
```

---

## 🔧 Main Entry Point: main.jsx

The `main.jsx` file is the entry point of the React application. This is where React takes control and renders the application into the DOM.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Understanding Each Part:

**Imports:**
- `React`: The core React library (though not always explicitly needed in modern React)
- `ReactDOM`: Provides DOM-specific methods for React
- `App`: The main application component
- `./App.css`: Global CSS styles

**ReactDOM.createRoot():**
This is the new way to render React applications (introduced in React 18). It creates a root container and renders the App component into the DOM element with id 'root'.

**React.StrictMode:**
StrictMode is a development tool that helps identify potential problems in the application. It:
- Identifies components with unsafe lifecycles
- Warns about legacy string ref API usage
- Warns about deprecated findDOMNode usage
- Detects unexpected side effects
- Helps ensure components are reusable

**Why this structure?**
This entry point pattern separates concerns: `main.jsx` handles the rendering logic, while `App.jsx` contains the application logic. This makes the codebase more organized and easier to test.

---

## 🏠 The App Component: App.jsx

The `App.jsx` file is the root component of the application. It sets up routing, global providers, and the overall application structure.

```jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ChaptersPage from './pages/ChaptersPage'
import EventsPage from './pages/EventsPage'
import CommunityPage from './pages/CommunityPage'
import CertificationPage from './pages/CertificationPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AuthCallbackPage from './pages/AuthCallbackPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chapters" element={<ChaptersPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/certification" element={<CertificationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
```

### Understanding the App Component Structure:

**Imports Section:**
The imports are organized logically:
1. React and routing libraries
2. Context providers for global state
3. Shared components (Header)
4. Page components

**AuthProvider Wrapper:**
The entire application is wrapped in `AuthProvider`, which provides authentication state to all child components. This is an example of the React Context API, which allows data to be passed down through the component tree without having to pass props manually at every level.

**Router Setup:**
`BrowserRouter` (aliased as `Router`) enables client-side routing. This means users can navigate between different pages without full page reloads, creating a smooth, app-like experience.

**Layout Structure:**
```jsx
<div className="min-h-screen bg-gray-50">
  <Header />
  <main className="container mx-auto px-4 py-8">
    {/* Routes go here */}
  </main>
</div>
```

This creates a consistent layout where:
- `min-h-screen`: Ensures the app takes at least the full viewport height
- `bg-gray-50`: Sets a light gray background
- `Header`: Always visible navigation
- `main`: Contains the page content with responsive container and padding

**Routes Configuration:**
Each `Route` component maps a URL path to a specific page component:
- `/` → HomePage (landing page)
- `/login` → LoginPage (authentication)
- `/dashboard` → DashboardPage (user dashboard after login)
- And so on...

**Why this structure?**
This structure provides:
1. **Single Page Application (SPA) behavior:** Fast navigation without page reloads
2. **Consistent layout:** Header and main container are shared across all pages
3. **Global state management:** AuthProvider makes authentication state available everywhere
4. **Scalability:** Easy to add new routes and pages

---

## 🔐 Authentication Context: AuthContext.jsx

The AuthContext is a crucial part of the application that manages user authentication state globally. Understanding this concept is essential for modern React applications.

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          // Verify token with backend
          const response = await api.get('/auth/verify')
          if (response.data.success) {
            setUser(response.data.user)
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('authToken')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('authToken')
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await api.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const { user, token } = response.data.data
        
        // Store token in localStorage
        localStorage.setItem('authToken', token)
        
        // Update state
        setUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await api.post('/auth/register', userData)
      
      if (response.data.success) {
        const { user, token } = response.data.data
        
        localStorage.setItem('authToken', token)
        setUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Understanding the Authentication Context:

**What is React Context?**
React Context is a way to pass data through the component tree without having to pass props down manually at every level. It's particularly useful for global state like user authentication, theme settings, or language preferences. [5]

**Why use Context for Authentication?**
Authentication state needs to be accessible from many different components throughout the application. Without Context, you would need to pass user data as props through many intermediate components that don't actually need it (prop drilling).

**Key Components of AuthContext:**

1. **State Variables:**
   - `user`: Contains user information when logged in
   - `loading`: Indicates if an authentication operation is in progress
   - `isAuthenticated`: Boolean flag for authentication status

2. **useEffect Hook for Persistence:**
   ```jsx
   useEffect(() => {
     const checkAuthStatus = async () => {
       // Check if user was previously logged in
     }
     checkAuthStatus()
   }, [])
   ```
   This runs when the component mounts and checks if the user was previously logged in by looking for a stored authentication token.

3. **Authentication Methods:**
   - `login()`: Handles user login with email/password
   - `logout()`: Clears user session and redirects
   - `register()`: Handles new user registration

**How Token-Based Authentication Works:**
1. User provides credentials (email/password)
2. Backend validates credentials and returns a JWT token
3. Frontend stores token in localStorage
4. Token is included in subsequent API requests
5. Backend validates token for protected routes

**Custom Hook Pattern:**
```jsx
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

This custom hook provides a clean way to access authentication state in any component:
```jsx
// In any component
const { user, isAuthenticated, login, logout } = useAuth()
```

**Error Handling:**
The context includes comprehensive error handling for network failures, invalid credentials, and token expiration, ensuring the application gracefully handles authentication issues.

---

## 🌐 API Integration: lib/api.js

The API client is the bridge between the frontend and backend. It handles all HTTP requests and provides a centralized way to communicate with the server.

```jsx
import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    
    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access denied')
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - check your connection')
    }
    
    return Promise.reject(error)
  }
)

export { api }
```

### Understanding the API Client:

**Axios Configuration:**
Axios is a popular HTTP client library for JavaScript. The configuration includes:

- `baseURL`: The backend server URL, loaded from environment variables
- `withCredentials`: Enables sending cookies and authentication headers
- `timeout`: Prevents requests from hanging indefinitely
- `headers`: Sets default headers for all requests

**Request Interceptor:**
```jsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

This interceptor automatically adds the authentication token to every request, so you don't have to manually include it each time.

**Response Interceptor:**
The response interceptor handles common error scenarios:
- **401 Unauthorized:** Token expired or invalid - automatically logs out user
- **403 Forbidden:** User doesn't have permission for the requested resource
- **Network Errors:** Connection issues or server unavailable

**Why this approach?**
1. **Centralized Configuration:** All API settings in one place
2. **Automatic Authentication:** Tokens are added automatically
3. **Consistent Error Handling:** Common errors handled globally
4. **Environment Flexibility:** Different URLs for development and production

**Usage Example:**
```jsx
// In a component
import { api } from '../lib/api'

const fetchUserData = async () => {
  try {
    const response = await api.get('/users/profile')
    setUserData(response.data)
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
}
```

---

## 🧩 Component Architecture

React applications are built using components - reusable pieces of UI that encapsulate their own logic and styling. Let's examine the component architecture used in AWIBI MEDTECH.

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── Router
├── Header (Shared Component)
└── Routes
    ├── HomePage
    ├── LoginPage
    ├── DashboardPage
    │   └── DashboardWidgets
    ├── ChaptersPage
    │   └── SearchableChaptersList
    ├── EventsPage
    │   └── SearchableEventsList
    └── ... other pages
```

### Types of Components

**1. Page Components (pages/):**
These are top-level components that represent entire views or pages in the application. They typically:
- Handle page-specific state
- Coordinate multiple smaller components
- Manage data fetching for the page
- Define the overall layout and structure

**2. Shared Components (components/):**
These are reusable components used across multiple pages:
- Header: Navigation and user menu
- LoadingSpinner: Loading indicator
- DashboardWidgets: Dashboard-specific UI elements

**3. Context Providers (contexts/):**
These manage global application state:
- AuthContext: User authentication state

Let's examine some key components in detail:

---

## 🏠 HomePage Component

The HomePage is the landing page of the application. It showcases the platform's features and encourages user engagement.

```jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Users, MapPin, Calendar, Award } from 'lucide-react'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🚀 Transforming Healthcare Through Technology
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Empowering The{' '}
              <span className="text-blue-600">Future of MedTech</span>{' '}
              Innovation
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with passionate innovators worldwide as we build a future 
              where medical technology breaks barriers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Join Our Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2000 +</div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Active Chapters</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">Events Hosted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AWIBI MedTech?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join a global community of healthcare innovators and access 
              resources that accelerate your impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Global Community
              </h3>
              <p className="text-gray-600">
                Connect with healthcare innovators from around the world
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Local Chapters
              </h3>
              <p className="text-gray-600">
                Find and join chapters in your area for local networking
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Events & Workshops
              </h3>
              <p className="text-gray-600">
                Attend exclusive events and hands-on workshops
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Certifications
              </h3>
              <p className="text-gray-600">
                Earn recognized certifications and showcase your expertise
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
```

### Understanding the HomePage Component:

**Component Structure:**
The HomePage is organized into logical sections:
1. **Hero Section:** Main value proposition and call-to-action
2. **Stats Section:** Key metrics to build credibility
3. **Features Section:** Core benefits of the platform

**Conditional Rendering:**
```jsx
{!isAuthenticated ? (
  // Show Join/Sign In buttons for guests
) : (
  // Show Dashboard link for logged-in users
)}
```

This demonstrates React's conditional rendering, where different UI elements are shown based on the user's authentication status.

**React Router Integration:**
```jsx
import { Link } from 'react-router-dom'

<Link to="/register" className="...">
  Join Our Community
</Link>
```

The `Link` component from React Router enables client-side navigation without page reloads, maintaining the SPA experience.

**Icon Integration:**
```jsx
import { ArrowRight, Users, MapPin, Calendar, Award } from 'lucide-react'

<ArrowRight className="ml-2 h-5 w-5" />
```

Lucide React provides beautiful, customizable icons that enhance the visual appeal and usability of the interface.

**Responsive Design:**
```jsx
className="text-5xl md:text-6xl font-bold"
className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
```

Tailwind's responsive prefixes (`md:`, `lg:`) ensure the layout adapts to different screen sizes.

**What this achieves:**
1. **First Impression:** Creates a professional, trustworthy first impression
2. **Clear Value Proposition:** Immediately communicates what the platform offers
3. **User Guidance:** Directs users to appropriate actions based on their status
4. **Social Proof:** Statistics build credibility and encourage engagement

---

## 🔐 LoginPage Component

The LoginPage handles user authentication with both email/password and Google OAuth options.

```jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setErrors({ general: result.message })
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your AWIBI MEDTECH account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {errors.general}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">OR CONTINUE WITH EMAIL</span>
              </div>
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up here
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
```

### Understanding the LoginPage Component:

**State Management:**
```jsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
})
const [showPassword, setShowPassword] = useState(false)
const [errors, setErrors] = useState({})
const [isLoading, setIsLoading] = useState(false)
```

The component uses multiple state variables to manage:
- **formData:** User input for email and password
- **showPassword:** Toggle for password visibility
- **errors:** Form validation errors
- **isLoading:** Loading state during authentication

**Form Handling:**
```jsx
const handleInputChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
  
  // Clear error when user starts typing
  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }
}
```

This function demonstrates:
- **Object Destructuring:** `const { name, value } = e.target`
- **Spread Operator:** `...prev` to maintain existing state
- **Dynamic Property Names:** `[name]: value` to update the correct field
- **User Experience:** Clearing errors when user starts typing

**Form Validation:**
```jsx
const validateForm = () => {
  const newErrors = {}
  
  if (!formData.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address'
  }
  
  if (!formData.password) {
    newErrors.password = 'Password is required'
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters'
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

This validation function:
- Checks for required fields
- Validates email format using regex
- Enforces minimum password length
- Returns boolean indicating if form is valid

**Async Form Submission:**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) {
    return
  }
  
  setIsLoading(true)
  
  try {
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setErrors({ general: result.message })
    }
  } catch (error) {
    setErrors({ general: 'An unexpected error occurred. Please try again.' })
  } finally {
    setIsLoading(false)
  }
}
```

This demonstrates:
- **Event Prevention:** `e.preventDefault()` stops form's default submission
- **Async/Await:** Modern JavaScript for handling promises
- **Error Handling:** Try-catch for robust error management
- **Navigation:** Programmatic navigation on successful login
- **Loading States:** User feedback during async operations

**Conditional Styling:**
```jsx
className={`block w-full pl-10 pr-3 py-2 border ${
  errors.email ? 'border-red-300' : 'border-gray-300'
} rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
```

This shows how to conditionally apply CSS classes based on component state, providing visual feedback for validation errors.

**What this achieves:**
1. **User Authentication:** Secure login with validation
2. **Multiple Auth Methods:** Email/password and Google OAuth
3. **User Experience:** Real-time validation and feedback
4. **Security:** Client-side validation (complemented by server-side)
5. **Accessibility:** Proper labels, focus management, and keyboard navigation

---

This concludes the first major section of the Frontend Development Guide. The document will continue with detailed explanations of routing, state management, component patterns, and advanced React concepts.




## 🧭 React Router and Navigation

React Router is the standard routing library for React applications. It enables the creation of single-page applications (SPAs) with multiple views, where navigation between pages happens without full page reloads. Understanding React Router is crucial for building modern web applications.

### What is Client-Side Routing?

Traditional web applications use server-side routing, where each URL corresponds to a different HTML page served by the server. When a user clicks a link, the browser makes a new request to the server, which responds with a completely new page. This results in full page reloads and can feel slow and disjointed.

Client-side routing, implemented by React Router, allows the JavaScript application to handle navigation. When a user clicks a link, JavaScript updates the URL and renders the appropriate component without making a new server request. This creates a smooth, app-like experience. [6]

### React Router Setup in App.jsx

Let's examine how React Router is configured in the main App component:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chapters" element={<ChaptersPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/certification" element={<CertificationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}
```

### Understanding Router Components:

**BrowserRouter (aliased as Router):**
```jsx
<Router>
  {/* Application content */}
</Router>
```

BrowserRouter is the top-level router component that uses the HTML5 history API to keep the UI in sync with the URL. It must wrap all other router components and should be placed as high as possible in the component tree.

**Routes and Route:**
```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
</Routes>
```

- **Routes:** A container that holds all Route components. It ensures that only one route is rendered at a time.
- **Route:** Defines a mapping between a URL path and a React component. When the current URL matches the path, the specified element is rendered.

### Navigation with Link Components

React Router provides the `Link` component for navigation. Let's see how it's used in the Header component:

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AWIBI MEDTECH</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/chapters"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Chapters
            </Link>
            <Link
              to="/events"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Events
            </Link>
            <Link
              to="/community"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Community
            </Link>
            <Link
              to="/certification"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Certification
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:block">{user?.firstName || 'User'}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
```

### Understanding Navigation Concepts:

**Link vs Anchor Tags:**
```jsx
// React Router Link (preferred for internal navigation)
<Link to="/dashboard">Dashboard</Link>

// Regular anchor tag (causes full page reload)
<a href="/dashboard">Dashboard</a>
```

Always use `Link` for internal navigation to maintain the SPA experience. Use anchor tags only for external links.

**Programmatic Navigation:**
```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

const handleLogout = () => {
  logout()
  navigate('/') // Programmatically navigate to home page
}
```

The `useNavigate` hook allows you to navigate programmatically, useful for redirecting after form submissions or user actions.

**Conditional Navigation:**
```jsx
{isAuthenticated ? (
  // Show user menu and dashboard link
) : (
  // Show login and register links
)}
```

The navigation adapts based on user authentication status, providing relevant options for each user state.

### Advanced Routing Patterns

**Protected Routes:**
While not explicitly shown in the current code, protected routes are a common pattern for restricting access to certain pages:

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Usage in App.jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

**Route Parameters:**
For dynamic routes with parameters:

```jsx
// Route definition
<Route path="/chapters/:chapterId" element={<ChapterDetailPage />} />

// In the component
import { useParams } from 'react-router-dom'

const ChapterDetailPage = () => {
  const { chapterId } = useParams()
  // Use chapterId to fetch specific chapter data
}
```

**Query Parameters:**
For handling URL query strings:

```jsx
import { useSearchParams } from 'react-router-dom'

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category')
  
  // Update URL with new search parameters
  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory })
  }
}
```

### What Navigation Achieves:

1. **Seamless User Experience:** No page reloads, instant navigation
2. **Bookmarkable URLs:** Users can bookmark and share specific pages
3. **Browser History:** Back/forward buttons work as expected
4. **SEO Benefits:** Search engines can crawl different routes
5. **State Preservation:** Application state is maintained during navigation

---

## 🔄 State Management Patterns

State management is one of the most important concepts in React development. It determines how data flows through your application and how components communicate with each other. The AWIBI MEDTECH application uses several state management patterns, each suited for different scenarios.

### Types of State in React

**1. Local Component State:**
State that belongs to a single component and doesn't need to be shared.

```jsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
})
```

**2. Shared State (Props):**
State passed from parent to child components.

```jsx
// Parent component
const [user, setUser] = useState(null)

// Passing to child
<UserProfile user={user} onUpdate={setUser} />
```

**3. Global State (Context):**
State that needs to be accessible from many components throughout the application.

```jsx
// AuthContext provides authentication state globally
const { user, isAuthenticated } = useAuth()
```

### useState Hook Deep Dive

The `useState` hook is the foundation of state management in functional React components. Let's examine its usage patterns:

**Basic Usage:**
```jsx
const [count, setCount] = useState(0)

// Reading state
console.log(count) // 0

// Updating state
setCount(1) // Sets count to 1
setCount(count + 1) // Increments count
```

**Object State:**
```jsx
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: ''
})

// Updating object state (wrong way)
setFormData({ email: 'new@email.com' }) // This overwrites the entire object!

// Updating object state (correct way)
setFormData(prev => ({
  ...prev,
  email: 'new@email.com'
}))
```

**Functional Updates:**
```jsx
// When new state depends on previous state
setCount(prevCount => prevCount + 1)

// Useful for avoiding stale closures in event handlers
const handleIncrement = () => {
  setCount(prevCount => prevCount + 1)
}
```

**Array State:**
```jsx
const [items, setItems] = useState([])

// Adding an item
setItems(prev => [...prev, newItem])

// Removing an item
setItems(prev => prev.filter(item => item.id !== itemId))

// Updating an item
setItems(prev => prev.map(item => 
  item.id === itemId ? { ...item, ...updates } : item
))
```

### useEffect Hook for Side Effects

The `useEffect` hook handles side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.

**Basic Syntax:**
```jsx
useEffect(() => {
  // Side effect code
}, [dependencies])
```

**Common Patterns:**

**1. Component Mount (runs once):**
```jsx
useEffect(() => {
  // Fetch initial data
  fetchUserData()
}, []) // Empty dependency array
```

**2. Dependency-based Updates:**
```jsx
useEffect(() => {
  // Runs when userId changes
  fetchUserProfile(userId)
}, [userId])
```

**3. Cleanup:**
```jsx
useEffect(() => {
  const subscription = subscribeToUpdates()
  
  // Cleanup function
  return () => {
    subscription.unsubscribe()
  }
}, [])
```

**Real Example from AuthContext:**
```jsx
useEffect(() => {
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        const response = await api.get('/auth/verify')
        if (response.data.success) {
          setUser(response.data.user)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('authToken')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  checkAuthStatus()
}, []) // Runs once on component mount
```

This effect:
1. Runs once when the AuthProvider mounts
2. Checks if there's a stored authentication token
3. Verifies the token with the backend
4. Updates authentication state based on the result
5. Handles errors gracefully

### React Context API

The Context API provides a way to pass data through the component tree without having to pass props down manually at every level. It's perfect for global state like authentication, theme, or language settings.

**Creating a Context:**
```jsx
import { createContext, useContext } from 'react'

const AuthContext = createContext()
```

**Custom Hook for Context:**
```jsx
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

This pattern provides:
1. **Type Safety:** Ensures the hook is used within the provider
2. **Better Error Messages:** Clear error when context is used incorrectly
3. **Cleaner API:** Components just call `useAuth()` instead of `useContext(AuthContext)`

**Provider Component:**
```jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Authentication methods
  const login = async (email, password) => {
    // Login logic
  }

  const logout = () => {
    // Logout logic
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Using Context in Components:**
```jsx
const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Form State Management

Forms are a common source of complex state management. Let's examine the patterns used in the LoginPage:

**Form Data State:**
```jsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
})
```

**Generic Input Handler:**
```jsx
const handleInputChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
  
  // Clear error when user starts typing
  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }
}
```

This handler:
1. **Uses Object Destructuring:** Extracts `name` and `value` from the event target
2. **Dynamic Property Updates:** Uses `[name]: value` to update the correct field
3. **Preserves Other Fields:** Uses spread operator to maintain other form fields
4. **Provides User Feedback:** Clears validation errors when user starts typing

**Validation State:**
```jsx
const [errors, setErrors] = useState({})

const validateForm = () => {
  const newErrors = {}
  
  if (!formData.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address'
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

**Loading State:**
```jsx
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) return
  
  setIsLoading(true)
  try {
    // Async operation
  } finally {
    setIsLoading(false)
  }
}
```

### State Management Best Practices

**1. Keep State Close to Where It's Used:**
Don't lift state up unnecessarily. If only one component needs the state, keep it local.

**2. Use the Right Tool for the Job:**
- Local state: `useState`
- Global state: Context API
- Complex state logic: `useReducer`
- Server state: React Query or SWR

**3. Avoid Prop Drilling:**
If you're passing props through many levels, consider using Context.

**4. Immutable Updates:**
Always create new objects/arrays when updating state:

```jsx
// Wrong
user.name = 'New Name'
setUser(user)

// Right
setUser(prev => ({ ...prev, name: 'New Name' }))
```

**5. Batch Related State:**
Group related state variables together:

```jsx
// Instead of separate states
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

// Use object state
const [formData, setFormData] = useState({
  email: '',
  password: ''
})
```

### What State Management Achieves:

1. **Data Flow Control:** Determines how data moves through the application
2. **Component Communication:** Enables components to share information
3. **User Interface Updates:** Triggers re-renders when data changes
4. **Application Consistency:** Ensures all components show the same data
5. **User Experience:** Provides responsive, interactive interfaces

---

## 📊 Data Management and API Integration

Modern web applications rely heavily on data from external sources, typically through APIs (Application Programming Interfaces). The AWIBI MEDTECH frontend demonstrates several patterns for fetching, managing, and displaying data from the backend API.

### Understanding API Integration

An API is a set of rules and protocols that allows different software applications to communicate with each other. In our case, the React frontend communicates with the Node.js backend through HTTP requests to exchange data.

**Common HTTP Methods:**
- **GET:** Retrieve data (e.g., fetch user profile)
- **POST:** Create new data (e.g., register new user)
- **PUT/PATCH:** Update existing data (e.g., update user profile)
- **DELETE:** Remove data (e.g., delete user account)

### Axios Configuration Deep Dive

Let's examine the API client configuration in detail:

```jsx
import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
```

**Configuration Options Explained:**

**baseURL:**
```jsx
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
```
This sets the base URL for all API requests. Environment variables allow different URLs for development and production without changing code.

**withCredentials:**
```jsx
withCredentials: true
```
This enables sending cookies and authentication headers with cross-origin requests, essential for authentication.

**timeout:**
```jsx
timeout: 10000
```
Sets a 10-second timeout for requests, preventing them from hanging indefinitely if the server is unresponsive.

**headers:**
```jsx
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```
These headers tell the server that we're sending and expecting JSON data.

### Request and Response Interceptors

Interceptors allow you to transform requests and responses globally, providing a centralized place for common logic like authentication and error handling.

**Request Interceptor:**
```jsx
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
```

This interceptor:
1. **Runs Before Every Request:** Automatically executed for all API calls
2. **Adds Authentication:** Includes the JWT token in the Authorization header
3. **Conditional Logic:** Only adds token if it exists in localStorage
4. **Returns Modified Config:** The modified request configuration is used for the actual request

**Response Interceptor:**
```jsx
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    
    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access denied')
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - check your connection')
    }
    
    return Promise.reject(error)
  }
)
```

This interceptor:
1. **Handles Successful Responses:** Passes them through unchanged
2. **Centralizes Error Handling:** Common error scenarios handled globally
3. **Automatic Logout:** Removes invalid tokens and redirects to login
4. **User Feedback:** Provides appropriate error messages

### Data Fetching Patterns

Let's examine how data is fetched and managed in different components:

**Simple Data Fetching (ChaptersPage):**
```jsx
import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { chaptersData } from '../data/chapters'

const ChaptersPage = () => {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch from API first
        const response = await api.get('/chapters')
        if (response.data.success) {
          setChapters(response.data.data)
        } else {
          // Fallback to static data
          setChapters(chaptersData)
        }
      } catch (error) {
        console.error('Failed to fetch chapters:', error)
        // Use static data as fallback
        setChapters(chaptersData)
        setError('Failed to load chapters from server. Showing cached data.')
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [])

  const filteredChapters = chapters.filter(chapter =>
    chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AWIBI MEDTECH Chapters
        </h1>
        <p className="text-lg text-gray-600">
          Find and connect with local chapters in your area
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search chapters by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {/* Chapters Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map((chapter) => (
          <div key={chapter.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {chapter.name}
              </h3>
              <p className="text-gray-600 mb-4">{chapter.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {chapter.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {chapter.memberCount} members
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Next event: {chapter.nextEvent}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Join Chapter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No chapters found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}

export default ChaptersPage
```

### Understanding the Data Fetching Pattern:

**State Management for Data:**
```jsx
const [chapters, setChapters] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
```

This pattern uses three pieces of state:
- **Data State:** Holds the actual data
- **Loading State:** Indicates if a request is in progress
- **Error State:** Stores any error messages

**useEffect for Data Fetching:**
```jsx
useEffect(() => {
  const fetchChapters = async () => {
    // Fetch logic
  }
  fetchChapters()
}, [])
```

The empty dependency array `[]` ensures this effect runs only once when the component mounts.

**Error Handling and Fallbacks:**
```jsx
try {
  const response = await api.get('/chapters')
  if (response.data.success) {
    setChapters(response.data.data)
  } else {
    setChapters(chaptersData) // Fallback to static data
  }
} catch (error) {
  setChapters(chaptersData) // Fallback on error
  setError('Failed to load chapters from server. Showing cached data.')
}
```

This approach provides:
1. **Graceful Degradation:** App continues to work even if API fails
2. **User Feedback:** Clear error messages
3. **Offline Capability:** Static data ensures basic functionality

**Client-Side Filtering:**
```jsx
const filteredChapters = chapters.filter(chapter =>
  chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  chapter.location.toLowerCase().includes(searchTerm.toLowerCase())
)
```

This demonstrates:
- **Real-time Search:** Filters update as user types
- **Case-Insensitive Search:** Uses `toLowerCase()` for better UX
- **Multiple Field Search:** Searches both name and location

### Advanced Data Patterns

**Searchable Components:**
The application includes reusable searchable components for events and chapters:

```jsx
import React, { useState, useMemo } from 'react'
import { Search, Calendar, MapPin, Users } from 'lucide-react'

const SearchableEventsList = ({ events, onEventSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
  }, [events, searchTerm, categoryFilter])

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(events.map(event => event.category))]
    return ['all', ...uniqueCategories]
  }, [events])

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onEventSelect?.(event)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {event.category}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{event.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {event.attendees} attendees
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default SearchableEventsList
```

### Understanding Advanced Patterns:

**useMemo for Performance:**
```jsx
const filteredEvents = useMemo(() => {
  return events.filter(event => {
    // Filtering logic
  })
}, [events, searchTerm, categoryFilter])
```

`useMemo` memoizes the filtered results, recalculating only when dependencies change. This prevents unnecessary filtering on every render, improving performance for large datasets.

**Dynamic Category Generation:**
```jsx
const categories = useMemo(() => {
  const uniqueCategories = [...new Set(events.map(event => event.category))]
  return ['all', ...uniqueCategories]
}, [events])
```

This creates a unique list of categories from the events data:
1. **Map:** Extracts category from each event
2. **Set:** Removes duplicates
3. **Spread:** Converts Set back to array
4. **Prepend:** Adds 'all' option

**Callback Props:**
```jsx
const SearchableEventsList = ({ events, onEventSelect }) => {
  // ...
  onClick={() => onEventSelect?.(event)}
}
```

The `onEventSelect?.()` syntax uses optional chaining to safely call the callback if it exists, making the component flexible for different use cases.

### What Data Management Achieves:

1. **Dynamic Content:** Applications can display real-time data from servers
2. **User Interaction:** Users can search, filter, and manipulate data
3. **Offline Capability:** Fallback data ensures functionality without network
4. **Performance:** Optimized filtering and memoization for smooth UX
5. **Scalability:** Patterns that work with small and large datasets

---

## 🎨 Component Design Patterns

React's component-based architecture enables several powerful design patterns that promote code reusability, maintainability, and separation of concerns. The AWIBI MEDTECH application demonstrates many of these patterns in action.

### Container vs Presentational Components

This pattern separates components into two categories:

**Container Components (Smart Components):**
- Manage state and business logic
- Handle data fetching and API calls
- Pass data and callbacks to presentational components
- Often correspond to pages or major sections

**Presentational Components (Dumb Components):**
- Focus purely on rendering UI
- Receive data through props
- Don't manage their own state (except UI state)
- Highly reusable across different contexts

**Example - DashboardPage (Container):**
```jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import DashboardWidgets from '../components/DashboardWidgets'

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/stats')
        setDashboardData(response.data.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your AWIBI MEDTECH community
        </p>
      </div>

      <DashboardWidgets 
        data={dashboardData}
        userRole={user?.role}
        onWidgetAction={handleWidgetAction}
      />
    </div>
  )
}
```

**Example - DashboardWidgets (Presentational):**
```jsx
import React from 'react'
import { Users, Calendar, Award, TrendingUp } from 'lucide-react'

const DashboardWidgets = ({ data, userRole, onWidgetAction }) => {
  const widgets = [
    {
      id: 'members',
      title: 'Community Members',
      value: data?.totalMembers || 0,
      icon: Users,
      color: 'blue',
      change: '+12%'
    },
    {
      id: 'events',
      title: 'Upcoming Events',
      value: data?.upcomingEvents || 0,
      icon: Calendar,
      color: 'green',
      change: '+5%'
    },
    {
      id: 'badges',
      title: 'Badges Earned',
      value: data?.badgesEarned || 0,
      icon: Award,
      color: 'purple',
      change: '+8%'
    },
    {
      id: 'growth',
      title: 'Monthly Growth',
      value: data?.monthlyGrowth || '0%',
      icon: TrendingUp,
      color: 'orange',
      change: '+15%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgets.map(widget => (
        <WidgetCard
          key={widget.id}
          widget={widget}
          onClick={() => onWidgetAction(widget.id)}
        />
      ))}
    </div>
  )
}

const WidgetCard = ({ widget, onClick }) => {
  const Icon = widget.icon
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-100',
    green: 'bg-green-500 text-green-100',
    purple: 'bg-purple-500 text-purple-100',
    orange: 'bg-orange-500 text-orange-100'
  }

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{widget.title}</p>
          <p className="text-2xl font-bold text-gray-900">{widget.value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[widget.color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm font-medium text-green-600">{widget.change}</span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  )
}

export default DashboardWidgets
```

### Compound Components Pattern

This pattern allows components to work together while maintaining a clean API. It's like creating a family of components that understand each other.

**Example - Modal Component:**
```jsx
import React, { createContext, useContext, useState } from 'react'
import { X } from 'lucide-react'

const ModalContext = createContext()

const Modal = ({ children, isOpen, onClose }) => {
  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              {children}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

Modal.Header = ({ children }) => {
  const { onClose } = useContext(ModalContext)
  
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  )
}

Modal.Body = ({ children }) => (
  <div className="p-6">{children}</div>
)

Modal.Footer = ({ children }) => (
  <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
    {children}
  </div>
)

// Usage
const EventModal = ({ event, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Modal.Header>Event Details</Modal.Header>
    <Modal.Body>
      <h4 className="font-semibold">{event.title}</h4>
      <p className="text-gray-600">{event.description}</p>
    </Modal.Body>
    <Modal.Footer>
      <button onClick={onClose}>Close</button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Register
      </button>
    </Modal.Footer>
  </Modal>
)
```

### Render Props Pattern

This pattern allows components to share code through a prop whose value is a function. It's particularly useful for sharing stateful logic.

**Example - Data Fetcher Component:**
```jsx
import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'

const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(url)
        setData(response.data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return children({ data, loading, error })
}

// Usage
const UserProfile = ({ userId }) => (
  <DataFetcher url={`/users/${userId}`}>
    {({ data: user, loading, error }) => {
      if (loading) return <div>Loading...</div>
      if (error) return <div>Error: {error}</div>
      if (!user) return <div>User not found</div>

      return (
        <div>
          <h2>{user.firstName} {user.lastName}</h2>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )
    }}
  </DataFetcher>
)
```

### Higher-Order Components (HOCs)

HOCs are functions that take a component and return a new component with additional functionality. They're useful for cross-cutting concerns like authentication, logging, or data fetching.

**Example - withAuth HOC:**
```jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const withAuth = (WrappedComponent, requiredRole = null) => {
  return function AuthenticatedComponent(props) {
    const { user, isAuthenticated, loading } = useAuth()

    if (loading) {
      return <LoadingSpinner />
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}

// Usage
const AdminPanel = () => (
  <div>
    <h1>Admin Panel</h1>
    {/* Admin-only content */}
  </div>
)

export default withAuth(AdminPanel, 'admin')
```

### Custom Hooks Pattern

Custom hooks allow you to extract component logic into reusable functions. They're perfect for sharing stateful logic between components.

**Example - useLocalStorage Hook:**
```jsx
import { useState, useEffect } from 'react'

const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

// Usage
const UserPreferences = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'en')

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  )
}
```

**Example - useApi Hook:**
```jsx
import { useState, useEffect } from 'react'
import { api } from '../lib/api'

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { immediate = true, ...apiOptions } = options

  const execute = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(url, apiOptions)
      setData(response.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [url, immediate])

  return { data, loading, error, refetch: execute }
}

// Usage
const EventsList = () => {
  const { data: events, loading, error, refetch } = useApi('/events')

  if (loading) return <div>Loading events...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <button onClick={refetch}>Refresh Events</button>
      {events?.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  )
}
```

### Component Composition

React encourages composition over inheritance. This means building complex components by combining simpler ones rather than extending classes.

**Example - Card Component System:**
```jsx
// Base Card component
const Card = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
)

// Card sub-components
Card.Header = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
)

Card.Body = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
)

Card.Footer = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
    {children}
  </div>
)

// Usage - Event Card
const EventCard = ({ event }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <Card.Header>
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-sm text-gray-500">{event.date}</p>
    </Card.Header>
    <Card.Body>
      <p className="text-gray-600">{event.description}</p>
    </Card.Body>
    <Card.Footer>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Register
      </button>
    </Card.Footer>
  </Card>
)
```

### What Component Patterns Achieve:

1. **Code Reusability:** Components can be used across different parts of the application
2. **Separation of Concerns:** Logic and presentation are clearly separated
3. **Maintainability:** Changes to one component don't affect others
4. **Testability:** Smaller, focused components are easier to test
5. **Scalability:** Patterns provide structure for growing applications
6. **Developer Experience:** Clear patterns make code easier to understand and modify

These patterns form the foundation of well-architected React applications, enabling teams to build complex, maintainable user interfaces efficiently.

---

## 📚 References

[1] React Team. (2023). *React - A JavaScript library for building user interfaces*. Retrieved from [https://reactjs.org/](https://reactjs.org/)
[2] React Team. (2023). *Virtual DOM and Internals*. Retrieved from [https://reactjs.org/docs/faq-internals.html](https://reactjs.org/docs/faq-internals.html)
[3] Node.js Foundation. (2023). *About Node.js*. Retrieved from [https://nodejs.org/en/about/](https://nodejs.org/en/about/)
[4] Tailwind Labs. (2023). *Tailwind CSS - Rapidly build modern websites*. Retrieved from [https://tailwindcss.com/](https://tailwindcss.com/)
[5] React Team. (2023). *Context - React*. Retrieved from [https://reactjs.org/docs/context.html](https://reactjs.org/docs/context.html)
[6] React Router Team. (2023). *React Router - Declarative routing for React*. Retrieved from [https://reactrouter.com/](https://reactrouter.com/)

---

**Next: Backend Development Guide**

