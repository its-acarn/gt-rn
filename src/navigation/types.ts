import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AddVisitModal: { courseId?: string } | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type CoursesStackParamList = {
  CoursesList: undefined;
  CourseDetail: { courseId: string };
};

export type MainTabParamList = {
  CoursesTab: NavigatorScreenParams<CoursesStackParamList> | undefined;
  WishlistTab: undefined;
  MyCoursesTab: undefined;
  StatsTab: undefined;
  ProfileTab: { slug?: string } | undefined;
};
