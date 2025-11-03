export const palette = {
  primary: '#6366F1', // indigo glow
  secondary: '#22D3EE', // cyan accent
  bgLight: '#F2E4FD',
  surfaceLight: '#FFFFFF',
  textLight: '#101418',
  bgDark: '#0E1116',
  surfaceDark: '#151A22',
  textDark: '#E7EBF0',
  error: '#FF5252'
};

export const appColors = {
  light: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.bgLight,
    surface: palette.surfaceLight,
    text: palette.textLight,
    error: palette.error
  },
  dark: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.bgDark,
    surface: palette.surfaceDark,
    text: palette.textDark,
    error: palette.error
  }
};

export default { colors: appColors };
