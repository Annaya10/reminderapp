module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['@rnmapbox/maps/setup-jest', '<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-vector-icons|@rnmapbox)/)',
  ],
};
