import { api } from '@/services/api';
import { Visit } from '@/types/domain';

export type VisitFilters = {
  courseId?: string;
  year?: number;
  country?: string;
  limit?: number;
  offset?: number;
};

export const fetchVisits = async (filters: VisitFilters = {}) => {
  const response = await api.get<Visit[]>('/api/me/visits', { params: filters });
  return response.data;
};

export type CreateVisitPayload = {
  id: string;
  courseId: string;
  visitDate: string;
  holesPlayed: 9 | 18;
  grossScore?: number;
  teeBoxId?: string;
  teeName?: string;
};

export const createVisit = async (payload: CreateVisitPayload) => {
  const response = await api.post<Visit>('/api/visits', payload);
  return response.data;
};

export type UpdateVisitPayload = Partial<CreateVisitPayload> & {
  id: string;
};

export const updateVisit = async ({ id, ...payload }: UpdateVisitPayload) => {
  const response = await api.patch<Visit>(`/api/me/visits/${id}`, payload);
  return response.data;
};

export const deleteVisit = async (id: string) => {
  await api.delete(`/api/me/visits/${id}`);
  return id;
};

export const fetchVisitedCourses = async () => {
  const response = await api.get<Visit[]>('/api/me/visited-courses');
  return response.data;
};
