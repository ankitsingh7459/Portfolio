import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';

const App = lazy(() => import('./App'));

const RootLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
    <p className="neon-text text-xl font-bold">Loading...</p>
  </div>
);

const Root = () => (
  <BrowserRouter>
    <ThemeProvider>
      <Suspense fallback={<RootLoader />}>
        <App />
      </Suspense>
    </ThemeProvider>
  </BrowserRouter>
);

export default Root;
