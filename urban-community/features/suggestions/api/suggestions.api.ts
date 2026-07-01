import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';

export type SuggestionStatus = 'Active' | 'Reviewing' | 'Implementation' | 'Closed';

export interface SuggestionListItem {
  id: string;
  title: string;
  content: string;
  status: SuggestionStatus;
  voteScore: number;
  upVotes: number;
  downVotes: number;
  userId: string;
  userFullName: string;
  createdAt: string;
}

export interface SuggestionDetail {
  id: string;
  title: string;
  content: string;
  status: SuggestionStatus;
  voteScore: number;
  userId: string;
  userFullName: string;
  upVotes: number;
  downVotes: number;
  createdAt: string;
  updatedAt: string | null;
  officialResponse?: string | null;
}

export interface VoteSummary {
  upVotes: number;
  downVotes: number;
  voteScore: number;
  currentUserVote: boolean | null;
}

export interface SuggestionComment {
  id: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export const suggestionsApi = {
  getSuggestions: (params: {
    status?: SuggestionStatus;
    userId?: string;
    neighborhoodId?: string;
    districtId?: string;
    provinceId?: string;
  }): Promise<SuggestionListItem[]> =>
    apiClient
      .get<ApiResponse<SuggestionListItem[]>>('/api/suggestions', { params })
      .then((res) => res.data.data),

  getSuggestionById: (id: string): Promise<SuggestionDetail> =>
    apiClient
      .get<ApiResponse<SuggestionDetail>>(`/api/suggestions/${id}`)
      .then((res) => res.data.data),

  createSuggestion: (data: { title: string; content: string }) =>
    apiClient
      .post<ApiResponse<SuggestionDetail>>('/api/suggestions', data)
      .then((res) => res.data.data),

  vote: (suggestionId: string, isUpvote: boolean) =>
    apiClient
      .put<ApiResponse<VoteSummary>>(`/api/suggestions/${suggestionId}/votes`, { isUpvote })
      .then((res) => res.data.data),

  removeVote: (suggestionId: string) =>
    apiClient
      .delete<ApiResponse<VoteSummary>>(`/api/suggestions/${suggestionId}/votes`)
      .then((res) => res.data.data),

  getComments: (suggestionId: string): Promise<SuggestionComment[]> =>
    apiClient
      .get<ApiResponse<SuggestionComment[]>>(`/api/suggestions/${suggestionId}/comments`)
      .then((res) => res.data.data),

  addComment: (suggestionId: string, content: string) =>
    apiClient
      .post<ApiResponse<SuggestionComment>>(`/api/suggestions/${suggestionId}/comments`, { content })
      .then((res) => res.data.data),

  updateSuggestion: (id: string, data: { title: string; content: string }) =>
    apiClient
      .put<ApiResponse<SuggestionDetail>>(`/api/suggestions/${id}`, data)
      .then((res) => res.data.data),

  deleteSuggestion: (id: string) =>
    apiClient
      .delete<ApiResponse<unknown>>(`/api/suggestions/${id}`)
      .then((res) => res.data.data),
};
