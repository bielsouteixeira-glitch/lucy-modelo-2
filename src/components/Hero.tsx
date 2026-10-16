import React from 'react';
import { MessageCircle, ArrowRight, PawPrint } from 'lucide-react';
import { whatsappLinks } from '@/lib/whatsapp';
import Photo from '@/components/Photo';
import Reveal from '@/components/Reveal';

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-28 pb-20 lg:pt-24 lg:pb-0 overflow-hidden bg-brand-bg">
      {/* Decorative Elements */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-brand-primary-light rounded-full blur-3xl opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 -left-20 w-72 h-72 bg-brand-accent rounded-full blur-3xl opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <Reveal animation="left" className="flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              LU CORRÊA ANIMAL CARE
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] text-brand-text">
              Cuidado que faz bem para quem <span className="text-brand-primary">faz parte da família.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
              Atendimento veterinário e estética animal com carinho, atenção e cuidado em cada detalhe. Porque seu pet merece o melhor tratamento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={whatsappLinks.general}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-primary text-white px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg hover:shadow-brand-primary/30 active:scale-95"
              >
                <MessageCircle size={22} aria-hidden="true" />
                Fale com a Lucy
              </a>
              <a
                href="#servicos"
                className="px-8 py-4 rounded-full text-lg font-bold text-brand-text border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2 group bg-white/60"
              >
                Conheça os serviços
                <ArrowRight size={20} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </Reveal>

          <Reveal animation="zoom" delay={180} className="relative">
            {/* Imagem principal da primeira dobra (LCP) */}
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto border-8 border-white">
              <Photo
                name="lucy-dog1"
                alt="Lucy Corrêa segurando um cachorro durante o atendimento na Lu Corrêa Animal Care"
                priority
                sizes="(max-width: 1024px) 90vw, 420px"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Cartão decorativo flutuante */}
            <div className="absolute -bottom-6 left-0 sm:-left-2 lg:-left-6 z-20 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden sm:flex items-center gap-3">
              <div className="bg-brand-primary-light p-2.5 rounded-full">
                <PawPrint className="text-brand-primary" size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Cuidado profissional</p>
                <p className="text-sm font-bold text-brand-text">Atenção a cada detalhe</p>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary-light/30 rounded-full blur-3xl -z-10 pointer-events-none" aria-hidden="true" />
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default Hero;
