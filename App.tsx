import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@/providers/AppProviders';
import { RootNavigator } from '@/navigation/RootNavigator';

const App = () => (
  <AppProviders>
    <StatusBar style="auto" />
    <RootNavigator />
  </AppProviders>
);

export default App;
