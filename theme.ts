export interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface ThemeSettings {
  currentTheme: Theme;
  themes: Theme[];
  onThemeSelect: (theme: string) => void;
}
