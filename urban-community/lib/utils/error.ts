import type { AxiosError } from 'axios';

interface BackendErrorResponse {
  isSuccess: false;
  errors: string[];
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
    return errors.join('\n');
  }
  return fallback;
}
