import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contributions from './components/Contributions';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const nextVh = viewportHeight ? `${viewportHeight * 0.01}px` : '1vh';
    document.documentElement.style.setProperty('--vh', nextVh);
  }, [viewportHeight]);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Contributions />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
