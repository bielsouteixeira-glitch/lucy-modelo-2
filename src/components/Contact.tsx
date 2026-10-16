import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { whatsappLinks } from '@/lib/whatsapp';
import Reveal from '@/components/Reveal';

const Contact = () => {
  return (
    <section id="contato" className="py-24 bg-brand-primary text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <Reveal className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Vamos cuidar do seu pet?
          </h2>
          <p className="text-xl text-white/80">
            Estou à disposição para tirar suas dúvidas e agendar o melhor horário para você e seu amigo.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <a 
              href={whatsappLinks.general} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-brand-primary px-10 py-5 rounded-full text-xl font-bold flex items-center gap-3 hover:bg-gray-100 transition-all shadow-2xl active:scale-95"
            >
              <MessageCircle size={24} />
              Falar via WhatsApp
            </a>
            <a 
              href="https://www.instagram.com/lucorrea_animalcare" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white/50 text-white px-10 py-5 rounded-full text-xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              Seguir no Instagram
            </a>
          </div>

          <div className="pt-12 flex flex-col items-center gap-3 text-white/70">
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span className="text-lg font-medium">+55 11 91187-9750</span>
            </div>
            <p className="text-sm opacity-60">Atendimento personalizado com amor e dedicação.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
