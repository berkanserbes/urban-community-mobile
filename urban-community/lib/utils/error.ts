import type { AxiosError } from 'axios';

interface BackendErrorResponse {
  isSuccess: false;
  errors?: string[] | Record<string, string[]>;
  title?: string;
  detail?: string;
  traceId?: string;
}

/**
 * Backend'den gelen AxiosError'dan kullanıcıya gösterilecek hata mesajını çıkarır.
 * Backend { isSuccess: false, errors: ["..."] } formatında döndürür.
 * Hata mesajı bulunamazsa fallback mesajı döndürür.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Bir hata oluştu, tekrar deneyin.',
): string {
  const axiosError = error as AxiosError<BackendErrorResponse>;
  const errors = axiosError?.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return appendTraceId(errors.join('\n'), axiosError.response?.data?.traceId);
  }
  if (errors && typeof errors === 'object') {
    const validationMessages = Object.values(errors).flat();
    if (validationMessages.length > 0) {
      return appendTraceId(validationMessages.join('\n'), axiosError.response?.data?.traceId);
    }
  }
  const message =
    axiosError?.response?.data?.detail ??
    axiosError?.response?.data?.title;
  if (message) {
    return appendTraceId(message, axiosError.response?.data?.traceId);
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

function appendTraceId(message: string, traceId?: string): string {
  return traceId ? `${message}\nİzleme kodu: ${traceId}` : message;
}
