import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from './styles/theme';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
    //<StrictMode>
    <ThemeProvider theme={theme()}>
        <CssBaseline />
        <App />
    </ThemeProvider>
    //</StrictMode>
);