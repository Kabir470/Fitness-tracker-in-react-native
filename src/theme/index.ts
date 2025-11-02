export const palette = {
  lime: '#2EE58F',
  sky: '#4DC6FF',
  bgLight: '#FFFFFF',
  surfaceLight: '#F6F9FC',
  textLight: '#101418',
  bgDark: '#0E1116',
  surfaceDark: '#151A22',
  textDark: '#E7EBF0',
  error: '#FF5252'
};

export const appColors = {
  light: {
    primary: palette.lime,
    secondary: palette.sky,
    background: palette.bgLight,
    surface: palette.surfaceLight,
    text: palette.textLight,
    error: palette.error
  },
  dark: {
    primary: palette.lime,
    secondary: palette.sky,
    background: palette.bgDark,
    surface: palette.surfaceDark,
    text: palette.textDark,
    error: palette.error
  }
};

export default { colors: appColors };
