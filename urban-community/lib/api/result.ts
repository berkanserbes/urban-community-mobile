import type { ApiResponse } from '@/types/api.types';

export function unwrapApiData<T>(
  response: ApiResponse<T>,
  fallback = 'Islem basarisiz.',
): T {
  if (!response.isSuccess) {
    throw new Error(getFirstError(response.errors) ?? fallback);
  }

  if (response.data == null) {
    throw new Error(fallback);
  }

  return response.data;
}

function getFirstError(errors?: string[] | Record<string, string[]>): string | null {
  if (Array.isArray(errors)) {
    return errors.find(Boolean) ?? null;
  }

  if (errors && typeof errors === 'object') {
    return Object.values(errors).flat().find(Boolean) ?? null;
  }

  return null;
}
