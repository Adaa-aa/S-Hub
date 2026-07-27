// constants/theme.ts
// Design tokens pulled directly from the Waker Stitch design system (abease/DESIGN.md)
// Drop this in your project's constants/ folder and update imports in the screens below.

export const colors = {
  surface: '#f9f9f9',
  surfaceDim: '#dadada',
  surfaceBright: '#f9f9f9',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f3f3f3',
  surfaceContainer: '#eeeeee',
  surfaceContainerHigh: '#e8e8e8',
  surfaceContainerHighest: '#e2e2e2',
  onSurface: '#1b1b1b',
  onSurfaceVariant: '#5c3f3d',
  inverseSurface: '#303030',
  inverseOnSurface: '#f1f1f1',
  outline: '#916f6c',
  outlineVariant: '#e6bdba',
  surfaceTint: '#c0001f',
  primary: '#a30019',
  onPrimary: '#ffffff',
  primaryContainer: '#ce1126',
  onPrimaryContainer: '#ffe0dd',
  inversePrimary: '#ffb3ae',
  secondary: '#715c00',
  onSecondary: '#ffffff',
  secondaryContainer: '#ffd31a',
  onSecondaryContainer: '#705b00',
  tertiary: '#005c35',
  onTertiary: '#ffffff',
  tertiaryContainer: '#187649',
  onTertiaryContainer: '#a1fac1',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  background: '#f9f9f9',
  onBackground: '#1b1b1b',
  surfaceVariant: '#e2e2e2',
  // Ghana flag accents used for decorative elements
  ghanaRed: '#CE1126',
  ghanaGold: '#FCD116',
  ghanaGreen: '#006B3F',
};

export const typography = {
  display: { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: 40, lineHeight: 48, letterSpacing: -0.8 },
  headlineLg: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 32, lineHeight: 40, letterSpacing: -0.3 },
  headlineLgMobile: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 28, lineHeight: 36 },
  headlineMd: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 24, lineHeight: 32 },
  bodyLg: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 18, lineHeight: 28 },
  bodyMd: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 16, lineHeight: 24 },
  labelMd: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 14, lineHeight: 20, letterSpacing: 0.7 },
  button: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, lineHeight: 24, letterSpacing: 0.16 },
};

export const spacing = {
  base: 4,
  xs: 8,
  sm: 16,
  gutter: 16,
  md: 24,
  lg: 32,
  xl: 48,
  containerMargin: 20,
};

export const radius = {
  sm: 4,
  default: 8,
  lg: 8,
  xl: 12,
  full: 9999,
};
