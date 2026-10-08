import { Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const PrintApmCaseStudy = lazy(() => import('./pages/PrintApmCaseStudy'));

import { usePageMeta } from './hooks/usePageMeta';

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#16140F]">
    <p className="font-mono text-sm text-[#E8A33D] animate-pulse">$ loading...</p>
  </div>
);

const NotFound = () => {
  usePageMeta({
    title: '404: Not Found | Ankit Singh',
    description: 'The requested route does not exist.',
    noindex: true,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#16140F] p-4 text-center">
      <h1 className="font-mono text-xl text-[#E8A33D]">$ 404: command not found</h1>
      <p className="font-mono text-sm text-[#B9B09A] mt-2">
        The requested route does not exist in this environment.
      </p>
      <Link to="/" className="mt-6 font-mono text-sm text-[#E8A33D] hover:underline">
        cd ~ (Return Home)
      </Link>
    </div>
  );
};

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/projects/printapm" element={<PrintApmCaseStudy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default App;
