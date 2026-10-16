import React from 'react';
import { Heart, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import Reveal from '@/components/Reveal';

const TrustStrip = () => {
  const pillars = [
    { icon: Heart, title: "Cuidado", text: "Atenção genuína a cada pet" },
    { icon: ShieldCheck, title: "Confiança", text: "Competência e segurança" },
    { icon: Sparkles, title: "Bem-estar", text: "Higiene e conforto" },
    { icon: UserCheck, title: "Atendimento", text: "Dedicação personalizada" },
  ];

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal
                key={pillar.title}
                delay={index * 90}
                className="flex flex-col items-center text-center space-y-3"
              >
                <div className="bg-brand-primary-light p-3 rounded-2xl">
                  <Icon className="text-brand-primary" size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text text-sm uppercase tracking-wider">{pillar.title}</h3>
                  <p className="text-gray-500 text-xs">{pillar.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
