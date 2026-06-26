import { Text, View } from 'react-native';

type StatusValue = string;

const STATUS_CONFIG: Record<
  StatusValue,
  { label: string; bg: string; text: string; dot: string }
> = {
  PendingReview: {
    label: 'Onay Bekliyor',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    dot: '#ca8a04',
  },
  AiReview: {
    label: 'AI İncelemesinde',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    dot: '#9333ea',
  },
  Confirmed: {
    label: 'Onaylandı',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: '#2563eb',
  },
  InProgress: {
    label: 'İşleme Alındı',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-400',
    dot: '#4f46e5',
  },
  Resolved: {
    label: 'Çözüldü',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    dot: '#16a34a',
  },
  Rejected: {
    label: 'Reddedildi',
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    dot: '#dc2626',
  },
  Active: {
    label: 'Aktif',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    dot: '#16a34a',
  },
  Reviewing: {
    label: 'İncelemede',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    dot: '#9333ea',
  },
  Implementation: {
    label: 'Uygulamada',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: '#2563eb',
  },
  Closed: {
    label: 'Kapatıldı',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    dot: '#64748b',
  },
  Reserved: {
    label: 'Rezerve',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    dot: '#ea580c',
  },
  Expired: {
    label: 'Süresi Doldu',
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    dot: '#dc2626',
  },
  Archived: {
    label: 'Arşivlendi',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    dot: '#64748b',
  },
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PendingReview;

  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full ${config.bg} ${
        size === 'sm' ? 'px-2.5 py-0.5' : 'px-3 py-1'
      }`}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: config.dot }} />
      <Text className={`font-medium ${config.text} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {config.label}
      </Text>
    </View>
  );
}
