# Abdulkadir Khalifa Mustapha - Portfolio

A personal portfolio website with AI chat and social features.

## Live Site

**https://abdulkadir-portfolio-bay.vercel.app**

## Features

- **Portfolio Pages** - Home, About, Work, and Contact pages
- **Google Sign-In** - Firebase Authentication with Google
- **AI Chat** - Chat with an AI assistant powered by Groq (Llama 3.1)
- **Comments Section** - Leave comments and like others' comments
- **Real-time Updates** - Comments update in real-time using Firestore

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firebase Firestore
- **AI**: Groq API (Llama 3.1 8B)
- **Hosting**: Vercel
- **Serverless Functions**: Vercel Functions

## Project Structure

```
├── index.html          # Homepage with comments section
├── about.html          # About page
├── work.html           # Work/portfolio page
├── contact.html        # Contact page
├── chat.html           # AI chat page
├── styles.css          # All styles
├── script.js           # Navigation interactions
├── firebase-config.js  # Firebase initialization
├── auth.js             # Authentication logic
├── comments.js         # Comments functionality
├── chat.js             # AI chat functionality
└── api/
    └── chat.js         # Vercel serverless function for Groq API
```

## Setup

### Prerequisites

- Firebase project with Authentication and Firestore enabled
- Groq API key
- Vercel account

### Environment Variables (Vercel)

```
GROQ_API_KEY=your_groq_api_key
```

### Firebase Configuration

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Google Sign-In in Authentication
3. Create a Firestore database
4. Add your domain to authorized domains in Firebase Auth settings
5. Update `firebase-config.js` with your Firebase config

### Local Development

```bash
# Start local server
python3 -m http.server 3000

# Open http://localhost:3000
```

### Deployment

```bash
# Deploy to Vercel
vercel --prod
```

## Author

**Abdulkadir Khalifa Mustapha**

- Prompt Engineer & Software Engineer
- Based in the United Kingdom
- Specializing in Healthcare AI, Productivity AI, and Media AI

[LinkedIn](https://www.linkedin.com/in/abdulkadir-mustapha-a33a9518a/)

## License

MIT
