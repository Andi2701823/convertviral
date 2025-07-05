# ConvertViral - Modern File Conversion Platform

ConvertViral is a viral-ready file conversion platform with gamification features, built with Next.js 14 and modern web technologies.

## Features

- 🚀 Drag & drop file upload interface
- 🔄 20+ conversion types (PDF, JPG, PNG, MP4, MP3, DOCX, etc.)
- 🎮 Gamification system (points, badges, leaderboards)
- 📱 Mobile-first responsive design
- 🌐 Progressive Web App (PWA) support
- 🔍 SEO optimized with dynamic meta tags
- ⚡ Real-time conversion progress with WebSockets
- 📦 Batch conversion support with queue system
- 👤 User authentication (optional/guest mode)
- 🔒 Secure file handling with validation and virus scanning
- 🚀 Performance optimization with Redis caching and CDN integration

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- React Hook Form
- Prisma ORM
- PostgreSQL database
- Redis for caching and job queue
- WebSockets for real-time progress updates
- Background workers for file processing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis server (required for caching and job queue)
- (Optional) FFmpeg for audio/video conversions
- (Optional) ImageMagick for image conversions
- (Optional) LibreOffice for document conversions

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/convertviral.git
cd convertviral
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

4. Set up the database

```bash
npx prisma migrate dev --name init
```

5. Start the development server

```bash
npm run dev
```

6. Start the worker process (in a separate terminal)

```bash
npm run worker
```

7. Set up a cron job for maintenance tasks

```bash
# Run every hour
0 * * * * cd /path/to/ConvertViral && npm run maintenance
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js 14 app directory
  - `api/` - API routes for file conversion
    - `convert/` - Main conversion endpoint
    - `upload/` - File upload handler
    - `download/` - Converted file download
    - `progress/` - Real-time conversion status
    - `formats/` - Supported format list
    - `socket/` - WebSocket for real-time updates
- `components/` - Reusable UI components
- `lib/` - Utilities, database, types
  - `auth.ts` - Authentication utilities
  - `cdn.ts` - CDN integration
  - `conversion.ts` - Conversion utilities
  - `db.ts` - Database utilities
  - `fileTypes.ts` - File type definitions
  - `gamification.ts` - Gamification utilities
  - `redis.ts` - Redis utilities
  - `security.ts` - Security utilities
  - `upload.ts` - Upload utilities
  - `worker.ts` - Worker utilities
- `public/` - Static assets
  - `cdn/` - CDN directory for converted files
- `scripts/` - Utility scripts
  - `maintenance.ts` - Maintenance script
  - `start-worker.ts` - Worker script
- `styles/` - Global styles
- `prisma/` - Database schema

## Deployment

The project can be deployed to Vercel with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fconvertviral)

## Supported Conversions

### Document Conversions
- PDF ↔ Word (DOCX)
- PDF ↔ Excel (XLSX)
- PDF ↔ PowerPoint (PPTX)
- PDF ↔ JPG

### Image Conversions
- JPG ↔ PNG
- HEIC → JPG
- WebP ↔ PNG
- RAW → JPG

### Audio Conversions
- MP4 → MP3
- WAV → MP3
- FLAC → MP3
- M4A → MP3

### Video Conversions
- MOV → MP4
- AVI → MP4
- MKV → MP4
- WebM → MP4

## API Endpoints

- `/api/convert` - Main conversion endpoint
- `/api/upload` - File upload handler
- `/api/download` - Converted file download
- `/api/progress` - Real-time conversion status
- `/api/formats` - Supported format list
- `/api/socket` - WebSocket for real-time updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.