/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import App from '../App';
import { LoginScreen } from '@src/modules/auth/LoginScreen';
import { BottomTabs } from '@src/routes/bottomNav/BottomTabs';

test('a logged-out user only sees the login screen', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  // Let the database open and the (empty) session restore.
  await ReactTestRenderer.act(async () => {});

  expect(renderer.root.findAllByType(LoginScreen)).toHaveLength(1);
  expect(renderer.root.findAllByType(BottomTabs)).toHaveLength(0);
});
