import { lazy, Suspense, useEffect } from 'react';
import { trackVisit } from '../services/api';

import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Timeline from '../components/Timeline/Timeline';
import Certifications from '../components/Certifications/Certifications';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
import ScrollProgress from '../components/ScrollProgress/ScrollProgress';

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
    <main className="relative">
      <ScrollProgress />
      <Navbar />

      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Suspense fallback={null}>
          <GitHubActivity />
        </Suspense>
        <Timeline />
        <Certifications />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
