import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SelectPicker, type SelectOption } from '@/components/ui/SelectPicker';
import { useAuthStore } from '@/features/auth';
import {
  useDistricts,
  useNeighborhoodLocation,
  useNeighborhoods,
  useProvinces,
} from '@/features/location';
import { useProfile, useUpdateProfile } from '@/features/user';

export default function ChangeLocationScreen() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const neighborhoodId = profile?.neighborhoodId ?? user?.neighborhoodId ?? null;
  const { data: currentLocation, isLoading: locationLoading } =
    useNeighborhoodLocation(neighborhoodId);

  const [selectedProvince, setSelectedProvince] = useState<SelectOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<SelectOption | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SelectOption | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (currentLocation && !initialized.current) {
      initialized.current = true;
      if (currentLocation.provinceId && currentLocation.provinceName) {
        setSelectedProvince({ id: currentLocation.provinceId, name: currentLocation.provinceName });
      }
      if (currentLocation.districtId && currentLocation.districtName) {
        setSelectedDistrict({ id: currentLocation.districtId, name: currentLocation.districtName });
      }
      setSelectedNeighborhood({
        id: currentLocation.neighborhoodId,
        name: currentLocation.neighborhoodName,
      });
    }
  }, [currentLocation]);

  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts(
    selectedProvince?.id ?? null,
  );
  const { data: neighborhoods = [], isLoading: loadingNeighborhoods } = useNeighborhoods(
    selectedDistrict?.id ?? null,
  );

  const handleProvinceChange = (option: SelectOption) => {
    setSelectedProvince(option);
    setSelectedDistrict(null);
    setSelectedNeighborhood(null);
  };

  const handleDistrictChange = (option: SelectOption) => {
    setSelectedDistrict(option);
    setSelectedNeighborhood(null);
  };

  function handleSave() {
    if (!selectedNeighborhood) return;
    updateProfile.mutate(
      {
        firstName: profile?.firstName ?? user?.firstName ?? '',
        lastName: profile?.lastName ?? user?.lastName ?? '',
        bio: profile?.bio ?? null,
        phoneNumber: profile?.phoneNumber ?? null,
        neighborhoodId: selectedNeighborhood.id,
      },
      { onSuccess: () => router.back() },
    );
  }

  const isLoading = profileLoading || locationLoading;
  const hasChanged = selectedNeighborhood?.id !== neighborhoodId;
  const canSave = !!selectedNeighborhood && hasChanged;

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className="gap-2">
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
          isLoading={loadingDistricts}
        />
        <SelectPicker
          label="Mahalle"
          placeholder="Mahalle seçin"
          options={neighborhoods}
          value={selectedNeighborhood?.id ?? null}
          onChange={setSelectedNeighborhood}
          disabled={!selectedDistrict}
          isLoading={loadingNeighborhoods}
        />

        <Pressable
          onPress={handleSave}
          disabled={!canSave || updateProfile.isPending}
          className="bg-blue-600 rounded-xl py-4 items-center active:opacity-80 disabled:opacity-50 mt-4"
        >
          {updateProfile.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Kaydet</Text>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
