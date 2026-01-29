import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  enabled: true,
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register'
        }
      },
      Main: {
        screens: {
          CoursesTab: {
            screens: {
              CoursesList: 'courses',
              CourseDetail: 'courses/:courseId'
            }
          },
          WishlistTab: 'wishlist',
          MyCoursesTab: 'my-courses',
          AddVisitModal: 'visits/new',
          StatsTab: 'stats',
          ProfileTab: 'profile/:slug'
        }
      }
    }
  }
};
