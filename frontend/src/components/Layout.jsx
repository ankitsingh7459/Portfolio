import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import ScrollProgress from './ScrollProgress/ScrollProgress';
import CommandPalette from './CommandPalette/CommandPalette';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#16140F] text-[#F1E9D2] flex flex-col font-sans selection:bg-[#E8A33D] selection:text-[#16140F]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#E8A33D] focus:text-[#16140F] focus:font-mono focus:font-semibold focus:text-xs focus:rounded-[2px] focus:outline-2 focus:outline-[#E8A33D] focus:outline-offset-2"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
      <main id="main" tabIndex={-1} className="flex-1 relative z-10 pt-16 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
