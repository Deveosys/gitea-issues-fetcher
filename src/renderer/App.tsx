import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Issues from './components/Issues';
import Settings from './components/Settings';

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Settings />} />
          <Route path="/issues" element={<Issues />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
