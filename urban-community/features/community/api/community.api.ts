import { apiClient } from '@/lib/api/axios';
import type { ApiResponse, PagedResult, PaginationParams } from '@/types/api.types';

export type PostType = 'HelpRequested' | 'BorrowTool' | 'LostAndFound';
export type CommunityPostStatus = 'Active' | 'Reserved' | 'Resolved' | 'Expired' | 'Archived';
export type CommunityPostScope = 'Province' | 'District' | 'Neighborhood';
export type MediaType = 'Image' | 'Video';

export interface CommunityPostListItem {
  id: string;
  type: PostType;
  title: string;
  content: string;
  status: CommunityPostStatus;
  userId: string;
  userFullName: string;
  scope: CommunityPostScope;
  provinceId: string | null;
  provinceName: string | null;
  districtId: string | null;
  districtName: string | null;
  neighborhoodId: string | null;
  neighborhoodName: string | null;
  commentCount: number;
  mediaCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CommunityPostMediaDto {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  contentType: string | null;
  displayOrder: number;
  mediaType: MediaType;
}

export interface CommunityPostDetail {
  id: string;
  type: PostType;
  title: string;
  content: string;
  status: CommunityPostStatus;
  userId: string;
  userFullName: string;
  scope: CommunityPostScope;
  provinceId: string | null;
  provinceName: string | null;
  districtId: string | null;
  districtName: string | null;
  neighborhoodId: string | null;
  neighborhoodName: string | null;
  allowedNextStatuses: CommunityPostStatus[];
  media: CommunityPostMediaDto[];
  commentCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CommunityPostComment {
  id: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCommunityPostData {
  type: PostType;
  title: string;
  content: string;
  scope: CommunityPostScope;
  provinceId?: string;
  districtId?: string;
  neighborhoodId?: string;
  media?: { uri: string; type: string; name: string }[];
}

function unwrapApiData<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data == null) {
    throw new Error(response.errors?.[0] ?? 'İşlem başarısız.');
  }

  return response.data;
}

export const communityApi = {
  getPosts: (params: PaginationParams & {
    scope?: CommunityPostScope;
    provinceId?: string;
    districtId?: string;
    neighborhoodId?: string;
    status?: CommunityPostStatus;
    type?: PostType;
    userId?: string;
  }): Promise<PagedResult<CommunityPostListItem>> =>
    apiClient
      .get<ApiResponse<PagedResult<CommunityPostListItem>>>('/api/community-posts', { params })
      .then((res) => unwrapApiData(res.data)),

  getPostById: (id: string): Promise<CommunityPostDetail> =>
    apiClient
      .get<ApiResponse<CommunityPostDetail>>(`/api/community-posts/${id}`)
      .then((res) => unwrapApiData(res.data)),

  createPost: (data: CreateCommunityPostData) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('scope', data.scope);
    if (data.neighborhoodId) formData.append('neighborhoodId', data.neighborhoodId);
    if (data.districtId) formData.append('districtId', data.districtId);
    if (data.provinceId) formData.append('provinceId', data.provinceId);
    if (data.media) {
      data.media.forEach((file) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as unknown as Blob);
      });
    }
    return apiClient
      .post<ApiResponse<CommunityPostDetail>>('/api/community-posts', formData)
      .then((res) => unwrapApiData(res.data));
  },

  getComments: (postId: string, params: PaginationParams): Promise<PagedResult<CommunityPostComment>> =>
    apiClient
      .get<ApiResponse<PagedResult<CommunityPostComment>>>(`/api/community-posts/${postId}/comments`, {
        params,
      })
      .then((res) => unwrapApiData(res.data)),

  addComment: (postId: string, content: string) =>
    apiClient
      .post<ApiResponse<CommunityPostComment>>(`/api/community-posts/${postId}/comments`, { content })
      .then((res) => unwrapApiData(res.data)),

  updatePost: (id: string, data: { title: string; content: string }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    return apiClient
      .put<ApiResponse<Record<string, unknown>>>(`/api/community-posts/${id}`, formData)
      .then((res) => unwrapApiData(res.data));
  },

  deletePost: (id: string) =>
    apiClient
      .delete<ApiResponse<unknown>>(`/api/community-posts/${id}`)
      .then((res) => unwrapApiData(res.data)),
};
