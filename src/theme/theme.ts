import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: { danger: string };
  }
  interface ThemeOptions {
    status?: { danger?: string };
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6f00',
      light: '#ffa040',
      dark: '#c43e00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#64748b',
    },
    error: { main: '#ef4444', light: '#fca5a5' },
    warning: { main: '#f59e0b', light: '#fde68a' },
    info: { main: '#3b82f6', light: '#93c5fd' },
    success: { main: '#10b981', light: '#6ee7b7' },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.025em' },
    h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.015em' },
    h4: { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.01em' },
    h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.5, letterSpacing: '0.06em', textTransform: 'uppercase' as const },
    body1: { fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem', fontWeight: 400, lineHeight: 1.55 },
    button: { fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.75, letterSpacing: '0.02em', textTransform: 'none' as const },
    caption: { fontSize: '0.6875rem', fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.02em' },
    overline: { fontSize: '0.625rem', fontWeight: 700, lineHeight: 2, letterSpacing: '0.1em', textTransform: 'uppercase' as const },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0,0,0,0.05)',
    '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
    '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.07)',
    '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.07)',
    '0 20px 25px -5px rgba(0,0,0,0.07), 0 8px 10px -6px rgba(0,0,0,0.07)',
    '0 25px 50px -12px rgba(0,0,0,0.15)',
    '0 25px 50px -12px rgba(0,0,0,0.18)',
    '0 25px 50px -12px rgba(0,0,0,0.2)',
    '0 25px 50px -12px rgba(0,0,0,0.22)',
    '0 25px 50px -12px rgba(0,0,0,0.24)',
    '0 25px 50px -12px rgba(0,0,0,0.26)',
    '0 25px 50px -12px rgba(0,0,0,0.28)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
    '0 25px 50px -12px rgba(0,0,0,0.3)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.15) transparent' } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)', transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        contained: { '&:hover': { boxShadow: '0 6px 16px rgba(26, 35, 126, 0.25)' } },
        sizeLarge: { padding: '12px 28px', fontSize: '0.9375rem', borderRadius: 12 },
        sizeSmall: { padding: '6px 14px', fontSize: '0.75rem', borderRadius: 8 },
      },
      defaultProps: { disableElevation: true },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
          transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': { boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, fontSize: '0.75rem', height: 28 },
        sizeSmall: { height: 24, fontSize: '0.6875rem' },
        outlined: { borderWidth: 1.5 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundImage: 'none' },
        elevation1: { boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' },
        elevation2: { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)' },
        elevation3: { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.06)' },
        elevation4: { boxShadow: '0 20px 25px -5px rgba(0,0,0,0.07), 0 8px 10px -6px rgba(0,0,0,0.07)' },
        outlined: { borderColor: 'rgba(0,0,0,0.08)' },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#534bae' },
            '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(26, 35, 126, 0.08)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2 },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 20, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: '#1a1a2e', fontSize: '0.75rem', fontWeight: 500, padding: '6px 12px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
        arrow: { color: '#1a1a2e' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontSize: '0.8125rem', fontWeight: 500, border: '1px solid' },
        standardSuccess: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' },
        standardError: { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
        standardWarning: { backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' },
        standardInfo: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '14px 16px' },
        head: { fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.05em', textTransform: 'uppercase', backgroundColor: '#f8f9fb', color: '#64748b' },
      },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', minHeight: 48 } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6, backgroundColor: 'rgba(0,0,0,0.06)' },
        bar: { borderRadius: 4 },
      },
    },
  },
});

export default theme;
