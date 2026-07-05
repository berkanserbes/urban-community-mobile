import { apiClient } from '@/lib/api/axios';
import { unwrapApiData } from '@/lib/api/result';
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
      .then((res) => unwrapApiData(res.data)),

  getDistricts: (provinceId: string): Promise<DistrictDto[]> =>
    apiClient
      .get<ApiResponse<DistrictDto[]>>(`/api/provinces/${provinceId}/districts`)
      .then((res) => unwrapApiData(res.data)),

  getNeighborhoods: (districtId: string): Promise<NeighborhoodDto[]> =>
    apiClient
      .get<ApiResponse<NeighborhoodDto[]>>(`/api/districts/${districtId}/neighborhoods`)
      .then((res) => unwrapApiData(res.data)),

  getNeighborhoodLocation: (neighborhoodId: string): Promise<NeighborhoodLocationDto> =>
    apiClient
      .get<ApiResponse<NeighborhoodLocationDto>>(`/api/neighborhoods/${neighborhoodId}/location`)
      .then((res) => unwrapApiData(res.data)),

  updateNeighborhood: (data: UpdateNeighborhoodRequest): Promise<void> =>
    apiClient
      .put<ApiResponse<unknown>>('/api/users/me/profile', data)
      .then((res) => {
        unwrapApiData(res.data);
      }),
};
