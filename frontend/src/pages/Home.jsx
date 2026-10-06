import { lazy, Suspense, useEffect } from 'react';
import { trackVisit } from '../services/api';

import Layout from '../components/Layout';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Timeline from '../components/Timeline/Timeline';
import Certifications from '../components/Certifications/Certifications';
import Contact from '../components/Contact/Contact';

const GitHubActivity = lazy(
  () => import('../components/GitHubActivity/GitHubActivity')
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
      <Skills />
      <Timeline />
      <Certifications />
      <Suspense fallback={null}>
        <GitHubActivity />
      </Suspense>
      <Contact />
    </Layout>
  );
};

export default Home;
