import { useWindowDimensions } from 'react-native';
import { Breakpoints, ContentMaxWidth } from '@src/constants/layout';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= Breakpoints.tablet;
  const contentMaxWidth = isTablet ? ContentMaxWidth : undefined;

  return { width, height, isTablet, contentMaxWidth };
};
