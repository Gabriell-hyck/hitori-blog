```
# HitoriBlog

A production-ready, full-stack blogging platform built with React 18 and Firebase. The application features Google Authentication, a real-time Firestore database, and a role-based access control system, all deployed on Vercel's edge network.

**Live Demo:** [https://hitoriblog.vercel.app](https://hitoriblog.vercel.app)

---

## Table of Contents

1.  [Core Features](#core-features)
2.  [Technology Stack](#technology-stack)
3.  [Project Architecture](#project-architecture)
4.  [Installation & Local Development](#installation--local-development)
5.  [Application Flow & Logic](#application-flow--logic)
6.  [Firebase & Firestore Configuration](#firebase--firestore-configuration)
7.  [Deployment Strategy](#deployment-strategy)
8.  [License](#license)

---

## Core Features

-   **Secure Authentication:** Google Sign-In via Firebase Auth with persistent login state managed through React Context API.
-   **Full CRUD Operations:** Authenticated users can create, read, update, and delete posts.
-   **Author-based Access Control:** Post modification is strictly limited to the original author via Firestore security rules and UI-level checks.
-   **User Profiles:** Public profile pages displaying a user's bio and a list of their published posts. Profile owners can edit their bio.
-   **Real-time Data Sync:** The homepage post list uses Firestore's `onSnapshot` for live updates without manual page refreshes.
-   **Search Functionality:** Client-side search filtering posts by title.
-   **SEO & Social Preview:** Server-rendered meta tags via `index.html` with Open Graph and Twitter Card support for rich link previews.
-   **Responsive & Modular Design:** Component-scoped styling with CSS Modules and a mobile-first layout.

## Technology Stack

| Layer            | Technology                        | Justification                                    |
| :--------------- | :-------------------------------- | :----------------------------------------------- |
| Frontend Library | React 18 (Functional Components)  | Hooks-based architecture for state management.   |
| Routing          | React Router v6                   | Declarative routing with nested layouts.         |
| Styling          | CSS Modules                       | Scoped styles eliminating class name collisions. |
| Build Tool       | Vite                              | Fast Hot Module Replacement and optimized builds.|
| Authentication   | Firebase Authentication (Google)  | OAuth 2.0 flow with minimal configuration.       |
| Database         | Cloud Firestore                   | NoSQL document store with real-time listeners.   |
| Deployment       | Vercel                            | Optimized for SPA with edge network distribution.|

## Project Architecture

The codebase follows a feature-based folder structure separating presentational components, business logic, and configuration.

```

hitoriblog/
├── public/                     # Static assets served at the root level
│   ├── logo.svg                # App favicon
│   └── banner.png              # Default OG image for social sharing
├── src/
│   ├── components/
│   │   ├── auth/               # Authentication-related views and logic
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginPage.module.css
│   │   │   └── PrivateRoute.jsx # Route guard for protected endpoints
│   │   ├── common/             # Reusable UI primitives
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.module.css
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── LoadingSpinner.module.css
│   │   │   ├── Navbar.jsx      # Main navigation and user context
│   │   │   └── Navbar.module.css
│   │   ├── layout/
│   │   │   ├── Layout.jsx      # Top-level page wrapper
│   │   │   └── Layout.module.css
│   │   ├── posts/              # Core blog post functionality
│   │   │   ├── PostCard.jsx    # Summary card for post lists
│   │   │   ├── PostCard.module.css
│   │   │   ├── PostDetail.jsx  # Full post view
│   │   │   ├── PostDetail.module.css
│   │   │   ├── PostForm.jsx    # Controlled form for creating/editing
│   │   │   ├── PostForm.module.css
│   │   │   ├── PostList.jsx    # Homepage aggregator with search
│   │   │   └── PostList.module.css
│   │   └── profile/
│   │       ├── ProfilePage.jsx # Public profile and post history
│   │       └── ProfilePage.module.css
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state provider
│   ├── firebase/
│   │   └── config.js           # Initialization of Firebase services
│   ├── hooks/
│   │   └── useAuth.js          # Custom hook for consuming AuthContext
│   ├── services/               # Data access layer (Firestore operations)
│   │   ├── postService.js
│   │   └── userService.js
│   ├── utils/
│   │   └── validation.js       # Client-side form validation rules
│   ├── App.css                 # Base application styles
│   ├── App.jsx                 # Root component with route definitions
│   ├── index.css               # Global CSS reset
│   └── main.jsx                # Application entry point
├── .env                        # Environment variables template (do not commit)
├── .gitignore
├── index.html                  # Vite entry point with SEO meta tags
├── package.json                # Project dependencies and scripts
├── README.md                   # This file
└── vite.config.js              # Vite build optimization settings

