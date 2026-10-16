import React from 'react';
import { Stethoscope, Syringe } from 'lucide-react';
import Reveal from '@/components/Reveal';

type VideoModuleProps = {
  src: string;
  poster: string;
  title: string;
  description: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
};

const VideoModule = ({ src, poster, title, description, label, icon, delay = 0 }: VideoModuleProps) => (
  <Reveal
    as="article"
    delay={delay}
    className="bg-brand-bg rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
  >
    <div className="p-5 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
      {/* Vídeos originais em formato vertical: moldura 9:16 para não cortar a cena */}
      <div className="w-full max-w-[260px] shrink-0 rounded-2xl overflow-hidden bg-black shadow-lg aspect-[9/16]">
        <video
          poster={poster}
          controls
          playsInline
          preload="none"
          className="w-full h-full object-cover"
          aria-label={title}
        >
          <source src={src} type="video/mp4" />
          Seu navegador não reproduz vídeos HTML5.{' '}
          <a href={src} download>
            Baixe o vídeo
          </a>{' '}
          para assistir.
        </video>
      </div>

      <div className="flex flex-col gap-3 text-center sm:text-left">
        <span className="inline-flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-wider justify-center sm:justify-start">
          {icon}
          {label}
        </span>
        <h3 className="text-2xl font-bold text-brand-text">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        <p className="text-xs text-gray-400">
          Vídeo real gravado durante o atendimento. Toque em reproduzir para assistir com som.
        </p>
      </div>
    </div>
  </Reveal>
);

const Videos = () => {
  return (
    <section id="videos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
            Experiência real
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-6">
            Cuidado que você pode conhecer de perto
          </h2>
          <p className="text-gray-600 text-lg">
            Dois momentos reais da rotina de atendimento, registrados na própria clínica.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VideoModule
            src="/assets/videos/care.mp4"
            poster="/assets/posters/care-poster.jpg"
            label="Atendimento"
            icon={<Stethoscope size={16} aria-hidden="true" />}
            title="Atendimento com calma e carinho"
            description="Lucy conduz o atendimento respeitando o tempo do animal, com contato tranquilo e seguro sobre a mesa de exames."
            delay={0}
          />
          <VideoModule
            src="/assets/videos/vaccine.mp4"
            poster="/assets/posters/vaccine-poster.jpg"
            label="Vacinação"
            icon={<Syringe size={16} aria-hidden="true" />}
            title="Aplicação de vacina passo a passo"
            description="A vacinação é feita com contenção delicada e apoio de outra pessoa, para que o pet fique confortável durante a aplicação."
            delay={120}
          />
        </div>
      </div>
    </section>
  );
};

export default Videos;
