import { useQuery } from '@tanstack/react-query';
import { locationApi } from '../api/location.api';

export const locationKeys = {
  provinces: ['provinces'] as const,
  districts: (provinceId: string) => ['districts', provinceId] as const,
  neighborhoods: (districtId: string) => ['neighborhoods', districtId] as const,
  neighborhoodLocation: (neighborhoodId: string) => ['neighborhood-location', neighborhoodId] as const,
};

export function useProvinces() {
  return useQuery({
    queryKey: locationKeys.provinces,
    queryFn: locationApi.getProvinces,
    staleTime: Infinity,
  });
}

export function useDistricts(provinceId: string | null) {
  return useQuery({
    queryKey: locationKeys.districts(provinceId ?? ''),
    queryFn: () => locationApi.getDistricts(provinceId!),
    enabled: !!provinceId,
    staleTime: Infinity,
  });
}

export function useNeighborhoods(districtId: string | null) {
  return useQuery({
    queryKey: locationKeys.neighborhoods(districtId ?? ''),
    queryFn: () => locationApi.getNeighborhoods(districtId!),
    enabled: !!districtId,
    staleTime: Infinity,
  });
}

export function useNeighborhoodLocation(neighborhoodId: string | null) {
  return useQuery({
    queryKey: locationKeys.neighborhoodLocation(neighborhoodId ?? ''),
    queryFn: () => locationApi.getNeighborhoodLocation(neighborhoodId!),
    enabled: !!neighborhoodId,
    staleTime: Infinity,
  });
}
