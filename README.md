# fal.ai Chat

### Version 0.1.1

A Next.js 15 chat application for generating AI images using [fal.ai](https://fal.ai) models. Built with the AI SDK 5.0, featuring a modern UI with shadcn/ui components and Tailwind CSS 4.0.

## Features

- Multiple AI image generation models (SANA, FLUX_DEV, QWEN_IMAGE_EDIT_PLUS)
- Chat-based interface with message history
- Image editing capabilities (model-dependent)
- Session management with persistent storage
- Reply to messages with context
- Image attachment with drag-and-drop support
- Customizable image size (preset options + custom dimensions)
- Full-screen image viewer with carousel navigation
- Fast development with Bun runtime

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **AI SDK**: AI SDK 5.0 with fal.ai integration
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 4.0
- **Icons**: @mynaui/icons-react, Lucide React
- **TypeScript**: Strict type checking enabled

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your system
- fal.ai API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd falaiChat
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
FAL_API_KEY=your_fal_ai_api_key_here
```

### Development

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
bun run build
bun run start
```

## Available Scripts

### Development

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production with Turbopack
- `bun run start` - Start production server

### Code Quality

- `bun run typecheck` - Run TypeScript type checking
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Run ESLint with auto-fix
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check formatting without modifying
- `bun run check:fix` - Run lint:fix, format, and typecheck (comprehensive fix)

## Project Structure

```
src/
├── app/
│   ├── [id]/           # Dynamic chat routes
│   ├── api/chat/       # Chat API endpoint
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Chat list page
├── components/
│   ├── chat/
│   │   ├── attachments.tsx        # Image attachment with drag-and-drop
│   │   ├── chat-input.tsx         # Input field with controls
│   │   ├── conversation.tsx       # Message list display
│   │   ├── header.tsx             # App header with model selector
│   │   ├── image-modal.tsx        # Full-screen image viewer
│   │   └── image-size-selector.tsx # Image size configuration
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── falai/          # fal.ai integration
│   ├── chat-store.ts   # Chat persistence
│   ├── helpers.ts      # Utility functions
│   └── types.ts        # TypeScript types with Zod schemas
└── constants.ts        # App constants
```

## Available Models

The application supports the following fal.ai models:

- **SANA** - Cheapest option ($0.01/megapixel)
  - Text-to-image generation

- **FLUX_DEV** - Mid-tier ($0.025/megapixel)
  - Text-to-image generation

- **QWEN_IMAGE_EDIT_PLUS** - Advanced ($0.03/megapixel)
  - Text-to-image generation
  - Image editing and refinement
  - Reply to and modify existing images

## Key Concepts

### AI SDK 5.0 Message Structure

The app uses AI SDK 5.0's `UIMessage` format with a `parts` array:

```typescript
const message: UIMessage = {
  id: '1',
  role: 'user',
  parts: [
    { type: 'text', text: 'Generate an image' },
    { type: 'file', url: 'data:image/png;base64,...', mediaType: 'image/png' },
  ],
};
```

### Image Generation Flow

1. User submits prompt via chat interface
2. API route receives message and creates a `UIMessageStream`
3. `generateImage()` calls fal.ai API with model-specific parameters
4. Stream returns images as base64-encoded file parts
5. UI displays images from message parts

### Session Storage

Chat sessions are stored as JSON files in `static/chats/`:

- Each chat has a unique ID
- Messages persist across page reloads
- Sessions can be created, viewed, and deleted

### Image Size Configuration

The app supports multiple image size options:

- **Preset sizes**: Square HD, Square, Portrait 4:3, Portrait 16:9, Landscape 4:3, Landscape 16:9
- **Custom dimensions**: User-defined width and height (256-2048px)
- Size settings are passed to the API and stored in message metadata

## Contributing

Please refer to `CLAUDE.md` for development guidelines and architectural decisions.

## License

MIT

---

## TODO

- [ ] Migrate to Zustand for state management
- [ ] Save chat settings (model, theme, etc.) to local storage
  - [ ] replace local storage persistence with Zustand persist middleware
- [ ] Add the ability to regenerate last AI message and "reply" button
- [ ] Improve error handling with user-friendly error messages and retry logic
- [x] Add generation parameters (image size, steps, guidance scale) to model options
  - [x] Image size selector with preset and custom options
  - [ ] Other settings (steps, guidance scale, etc.)
- [ ] Add possibility automatically determine image size based on the attached image (if only 1 image is attached)
- [ ] Add creation and last updated timestamps to chat sessions
- [ ] Display chat metadata (date, message count) in chat list
- [ ] Add unit tests for utility functions and helpers
- [ ] Add integration tests for API routes
- [ ] Add tests with React Testing Library
- [ ] Implement chat search/filter functionality
- [ ] Add export chat history feature (JSON, Markdown)
- [ ] Add image download functionality
- [ ] Implement keyboard shortcuts for common actions
- [ ] Add loading states and progress indicators for image generation
- [ ] Implement rate limiting for API calls
- [ ] Add support for batch image generation
- [ ] Create error boundary components for better error handling
- [ ] Add analytics/telemetry (optional)
- [ ] Implement dark mode toggle
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Optimize image loading with lazy loading and placeholders
