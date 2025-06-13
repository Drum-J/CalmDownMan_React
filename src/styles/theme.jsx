import { createTheme } from '@mui/material/styles';

export const theme = () =>
    createTheme({
        cssVariables: true,
        palette: {
            primary: {
                main: '#4285f4', // 사이드바에 보이는 파란색
                light: '#5c9eff',
                dark: '#0d1117',
            },
            secondary: {
                main: '#0073E6',
            },
            error: {
                main: '#f44336',
            },
            warning: {
                main: '#ff9800',
            },
            info: {
                main: '#2196f3',
            },
            success: {
                main: '#4caf50',
            },
            background: {
                default: '#0d1117',
                paper: '#161b22',
            },
            text: {
                primary: '#c9d1d9',
                secondary: '#8b949e',
            },
            divider: '#30363d',
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#161b22',
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: '#4285f4', // 사이드바 배경색 (파란색)
                        color: '#ffffff', // 사이드바 텍스트 색상 (흰색)
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#161b22',
                        borderRadius: '8px',
                    },
                },
            },
        },
        typography: {
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        },
    });