```

## Installation & Local Development

### Prerequisites

-   Node.js (version 18.0.0 or later)
-   npm (version 9.0.0 or later)
-   A Firebase Project with billing enabled (Blaze plan recommended for production, Spark plan sufficient for development)

### Step 1: Firebase Setup

Before running the application, you must configure a Firebase project. Refer to the **[Firebase & Firestore Configuration](#firebase--firestore-configuration)** section for a detailed walkthrough.

### Step 2: Environment Variables

Create a file named `.env` in the project root. The `.gitignore` file is pre-configured to exclude this file, ensuring credentials are never committed to version control.

```

VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=hitoriblog.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hitoriblog
VITE_FIREBASE_STORAGE_BUCKET=hitoriblog.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

```

### Step 3: Install Dependencies and Run

```bash
# Install all required packages
npm install

# Start the Vite development server
npm run dev
```

The application will be accessible at http://localhost:3000. All changes will be hot-reloaded instantly.

Application Flow & Logic

Authentication Layer

The AuthContext provider wraps the entire application, creating a single source of truth for user state. The onAuthStateChanged observer from Firebase detects login state changes (including page reloads), ensuring the UI reacts instantly. The PrivateRoute component acts as a higher-order function. If a user is not authenticated and tries to access /new or /edit/:id, they are redirected to /login with the intended destination saved in location state. After successful login, they are returned to that destination.

Data Layer

All Firestore operations are abstracted into two service files: postService.js and userService.js. This decoupling allows the component layer to remain ignorant of Firebase SDK specifics.

· Post Service: The subscribeToPosts function is critical. Instead of a one-time getDocs fetch, it returns an unsubscribe function from onSnapshot. This means when another user creates a post, it appears on all connected clients without any polling or page refresh.
· User Service: A createUserProfile function is called automatically by the AuthContext whenever a new user signs in via Google. This ensures every authenticated user has a corresponding users/{uid} document in Firestore for storing metadata like their bio.

Security Layer

Security is implemented at two levels. First, client-side checks in PostDetail.jsx and ProfilePage.jsx conditionally render Edit/Delete buttons only for the content owner. The definitive layer of security, however, is the Firestore Security Rules. These rules are enforced on the server, making it impossible to modify a document without passing the ownership validation, even if client-side JavaScript were bypassed.

Firebase & Firestore Configuration

This section covers the creation and configuration of your Firebase resources.

1. Create Project: Navigate to the Firebase Console and create a new project.
2. Web App Registration: In Project Settings, create a Web App to obtain your configuration values for the .env file.
3. Authentication Setup: In the Firebase Console sidebar, go to Authentication > Sign-in method. Enable the Google provider.
4. Database Setup: Go to Firestore Database and create a database. Start in production mode.
5. Deploy Security Rules: Navigate to the Rules tab of Firestore Database. Paste the following ruleset and publish.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts: public read, authenticated create, author-only update/delete
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    // Users: public read, owner-only create/update
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deployment Strategy

The application is optimized for deployment on the Vercel platform, but the standard Vite build output in the dist folder can be hosted on any static provider.

Vercel Deployment Instructions

1. Commit your final code to a GitHub, GitLab, or Bitbucket repository. Verify that the .env file is not included in the commit.
2. Log in to Vercel and import the project repository.
3. Vercel will automatically detect the Vite framework. The default build settings are correct:
   · Build Command: npm run build
   · Output Directory: dist
4. In the deployment configuration screen, add your Environment Variables. Copy each key-value pair from your local .env file into Vercel's interface (VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.).
5. Deploy the project.
6. Post-Deployment: Copy the production domain (e.g., https://hitoriblog.vercel.app). In the Firebase Console, navigate to Authentication > Settings > Authorized domains and add this new domain. Without this step, Google Sign-In will not function on the live site.

License

This project is provided for educational and portfolio purposes. All rights reserved by the original author.

```