import { api } from '@/services/api';
import { Visit } from '@/types/domain';
import { StatsOverview } from '@/features/stats/api';

export type PublicProfile = {
  slug: string;
  displayName: string;
};

export const fetchPublicVisitedCourses = async (slug: string) => {
  const response = await api.get<Visit[]>(`/api/profile/${slug}/visited-courses`);
  return response.data;
};

export const fetchPublicStats = async (slug: string) => {
  const response = await api.get<StatsOverview>(`/api/profile/${slug}/stats/overview`);
  return response.data;
};
