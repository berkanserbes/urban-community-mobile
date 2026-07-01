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
  currentUserVote: boolean | null;
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

type SuggestionListItemResponse = Omit<SuggestionListItem, 'currentUserVote'> & {
  currentUserIsUpvote?: boolean | null;
};

function unwrapApiData<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data == null) {
    throw new Error(response.errors?.[0] ?? 'İşlem başarısız.');
  }

  return response.data;
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
      .get<ApiResponse<SuggestionListItemResponse[]>>('/api/suggestions', { params })
      .then((res) =>
        res.data.data.map((item) => {
          const { currentUserIsUpvote, ...suggestion } = item;

          return {
            ...suggestion,
            currentUserVote: currentUserIsUpvote ?? null,
          };
        })
      ),

  getSuggestionById: (id: string): Promise<SuggestionDetail> =>
    apiClient
      .get<ApiResponse<SuggestionDetail>>(`/api/suggestions/${id}`)
      .then((res) => res.data.data),

  createSuggestion: (data: { title: string; content: string }) =>
    apiClient
      .post<ApiResponse<SuggestionDetail>>('/api/suggestions', data)
      .then((res) => res.data.data),

  vote: (suggestionId: string, isUpvote: boolean): Promise<VoteSummary> =>
    apiClient
      .put<ApiResponse<{
        suggestionId: string;
        upvoteCount: number;
        downvoteCount: number;
        voteScore: number;
        currentUserIsUpvote: boolean;
        message: string;
      }>>(`/api/suggestions/${suggestionId}/votes`, { isUpvote })
      .then((res) => {
        const data = unwrapApiData(res.data);

        return {
          upVotes: data.upvoteCount,
          downVotes: data.downvoteCount,
          voteScore: data.voteScore,
          currentUserVote: data.currentUserIsUpvote,
        };
      }),

  removeVote: (suggestionId: string): Promise<VoteSummary> =>
    apiClient
      .delete<ApiResponse<{
        suggestionId: string;
        upvoteCount: number;
        downvoteCount: number;
        voteScore: number;
        message: string;
      }>>(`/api/suggestions/${suggestionId}/votes`)
      .then((res) => {
        const data = unwrapApiData(res.data);

        return {
          upVotes: data.upvoteCount,
          downVotes: data.downvoteCount,
          voteScore: data.voteScore,
          currentUserVote: null,
        };
      }),

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

  getVoteSummary: (suggestionId: string): Promise<VoteSummary> =>
    apiClient
      .get<ApiResponse<{
        suggestionId: string;
        upvoteCount: number;
        downvoteCount: number;
        voteScore: number;
        currentUserIsUpvote: boolean | null;
      }>>(`/api/suggestions/${suggestionId}/votes/summary`)
      .then((res) => {
        const data = unwrapApiData(res.data);

        return {
          upVotes: data.upvoteCount,
          downVotes: data.downvoteCount,
          voteScore: data.voteScore,
          currentUserVote: data.currentUserIsUpvote,
        };
      }),

  deleteSuggestion: (id: string) =>
    apiClient
      .delete<ApiResponse<unknown>>(`/api/suggestions/${id}`)
      .then((res) => res.data.data),
};
