import { lazy, Suspense, useEffect } from 'react';
import { trackVisit } from '../services/api';

import Layout from '../components/Layout';
import Hero from '../components/Hero/Hero';
import Projects from '../components/Projects/Projects';
import About from '../components/About/About';
import Stack from '../features/stack/Stack';
import Log from '../features/log/Log';
import Resume from '../features/resume/Resume';
import Contact from '../features/contact/Contact';

const GitHubActivity = lazy(
  () => import('../features/github/GitHubActivity')
);

const Home = () => {
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
