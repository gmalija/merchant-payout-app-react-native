/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  // Base Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Shared Neutral Grays
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#333333',
  },

  // Primary Colors
  primary: '#1976D2',
  primaryLight: '#42A5F5',
  primaryDark: '#0D47A1',

  // Semantic Colors - WCAG AA compliance
  success: '#4caf50',
  successLight: '#81C784',
  successDark: '#2E7D32',

  error: '#C62828',
  errorLight: '#EF5350',
  errorDark: '#B71C1C',

  warning: '#ff9800',
  warningLight: '#FFB74D',
  warningDark: '#F57C00',

  info: '#2196F3',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',

  // Link color
  link: '#0a7ea4',

  // Neutral Colors (Light Theme) - WCAG AA compliance
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceVariant: '#EEEEEE',
    text: '#11181C',
    textSecondary: '#616161',
    border: '#E0E0E0',
    divider: 'rgba(0, 0, 0, 0.12)',
    disabled: '#BDBDBD',
    disabledText: '#757575',
    tint: '#1976D2',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#1976D2',
    errorBackground: '#FFEBEE',
    infoBackground: '#E3F2FD',
    successBackground: '#E8F5E9',
    warningBackground: '#FFF3E0',
  },

  // Neutral Colors (Dark Theme) - WCAG AA compliance
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    text: '#ECEDEE',
    textSecondary: '#A8A8A8',
    border: '#444444',
    divider: 'rgba(255, 255, 255, 0.12)',
    disabled: '#424242',
    disabledText: '#999999',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    errorBackground: '#3D1F1F',
    infoBackground: '#1A2A3A',
    successBackground: '#1F3D1F',
    warningBackground: '#3D2F1F',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Typography = {
  fontSize: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const Opacity = {
  disabled: 0.5,
  secondary: 0.7,
  pressed: 0.8,
  full: 1,
} as const;

export const IconSize = {
  xs: 16,
  sm: 18,
  base: 24,
  md: 32,
  lg: 48,
  xl: 64,
} as const;

export const BorderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
} as const;

export const MinTouchTarget = {
  small: 44,
  medium: 48,
  large: 56,
} as const;

export const Layout = {
  headerHeight: 250,
  scrollThrottle: 16,
  gap: {
    xs: 4,
    sm: 6,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
} as const;