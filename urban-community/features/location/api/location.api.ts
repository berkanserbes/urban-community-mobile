import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';

export interface ProvinceDto {
  id: string;
  name: string;
}

export interface DistrictDto {
  id: string;
  name: string;
  provinceId: string;
}

export interface NeighborhoodDto {
  id: string;
  name: string;
}

export interface NeighborhoodLocationDto {
  neighborhoodId: string;
  neighborhoodName: string;
  districtId: string | null;
  districtName: string | null;
  provinceId: string | null;
  provinceName: string | null;
}

interface UpdateNeighborhoodRequest {
  firstName: string;
  lastName: string;
  neighborhoodId: string;
}

export const locationApi = {
  getProvinces: (): Promise<ProvinceDto[]> =>
    apiClient
      .get<ApiResponse<ProvinceDto[]>>('/api/provinces')
      .then((res) => res.data.data),

  getDistricts: (provinceId: string): Promise<DistrictDto[]> =>
    apiClient
      .get<ApiResponse<DistrictDto[]>>(`/api/provinces/${provinceId}/districts`)
      .then((res) => res.data.data),

  getNeighborhoods: (districtId: string): Promise<NeighborhoodDto[]> =>
    apiClient
      .get<ApiResponse<NeighborhoodDto[]>>(`/api/districts/${districtId}/neighborhoods`)
      .then((res) => res.data.data),

  getNeighborhoodLocation: (neighborhoodId: string): Promise<NeighborhoodLocationDto> =>
    apiClient
      .get<ApiResponse<NeighborhoodLocationDto>>(`/api/neighborhoods/${neighborhoodId}/location`)
      .then((res) => res.data.data),

  updateNeighborhood: (data: UpdateNeighborhoodRequest): Promise<void> =>
    apiClient.put('/api/users/me/profile', data).then(() => {}),
};
