import React from 'react';
import { Clock, MessageCircle } from 'lucide-react';
import { whatsappLinks } from '@/lib/whatsapp';
import Reveal from '@/components/Reveal';

const Hours = () => {
  const schedule = [
    { day: "Segunda", hours: "09:00 às 17:00" },
    { day: "Terça", hours: "09:00 às 17:00" },
    { day: "Quarta", hours: "09:00 às 17:00" },
    { day: "Quinta", hours: "09:00 às 17:00" },
    { day: "Sexta", hours: "09:00 às 17:00" },
    { day: "Sábado", hours: "09:00 às 15:00", highlight: true },
    { day: "Domingo", hours: "Fechado", closed: true },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <Reveal animation="left" className="space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
              Horários
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight">
              Horários de atendimento
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Trabalhamos com agendamentos para garantir a tranquilidade e o conforto de cada pet. Por favor, consulte a disponibilidade via WhatsApp.
            </p>
            
            <div className="pt-4">
              <a 
                href={whatsappLinks.general} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg"
              >
                <MessageCircle size={20} />
                Consultar Disponibilidade
              </a>
            </div>
          </Reveal>

          <Reveal animation="right" delay={120} className="bg-brand-bg p-8 rounded-3xl border border-gray-100 shadow-inner">
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between items-center p-4 rounded-xl ${item.closed ? 'bg-gray-100 opacity-60' : item.highlight ? 'bg-brand-primary-light border border-brand-primary/20' : 'bg-white border border-gray-100'}`}
                >
                  <span className={`font-bold ${item.closed ? 'text-gray-500' : 'text-brand-text'}`}>{item.day}</span>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-brand-primary" />
                    <span className={`${item.closed ? 'text-gray-500' : 'text-gray-600'} font-medium`}>{item.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default Hours;
