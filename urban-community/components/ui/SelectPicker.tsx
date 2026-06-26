import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface SelectOption {
  id: string;
  name: string;
}

interface SelectPickerProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string | null;
  onChange: (option: SelectOption) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SelectPicker({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  isLoading = false,
}: SelectPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const selected = options.find((o) => o.id === value);
  const filtered = search
    ? options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
    : options;

  const handleOpen = () => {
    if (!disabled && !isLoading) {
      setSearch('');
      setVisible(true);
    }
  };

  const handleSelect = (item: SelectOption) => {
    onChange(item);
    setSearch('');
    setVisible(false);
  };

  const handleClose = () => {
    setSearch('');
    setVisible(false);
  };

  return (
    <>
      <View className="mb-4">
        <Text className="text-sm font-medium text-slate-700 mb-1.5">{label}</Text>
        <TouchableOpacity
          onPress={handleOpen}
          activeOpacity={0.7}
          className={`flex-row items-center justify-between rounded-xl border px-4 py-3.5 ${
            disabled ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-white'
          }`}
        >
          <Text
            className={`flex-1 text-base mr-2 ${selected ? 'text-slate-900' : 'text-slate-400'}`}
            numberOfLines={1}
          >
            {isLoading ? 'Yükleniyor...' : (selected?.name ?? placeholder)}
          </Text>
          <Ionicons
            name={isLoading ? 'reload-outline' : 'chevron-down-outline'}
            size={18}
            color={disabled ? '#cbd5e1' : '#64748b'}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Pressable
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={handleClose}
          />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: 520,
                overflow: 'hidden',
              }}
            >
              {/* Handle bar */}
              <View className="items-center pt-3 pb-1">
                <View className="w-10 h-1 bg-slate-200 rounded-full" />
              </View>

              {/* Header */}
              <View className="flex-row items-center justify-between px-5 py-3">
                <Text className="text-base font-semibold text-slate-900">{label} Seç</Text>
                <TouchableOpacity onPress={handleClose} className="p-1">
                  <Ionicons name="close" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Search */}
              <View className="px-4 pb-3">
                <View className="flex-row items-center bg-slate-100 rounded-xl px-3 py-2.5">
                  <Ionicons name="search-outline" size={16} color="#94a3b8" />
                  <TextInput
                    className="flex-1 ml-2 text-sm text-slate-900"
                    placeholder="Ara..."
                    placeholderTextColor="#94a3b8"
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    returnKeyType="search"
                  />
                  {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                      <Ionicons name="close-circle" size={16} color="#94a3b8" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* List */}
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f8fafc',
                      backgroundColor: item.id === value ? '#eff6ff' : 'white',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: item.id === value ? '#2563eb' : '#1e293b',
                        fontWeight: item.id === value ? '600' : '400',
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="py-10 items-center">
                    <Text className="text-sm text-slate-400">Sonuç bulunamadı</Text>
                  </View>
                }
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}
