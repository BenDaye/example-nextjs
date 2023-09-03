import { Theme } from '@mui/material';
import { AppColorThemeType } from '../constants';
import { theme as light } from './light';
import { theme as dark } from './dark';

export const themes: Record<AppColorThemeType, Theme> = {
  LIGHT: light,
  GITHUB_LIGHT: light,
  SOLARIZED_LIGHT: light,
  DARK: dark,
  GITHUB_DARK: dark,
  SOLARIZED_DARK: dark,
  CUSTOM: light,
};

export default themes;
