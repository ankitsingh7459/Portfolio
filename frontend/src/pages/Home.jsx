import { lazy, Suspense, useEffect } from 'react';
import { trackVisit } from '../services/api';

import Layout from '../components/Layout';
import Hero from '../features/hero/Hero';
import Projects from '../features/projects/Projects';
import About from '../features/about/About';
import Stack from '../features/stack/Stack';
import Log from '../features/log/Log';
import Resume from '../features/resume/Resume';
import Contact from '../features/contact/Contact';

import { usePageMeta } from '../hooks/usePageMeta';

const GitHubActivity = lazy(
  () => import('../features/github/GitHubActivity')
);

const Home = () => {
  usePageMeta({
    title: 'Ankit Singh | [FILL: title]',
    description: 'Personal portfolio of Ankit Singh, [FILL: title].',
    canonicalPath: '/',
  });

  useEffect(() => {
    const sid = sessionStorage.getItem('session_id') || crypto.randomUUID();
    sessionStorage.setItem('session_id', sid);
    trackVisit({ session_id: sid, page_path: '/', section: 'home' }).catch(() => {});
  }, []);

  return (
    <Layout>
      <Hero />
      <Projects />
      <About />
      <Stack />
      <Log />
      <Suspense fallback={null}>
        <GitHubActivity />
      </Suspense>
      <Resume />
      <Contact />
    </Layout>
  );
};

export default Home;
