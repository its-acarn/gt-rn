import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type VisitFilters,
  createVisit,
  deleteVisit,
  fetchVisitedCourses,
  fetchVisits,
  updateVisit
} from './api';
import { Visit } from '@/types/domain';

const EMPTY_FILTERS: VisitFilters = {};

const visitsKey = (filters: VisitFilters) => [
  'visits',
  filters.courseId ?? '',
  filters.year ?? null,
  filters.country ?? '',
  filters.limit ?? null,
  filters.offset ?? null
];

export const useVisits = (filters?: VisitFilters) => {
  const normalized = filters ?? EMPTY_FILTERS;

  return useQuery<Visit[]>({
    queryKey: visitsKey(normalized),
    queryFn: () => fetchVisits(normalized)
  });
};

export const useVisitedCourses = () =>
  useQuery<Visit[]>({
    queryKey: ['visitedCourses'],
    queryFn: fetchVisitedCourses
  });

export const useCreateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['visitedCourses'] });
    }
  });
};

export const useUpdateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVisit,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['course', result.courseId] });
    }
  });
};

export const useDeleteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['visitedCourses'] });
    }
  });
};
