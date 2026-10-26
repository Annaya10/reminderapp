import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@src/context/AuthContext';
import { AppRoutes } from '@src/routes/AppRoutes';
import { initMapbox } from '@src/services/mapbox';

initMapbox();

const App = () => (
  <SafeAreaProvider>
    <StatusBar barStyle="dark-content" />
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </SafeAreaProvider>
);

export default App;
