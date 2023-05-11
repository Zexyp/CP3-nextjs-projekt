import '@/styles/globals.css'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1FB311',
        },
        secondary: {
            main: '#1FB311',
        },
    },
});

export default function App({ Component, pageProps }) {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}
