import { MaybePromise } from '@/lib/types';

export async function convertFilesToDataURLs(
  files: File[]
): Promise<
  { type: 'file'; filename: string; mediaType: string; url: string }[]
> {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<{
          type: 'file';
          filename: string;
          mediaType: string;
          url: string;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              type: 'file',
              filename: file.name,
              mediaType: file.type,
              url: reader.result as string,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
}

export async function tryCatch<T>(
  fn: () => MaybePromise<T>
): Promise<{ result: T; error: null } | { error: Error; result: null }> {
  try {
    const result = await fn();
    return { result, error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Unknown error'),
      result: null,
    };
  }
}
