import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import { CenteredSpinner } from '@/components/CenteredSpinner';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/colors';
import {
  type AuthStackParamList,
  type CoursesStackParamList,
  type MainTabParamList,
  type RootStackParamList
} from './types';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { CoursesListScreen } from '@/screens/courses/CoursesListScreen';
import { CourseDetailScreen } from '@/screens/courses/CourseDetailScreen';
import { WishlistScreen } from '@/screens/wishlist/WishlistScreen';
import { MyCoursesScreen } from '@/screens/visits/MyCoursesScreen';
import { AddVisitScreen } from '@/screens/visits/AddVisitScreen';
import { StatsOverviewScreen } from '@/screens/stats/StatsOverviewScreen';
import { PublicProfileScreen } from '@/screens/profile/PublicProfileScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const CoursesStack = createNativeStackNavigator<CoursesStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);

const CoursesNavigator = () => (
  <CoursesStack.Navigator>
    <CoursesStack.Screen
      name="CoursesList"
      component={CoursesListScreen}
      options={{ headerShown: false }}
    />
    <CoursesStack.Screen
      name="CourseDetail"
      component={CourseDetailScreen}
      options={{ title: 'Course' }}
    />
  </CoursesStack.Navigator>
);

const TabsNavigator = () => {
  const { user } = useAuth();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => {
          const iconName = getTabIcon(route.name);
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tabs.Screen name="CoursesTab" component={CoursesNavigator} options={{ title: 'Courses' }} />
      <Tabs.Screen name="WishlistTab" component={WishlistScreen} options={{ title: 'Wishlist' }} />
      <Tabs.Screen
        name="MyCoursesTab"
        component={MyCoursesScreen}
        options={{ title: 'My Courses' }}
      />
      <Tabs.Screen name="StatsTab" component={StatsOverviewScreen} options={{ title: 'Stats' }} />
      <Tabs.Screen
        name="ProfileTab"
        component={PublicProfileScreen}
        options={{ title: 'Profile' }}
        initialParams={{ slug: user?.publicSlug }}
      />
    </Tabs.Navigator>
  );
};

const getTabIcon = (routeName: keyof MainTabParamList) => {
  switch (routeName) {
    case 'CoursesTab':
      return 'golf-outline';
    case 'WishlistTab':
      return 'heart-outline';
    case 'MyCoursesTab':
      return 'flag-outline';
    case 'StatsTab':
      return 'stats-chart-outline';
    case 'ProfileTab':
      return 'person-circle-outline';
    default:
      return 'ellipse-outline';
  }
};

export const RootNavigator = () => {
  const { status } = useAuth();

  const isAuthenticated = status === 'authenticated';

  const rootScreenOptions = useMemo(
    () => ({
      headerShown: false
    }),
    []
  );

  if (status === 'loading') {
    return <CenteredSpinner message="Loading your data..." />;
  }

  return (
    <RootStack.Navigator screenOptions={rootScreenOptions}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={TabsNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
      <RootStack.Screen
        name="AddVisitModal"
        component={AddVisitScreen}
        options={{ title: 'Add Visit', presentation: 'modal' }}
      />
    </RootStack.Navigator>
  );
};
