# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 chat application that uses AI SDK 5.0 to generate images via fal.ai models. The app uses Bun as the runtime and package manager.

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
    { type: 'file', url: 'data:image/png;base64,...', mediaType: 'image/png' }
  ]
}
```

### Image Generation Flow

1. **Frontend** (`src/app/page.tsx`): User submits prompt via `useChat` hook
2. **API Route** (`src/app/api/chat/route.ts`):
   - Receives `UIMessage[]` from client
   - Creates a `UIMessageStream` with `createUIMessageStream()`
   - Calls `generateImage()` from `src/lib/falai/helpers.ts`
   - Writes file parts to stream with base64-encoded image data
   - Returns stream via `createUIMessageStreamResponse()`
3. **Frontend**: Displays images from message parts where `type === 'file'` and `mediaType.startsWith('image/')`

### Static Files

Generated images are stored in the `static/` folder (defined in `src/constants.ts`). The API route currently simulates image generation by randomly selecting from pre-generated images in this folder.

### Component Structure

- **Page** (`src/app/page.tsx`): Main container, manages state (input, selected model, attached images)
- **Header** (`src/components/chat/header.tsx`): App title and model selector
- **Conversation** (`src/components/chat/conversation.tsx`): Message list with avatar, text, and images
- **ChatInput** (`src/components/chat/chat-input.tsx`): Input field with image attachment
- **ImageModal** (`src/components/chat/image-modal.tsx`): Full-screen image viewer with carousel navigation
  - Extracts all images from messages in reverse order (newest first)
  - Uses Embla Carousel for navigation
  - Keyboard navigation enabled via `tabIndex={0}` on Carousel component

### Styling

- **Tailwind CSS 4.0** with custom configuration
- **shadcn/ui** components in `src/components/ui/`
- Path alias `@/*` maps to `src/*`

## Type Safety

The project uses strict TypeScript. When working with message parts:

```typescript
// Correct way to check for image files
message.parts.forEach((part) => {
  if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
    // part.url is the image URL
  }
});
```

Never use `any` or `unknown` types. Use proper type narrowing or define interfaces for specific part types.

## Models

Available fal.ai models are defined in `src/lib/falai/constants.ts`:
- `SANA`: Cheapest option ($0.01/megapixel)
- `FLUX_DEV`: Mid-tier ($0.025/megapixel)
- `QWEN_IMAGE_EDIT_PLUS`: Image creation and editing ($0.03/megapixel)
- use @mynaui/icons-react as icons
