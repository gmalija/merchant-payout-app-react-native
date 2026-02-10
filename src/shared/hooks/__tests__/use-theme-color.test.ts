import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../use-theme-color';
import { Colors } from '@/shared/constants/theme';
import * as useColorSchemeModule from '../use-color-scheme';

jest.mock('../use-color-scheme');

const mockUseColorScheme = useColorSchemeModule.useColorScheme as jest.MockedFunction<
  typeof useColorSchemeModule.useColorScheme
>;

describe('useThemeColor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return light color when theme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.light.text);
  });

  it('should return dark color when theme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.dark.text);
  });

  it('should return light color when theme is null (defaults to light)', () => {
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.light.text);
  });

  it('should return custom light color from props when provided', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#FF0000', dark: '#00FF00' }, 'text')
    );

    expect(result.current).toBe('#FF0000');
  });

  it('should return custom dark color from props when provided', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#FF0000', dark: '#00FF00' }, 'text')
    );

    expect(result.current).toBe('#00FF00');
  });

  it('should fall back to theme color when custom prop not provided for current theme', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ dark: '#00FF00' }, 'text')
    );

    expect(result.current).toBe(Colors.light.text);
  });

  it('should work with different color names', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result: backgroundResult } = renderHook(() =>
      useThemeColor({}, 'background')
    );
    expect(backgroundResult.current).toBe(Colors.light.background);

    const { result: iconResult } = renderHook(() => useThemeColor({}, 'icon'));
    expect(iconResult.current).toBe(Colors.light.icon);

    const { result: tabIconDefaultResult } = renderHook(() =>
      useThemeColor({}, 'tabIconDefault')
    );
    expect(tabIconDefaultResult.current).toBe(Colors.light.tabIconDefault);
  });

  it('should handle theme changes', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result, rerender } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.light.text);

    // Simulate theme change
    mockUseColorScheme.mockReturnValue('dark');
    rerender();

    expect(result.current).toBe(Colors.dark.text);
  });

  it('should prioritize custom props over theme colors', () => {
    mockUseColorScheme.mockReturnValue('light');

    const customColor = '#CUSTOM';
    const { result } = renderHook(() =>
      useThemeColor({ light: customColor }, 'text')
    );

    expect(result.current).toBe(customColor);
    expect(result.current).not.toBe(Colors.light.text);
  });
});
