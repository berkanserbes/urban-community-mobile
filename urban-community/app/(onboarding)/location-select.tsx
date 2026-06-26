import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SelectPicker, type SelectOption } from '@/components/ui/SelectPicker';
import { useAuthStore } from '@/features/auth';
import { useDistricts, useNeighborhoods, useProvinces } from '@/features/location';
import { userApi, userKeys } from '@/features/user';

function StepBadge({
  number,
  label,
  active,
  done,
}: {
  number: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <View className="items-center">
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: done ? '#2563eb' : active ? '#eff6ff' : '#f1f5f9',
          borderWidth: done ? 0 : active ? 1 : 0,
          borderColor: active && !done ? '#93c5fd' : 'transparent',
        }}
      >
        {done ? (
          <Ionicons name="checkmark" size={15} color="white" />
        ) : (
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: active ? '#2563eb' : '#94a3b8',
            }}
          >
            {number}
          </Text>
        )}
      </View>
      <Text
        style={{
          fontSize: 11,
          marginTop: 4,
          color: active || done ? '#475569' : '#94a3b8',
          fontWeight: active || done ? '500' : '400',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function LocationSelectScreen() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const [selectedProvince, setSelectedProvince] = useState<SelectOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<SelectOption | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SelectOption | null>(null);

  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts(
    selectedProvince?.id ?? null,
  );
  const { data: neighborhoods = [], isLoading: loadingNeighborhoods } = useNeighborhoods(
    selectedDistrict?.id ?? null,
  );

  const mutation = useMutation({
    mutationFn: (neighborhoodId: string) =>
      userApi.updateProfile({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        neighborhoodId,
      }),
    onSuccess: () => {
      if (user && selectedNeighborhood) {
        setUser({ ...user, neighborhoodId: selectedNeighborhood.id });
      }
      queryClient.refetchQueries({ queryKey: userKeys.me });
      router.replace('/(app)/(tabs)');
    },
    onError: () => {
      Alert.alert('Hata', 'Mahalle güncellenemedi. Lütfen tekrar deneyin.');
    },
  });

  const handleProvinceChange = (option: SelectOption) => {
    setSelectedProvince(option);
    setSelectedDistrict(null);
    setSelectedNeighborhood(null);
  };

  const handleDistrictChange = (option: SelectOption) => {
    setSelectedDistrict(option);
    setSelectedNeighborhood(null);
  };

  const handleContinue = () => {
    if (selectedNeighborhood && !mutation.isPending) {
      mutation.mutate(selectedNeighborhood.id);
    }
  };

  const canContinue = !!selectedNeighborhood && !mutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="items-center mt-12 mb-8">
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#eff6ff',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Ionicons name="location-outline" size={36} color="#2563eb" />
          </View>
          <Text
            style={{ fontSize: 22, fontWeight: '700', color: '#0f172a', textAlign: 'center' }}
          >
            Mahallenizi Belirleyin
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#64748b',
              textAlign: 'center',
              marginTop: 8,
              lineHeight: 20,
            }}
          >
            Size en yakın bildirimleri ve duyuruları görebilmek için{'\n'}yaşadığınız mahalleyi
            seçin.
          </Text>
        </View>

        {/* Step indicators */}
        <View className="flex-row items-start justify-center mb-8">
          <StepBadge number={1} label="İl" active done={!!selectedProvince} />
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: selectedProvince ? '#2563eb' : '#e2e8f0',
              marginTop: 16,
              marginHorizontal: 6,
            }}
          />
          <StepBadge
            number={2}
            label="İlçe"
            active={!!selectedProvince}
            done={!!selectedDistrict}
          />
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: selectedDistrict ? '#2563eb' : '#e2e8f0',
              marginTop: 16,
              marginHorizontal: 6,
            }}
          />
          <StepBadge
            number={3}
            label="Mahalle"
            active={!!selectedDistrict}
            done={!!selectedNeighborhood}
          />
        </View>

        {/* Selectors */}
        <SelectPicker
          label="İl"
          placeholder="Şehir seçin"
          options={provinces}
          value={selectedProvince?.id ?? null}
          onChange={handleProvinceChange}
          isLoading={loadingProvinces}
        />

        <SelectPicker
          label="İlçe"
          placeholder="İlçe seçin"
          options={districts}
          value={selectedDistrict?.id ?? null}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
          isLoading={!!selectedProvince && loadingDistricts}
        />

        <SelectPicker
          label="Mahalle"
          placeholder="Mahalle seçin"
          options={neighborhoods}
          value={selectedNeighborhood?.id ?? null}
          onChange={setSelectedNeighborhood}
          disabled={!selectedDistrict}
          isLoading={!!selectedDistrict && loadingNeighborhoods}
        />

        {/* Selection summary */}
        {selectedNeighborhood && (
          <View
            style={{
              backgroundColor: '#eff6ff',
              borderRadius: 12,
              padding: 14,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="location" size={18} color="#2563eb" />
            <Text style={{ flex: 1, marginLeft: 10, fontSize: 13, color: '#1d4ed8', lineHeight: 18 }}>
              {selectedProvince?.name} › {selectedDistrict?.name} › {selectedNeighborhood?.name}
            </Text>
          </View>
        )}

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!canContinue}
          style={{
            backgroundColor: canContinue ? '#2563eb' : '#e2e8f0',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: canContinue ? 'white' : '#94a3b8',
            }}
          >
            {mutation.isPending ? 'Kaydediliyor...' : 'Devam Et'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
