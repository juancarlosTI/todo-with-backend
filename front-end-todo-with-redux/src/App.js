import Home from './components/home-list/home-list';
import { BrowserRouter } from 'react-router-dom';
import FontStyles from './fontStyles';
import { ThemeProvider } from './components/contexts/toggleButtonContext';
import { ThemeTogglerButton } from './components/themeToggleButton/themeToggleButton';


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FontStyles />
        <Home />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
