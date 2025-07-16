# Interview Simulator

An AI-powered interview simulation application that helps users practice and improve their interview skills through realistic mock interviews.

## Features

- **Company Management**: Browse and select companies for interview practice
- **Resume Management**: Upload and manage multiple resumes
- **Interview Modes**: 
  - Chat-based interviews with AI interviewers
  - Speech-enabled interviews with voice interaction
- **Results Analysis**: Detailed feedback and performance analytics
- **Ranking System**: Compare performance with other users
- **User Authentication**: Secure login and profile management
- **Interview History**: Track progress and review past interviews

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: SCSS and custom CSS modules
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT for interview simulation
- **Speech**: Azure Speech Services for voice interaction
- **State Management**: Recoil

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tsuchidarikuto/interview-sim.git
cd interview-sim
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables (create `.env.local`):
```bash
# Add your environment variables here
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Azure Speech
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_speech_region
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
interview-sim/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── company/           # Company management
│   ├── interview/         # Interview interfaces
│   ├── mailbox/           # Results and feedback
│   ├── resume/            # Resume management
│   └── ranking/           # User rankings
├── components/            # Reusable UI components
├── utils/                 # Utility functions and helpers
├── atoms/                 # Recoil state management
├── provider/              # Context providers
├── styles/               # Global styles and themes
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
