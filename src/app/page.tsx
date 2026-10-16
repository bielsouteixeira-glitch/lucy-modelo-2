import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import Services from '@/components/Services';
import About from '@/components/About';
import Gallery from '@/components/Gallery';
import Videos from '@/components/Videos';
import Booking from '@/components/Booking';
import Hours from '@/components/Hours';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <main id="conteudo" className="relative">
      <Navbar />
      <Hero />
      <TrustStrip />
      <Services />
      <About />
      <Gallery />
      <Videos />
      <Booking />
      <Hours />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
