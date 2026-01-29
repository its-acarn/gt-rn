import { api } from '@/api/client';
import { Course, TeeBox } from '@/types/domain';

export type CourseSearchParams = {
  search?: string;
  country?: string;
  region?: string;
  near?: string; // lat,long
  radiusKm?: number;
};

export const fetchCourses = async (params: CourseSearchParams = {}) => {
  const response = await api.get<Course[]>('/api/courses', { params });
  return response.data;
};

export type CourseDetailResponse = Course & {
  teeBoxes: TeeBox[];
};

export const fetchCourseDetail = async (courseId: string) => {
  const response = await api.get<CourseDetailResponse>(`/api/courses/${courseId}`);
  return response.data;
};

export const fetchCourseDeltas = async (since?: string) => {
  const response = await api.get<CourseDetailResponse[]>(`/api/courses/delta`, {
    params: { since }
  });
  return response.data;
};
