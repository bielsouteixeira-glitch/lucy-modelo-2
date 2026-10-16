import React from 'react';
import { MapPin, Globe, MessageCircle } from 'lucide-react';
import { whatsappLinks } from '@/lib/whatsapp';
import Reveal from '@/components/Reveal';

const Booking = () => {
  return (
    <section className="py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
            Modalidades
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-6">
            Atendimento presencial e online
          </h2>
          <p className="text-gray-600 text-lg">
            Oferecemos flexibilidade para cuidar do seu pet da melhor forma possível, seja pessoalmente ou via teleconsulta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Reveal className="card-lift p-10 rounded-3xl bg-white border border-gray-100 shadow-xl flex flex-col items-center text-center space-y-6">
            <div className="bg-brand-primary-light p-5 rounded-full text-brand-primary">
              <MapPin size={40} />
            </div>
            <h3 className="text-2xl font-bold text-brand-text">Consulta Presencial</h3>
            <p className="text-gray-600 leading-relaxed">
              Ideal para exames físicos, vacinas e procedimentos que exigem a presença do animal na clínica.
            </p>
            <a 
              href={whatsappLinks.consultation} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-brand-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
            >
              <MessageCircle size={20} />
              Agendar Presencial
            </a>
          </Reveal>

          <Reveal delay={120} className="card-lift p-10 rounded-3xl bg-white border border-gray-100 shadow-xl flex flex-col items-center text-center space-y-6">
            <div className="bg-brand-accent p-5 rounded-full text-purple-600">
              <Globe size={40} />
            </div>
            <h3 className="text-2xl font-bold text-brand-text">Consulta Online</h3>
            <p className="text-gray-600 leading-relaxed">
              Ótima para orientações, acompanhamento de tratamentos e dúvidas iniciais sem estresse de locomoção.
            </p>
            <a 
              href={whatsappLinks.online} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-brand-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
            >
              <MessageCircle size={20} />
              Agendar Online
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Booking;
