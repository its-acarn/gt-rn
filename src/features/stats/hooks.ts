import { useQuery } from '@tanstack/react-query';

import { fetchStatsOverview, fetchStatsTimeline, type StatsTimelineParams } from './api';

export const useStatsOverview = () =>
  useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: fetchStatsOverview
  });

export const useStatsTimeline = (params: StatsTimelineParams) =>
  useQuery({
    queryKey: ['stats', 'timeline', params.groupBy],
    queryFn: () => fetchStatsTimeline(params)
  });
