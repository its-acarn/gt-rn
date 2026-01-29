import { useQuery } from '@tanstack/react-query';

import { fetchPublicStats, fetchPublicVisitedCourses } from './api';

export const usePublicVisitedCourses = (slug?: string) =>
  useQuery({
    queryKey: ['publicProfile', slug, 'visitedCourses'],
    queryFn: () => {
      if (!slug) {
        throw new Error('Slug is required');
      }

      return fetchPublicVisitedCourses(slug);
    },
    enabled: Boolean(slug)
  });

export const usePublicStats = (slug?: string) =>
  useQuery({
    queryKey: ['publicProfile', slug, 'stats'],
    queryFn: () => {
      if (!slug) {
        throw new Error('Slug is required');
      }

      return fetchPublicStats(slug);
    },
    enabled: Boolean(slug)
  });
