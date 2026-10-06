import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

const App = lazy(() => import('./App'));

const RootLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#16140F]">
    <p className="text-xl font-mono text-[#E8A33D]">Loading...</p>
  </div>
);

const Root = () => (
  <BrowserRouter>
    <Suspense fallback={<RootLoader />}>
      <App />
    </Suspense>
  </BrowserRouter>
);

export default Root;
