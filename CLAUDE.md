# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 chat application that uses AI SDK 5.0 to generate images via fal.ai models. The app uses Bun as the runtime and package manager.

Key dependencies:

- **AI SDK**: `ai@^5.0.57` and `@ai-sdk/fal@^1.0.15` for image generation
- **State Management**: Zustand (`zustand@^5.0.8`) for global app state
- **UI**: shadcn/ui components built on Radix UI primitives
- **Icons**: `@mynaui/icons-react` (preferred) and `lucide-react`
- **Validation**: Zod 4.x for runtime schema validation
- **Styling**: Tailwind CSS 4.0

## Commands

### Development

```bash
bun run dev              # Start dev server with Turbopack
bun run build            # Build for production with Turbopack
bun run start            # Start production server
```

### Code Quality

```bash
bun run typecheck        # Run TypeScript type checking
bun run lint             # Run ESLint
bun run lint:fix         # Run ESLint with auto-fix
bun run format           # Format code with Prettier
bun run format:check     # Check formatting without modifying
bun run check:fix        # Run lint:fix, format, and typecheck (comprehensive fix)
```

**Important**: Always use `bunx tsc --noEmit` for type checking, not `npm` or `npx`.

## Architecture

### AI SDK 5.0 Message Structure

The app uses AI SDK 5.0, which introduced breaking changes to the message structure:

- **UIMessage**: Used for UI state (from `@ai-sdk/react`). Messages have a `parts` array instead of `content`.
- **Message parts**: Each part has a `type` field. Common types:
  - `text`: Text content with a `text` property
  - `file`: File/image content with `url` and `mediaType` properties

**Example**:

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

### State Management

The app uses **Zustand** (`src/lib/state/store.ts`) for global state:

- `mode`: Current operation mode (generate/edit)
- `attachedImages`: Images attached for generation/editing
- `model`: Selected fal.ai model
- `replyMessageId`: ID of message being replied to
- `openedImage`: Currently viewed image in modal
- `status`: Current generation status
- `error`: Error state

Access via `useAppStore()` hook in components.

### Chat Persistence

Chats are stored as JSON files in `static/chats/` (server actions in `src/lib/chat-store.ts`):

- `createChat(id)`: Create new empty chat
- `getChat(id)`: Load chat messages
- `getChatIds()`: List all chat IDs
- `saveChat(id, messages)`: Persist chat (auto-called after image generation)
- `deleteChat(id)`: Remove chat file

Each chat file contains an array of `UIMessage<MessageMetadata>` objects.

### Image Generation Flow

1. **Frontend** (`src/app/[id]/chat.tsx`):
   - User configures image size via `ImageSizeSelector`
   - User submits prompt via `useChat` hook from `@ai-sdk/react`
   - Message metadata includes `model`, `useMessageId` (for image editing), and `settings` (image_size, etc.)
2. **API Route** (`src/app/api/chat/route.ts`):
   - Receives `UIMessage[]` from client
   - Validates message metadata with Zod schemas (`messageMetadataSchema`, `settingsSchema`)
   - Creates a `UIMessageStream` with `createUIMessageStream()`
   - Calls `generateImage()` from `src/lib/falai/helpers.ts` which wraps `experimental_generateImage` from AI SDK
   - Writes file parts to stream with base64-encoded image data
   - Saves generated image as PNG to `static/` folder
   - Returns stream via `createUIMessageStreamResponse()`
   - `onFinish` callback saves updated messages to chat file
3. **Frontend**: Displays images from message parts where `type === 'file'` and `mediaType.startsWith('image/')`

### Component Architecture

**Main Chat Flow**:

- **Chat** (`src/app/[id]/chat.tsx`): Main chat container
  - Uses `useChat` hook from `@ai-sdk/react` for message handling
  - Integrates with Zustand store for global state (attachedImages, model selection, etc.)
  - Passes `metadata` prop to API containing model, settings, and useMessageId
- **Header** (`src/components/chat/header.tsx`): Model selector and title
- **Conversation** (`src/components/chat/conversation.tsx`): Message list display
- **ChatInput** (`src/components/chat/chat-input/`): Modular input system (split across multiple files)
  - `chat-input.tsx`: Main container
  - `useHandleSubmit.ts`: Submit logic with metadata preparation
  - `useImageSize.ts`: Image size state management
  - `useReplyImageUrl.ts`: Image URL extraction for replies
  - **Attachments** (`src/components/chat/attachments.tsx`): Drag-and-drop image handling
  - **ImageSizeSelector**: Preset and custom dimension configuration
- **ImageModal** (`src/components/chat/image-modal.tsx`): Full-screen viewer
  - Uses Embla Carousel for image navigation
  - Displays images in reverse chronological order (newest first)

**UI Components**: shadcn/ui components in `src/components/ui/` built on Radix UI primitives.

**Styling**: Tailwind CSS 4.0 with `@/*` path alias mapping to `src/*`.

## Type Safety

The project uses strict TypeScript with Zod for runtime validation. When working with message parts:

```typescript
// Correct way to check for image files
message.parts.forEach((part) => {
  if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
    // part.url is the image URL
  }
});
```

### Message Metadata Schema

Message metadata is validated using Zod schemas in `src/lib/types.ts`:

```typescript
const messageMetadataSchema = z.object({
  model: z.enum(Object.values(MODELS)),
  useMessageId: z.string().optional(),
  settings: settingsSchema.partial().optional(),
});
```

The `settings` schema supports:

- `image_size`: Preset variants or custom `{width, height}` object
- Other generation parameters (steps, guidance, etc.)
- All fields are optional with defaults applied during validation

Never use `any` or `unknown` types. Use proper type narrowing or define interfaces for specific part types.

## Models

Available fal.ai models are defined in `src/lib/falai/constants.ts`:

- `SANA`: Cheapest option ($0.01/megapixel) - text-to-image only
- `FLUX_DEV`: Mid-tier ($0.025/megapixel) - text-to-image only
- `QWEN_IMAGE_EDIT_PLUS`: Most expensive ($0.03/megapixel) - supports both text-to-image and image editing

When adding features that require image editing (reply to images, modify existing generations), only `QWEN_IMAGE_EDIT_PLUS` supports this functionality.

## Environment Setup

Required environment variables (`.env.local`):

```env
FAL_API_KEY=your_fal_ai_api_key_here
```

Get your API key from [fal.ai](https://fal.ai).

## File Structure

```
src/
├── app/
│   ├── [id]/                    # Dynamic chat routes (individual chat view)
│   ├── api/chat/                # Chat API endpoint (POST handler)
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Chat list/home page
│   └── main-page-client.tsx     # Client-side chat list logic
├── components/
│   ├── chat/                    # Chat-specific components
│   └── ui/                      # shadcn/ui reusable components
├── lib/
│   ├── falai/                   # fal.ai integration (models, types, helpers)
│   ├── hooks/                   # Custom React hooks
│   ├── state/                   # Zustand store and types
│   ├── chat-store.ts            # Server actions for chat persistence
│   ├── helpers.ts               # Utility functions
│   └── types.ts                 # Zod schemas and TypeScript types
├── constants.ts                 # App-wide constants (STATIC_FOLDER, etc.)
└── ...
static/
├── chats/                       # Persisted chat JSON files
└── *.png                        # Generated images
```
