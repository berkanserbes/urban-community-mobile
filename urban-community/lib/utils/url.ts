const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

/**
 * Relative path'leri (ör: /uploads/profile-images/uuid.jpg) tam URL'ye çevirir.
 * Zaten tam URL ise (http/https ile başlıyorsa) dokunmaz.
 */
export function toAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url}`;
}
