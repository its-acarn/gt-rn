import { api } from '@/services/api';

export type StatsOverview = {
  totalCourses: number;
  totalVisits: number;
  mostRecentVisitDate?: string | null;
  visitsByYear: { year: number; count: number }[];
  visitsByRegion: { country: string; region?: string | null; count: number }[];
  longestMonthStreak: number;
};

export type StatsTimelineParams = {
  groupBy: 'year' | 'month';
};

export type StatsTimelinePoint = {
  period: string;
  visits: number;
  coursesPlayed: number;
};

export const fetchStatsOverview = async () => {
  const response = await api.get<StatsOverview>('/api/me/stats/overview');
  return response.data;
};

export const fetchStatsTimeline = async ({ groupBy }: StatsTimelineParams) => {
  const response = await api.get<StatsTimelinePoint[]>(`/api/me/stats/timeline`, {
    params: { groupBy }
  });
  return response.data;
};
