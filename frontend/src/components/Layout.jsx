import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import ScrollProgress from './ScrollProgress/ScrollProgress';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#16140F] text-[#F1E9D2] flex flex-col font-sans selection:bg-[#E8A33D] selection:text-[#16140F]">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 relative z-10 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
