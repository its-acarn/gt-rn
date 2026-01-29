import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type CourseDetailResponse,
  type CourseSearchParams,
  fetchCourseDetail,
  fetchCourses
} from './api';
import { Course } from '@/types/domain';

const EMPTY_PARAMS: CourseSearchParams = {};

const coursesKey = (params: CourseSearchParams) => [
  'courses',
  params.search ?? '',
  params.country ?? '',
  params.region ?? '',
  params.near ?? '',
  params.radiusKm ?? null
];

export const useCourses = (params?: CourseSearchParams) => {
  const normalizedParams = params ?? EMPTY_PARAMS;

  return useQuery<Course[]>({
    queryKey: coursesKey(normalizedParams),
    queryFn: () => fetchCourses(normalizedParams)
  });
};

export const useCourseDetail = (courseId?: string) =>
  useQuery<CourseDetailResponse>({
    queryKey: ['course', courseId],
    queryFn: () => {
      if (!courseId) {
        throw new Error('Missing course id');
      }

      return fetchCourseDetail(courseId);
    },
    enabled: Boolean(courseId)
  });

export const useInvalidateCourses = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['courses'] });
};

export const useRefreshCourseDetail = () => {
  const queryClient = useQueryClient();
  return (courseId: string) =>
    queryClient.invalidateQueries({ queryKey: ['course', courseId] });
};
