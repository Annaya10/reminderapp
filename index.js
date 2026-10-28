/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundMessageHandler } from './src/services/pushMessaging';

// Runs before any UI so pushes received while the app is closed are handled.
registerBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
