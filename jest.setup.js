/* global jest */

// Native SQLite is unavailable in Jest. This stand-in returns empty results;
// tests that need data mock the repository modules instead.
jest.mock('@op-engineering/op-sqlite', () => {
  const emptyResult = { rows: [], rowsAffected: 0 };
  const createDb = () => ({
    execute: jest.fn(async () => emptyResult),
    executeSync: jest.fn(() => emptyResult),
    transaction: jest.fn(async fn =>
      fn({ execute: jest.fn(async () => emptyResult) }),
    ),
    close: jest.fn(),
  });
  return { open: jest.fn(createDb) };
});

jest.mock('@react-native-community/datetimepicker', () => {
  const MockPicker = () => null;
  return {
    __esModule: true,
    default: MockPicker,
    DateTimePickerAndroid: { open: jest.fn(), dismiss: jest.fn() },
  };
});

// Provides fixed safe-area metrics so SafeAreaProvider renders its children.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
