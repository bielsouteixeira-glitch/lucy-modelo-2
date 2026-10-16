import React from 'react';
import {
  Stethoscope,
  Syringe,
  ClipboardList,
  Microscope,
  HeartPulse,
  Scissors,
  Bath,
  Sparkles,
  Dog,
  ArrowRight,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { whatsappLinks, createWhatsappLink } from '@/lib/whatsapp';
import Reveal from '@/components/Reveal';

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  msg: string;
};

const ServiceCard = ({ icon: Icon, title, description, whatsappMessage, index }: {
  icon: LucideIcon;
  title: string;
  description: string;
  whatsappMessage: string;
  index: number;
}) => (
  <Reveal delay={(index % 3) * 90} className="card-lift p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl group flex flex-col">
    <div className="bg-brand-primary-light w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-primary transition-colors">
      <Icon size={24} aria-hidden="true" className="text-brand-primary group-hover:text-white transition-colors" />
    </div>
    <h4 className="text-lg font-bold text-brand-text mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-5 leading-relaxed flex-1">{description}</p>
    <a
      href={createWhatsappLink(whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-primary text-sm font-bold inline-flex items-center gap-1.5 hover:underline w-fit"
    >
      Consultar no WhatsApp
      <CheckCircle2 size={14} aria-hidden="true" />
    </a>
  </Reveal>
);

const Services = () => {
  const vetServices: Service[] = [
    {
      icon: Stethoscope,
      title: "Consultas",
      description: "Avaliação da saúde do seu pet, com orientação sobre prevenção e acompanhamento.",
      msg: "Olá Lucy, gostaria de agendar uma consulta veterinária.",
    },
    {
      icon: Syringe,
      title: "Vacinas",
      description: "Aplicação e orientação sobre o calendário de vacinação adequado ao seu animal.",
      msg: "Olá Lucy, gostaria de saber mais sobre as vacinas para o meu pet.",
    },
    {
      icon: ClipboardList,
      title: "Procedimentos",
      description: "Procedimentos clínicos realizados com cuidado e atenção ao conforto do pet.",
      msg: "Olá Lucy, gostaria de informações sobre procedimentos veterinários.",
    },
    {
      icon: Microscope,
      title: "Exames",
      description: "Solicitação e acompanhamento de exames para apoiar o diagnóstico.",
      msg: "Olá Lucy, gostaria de informações sobre exames para o meu pet.",
    },
    {
      icon: HeartPulse,
      title: "Especialidades",
      description: "Atendimento e encaminhamento para casos que pedem cuidado especializado.",
      msg: "Olá Lucy, gostaria de consultar sobre atendimento em especialidades.",
    },
    {
      icon: Scissors,
      title: "Cirurgias",
      description: "Avaliação cirúrgica e orientação sobre o pré e o pós-operatório.",
      msg: "Olá Lucy, gostaria de conversar sobre uma cirurgia para o meu pet.",
    },
  ];

  const groomingServices: Service[] = [
    {
      icon: Bath,
      title: "Banho",
      description: "Banho completo pensado no conforto, na limpeza e no bem-estar do animal.",
      msg: "Olá Lucy, gostaria de agendar um banho para o meu pet.",
    },
    {
      icon: Sparkles,
      title: "Higiene",
      description: "Cuidados de higiene para manter o pet confortável no dia a dia.",
      msg: "Olá Lucy, gostaria de agendar serviços de higiene para o meu pet.",
    },
    {
      icon: Scissors,
      title: "Tosa na máquina",
      description: "Corte uniforme feito com máquina, prático para a rotina do seu pet.",
      msg: "Olá Lucy, gostaria de agendar uma tosa na máquina.",
    },
    {
      icon: Sparkles,
      title: "Tosa higiênica",
      description: "Aparo dos pelos nas regiões que pedem mais higiene e cuidado.",
      msg: "Olá Lucy, gostaria de agendar uma tosa higiênica.",
    },
    {
      icon: Scissors,
      title: "Tosa na tesoura",
      description: "Acabamento feito à mão, com atenção ao formato e ao tipo de pelagem.",
      msg: "Olá Lucy, gostaria de agendar uma tosa na tesoura.",
    },
    {
      icon: Dog,
      title: "Tosa da raça",
      description: "Corte orientado pelo padrão da raça, conversado antes com o tutor.",
      msg: "Olá Lucy, gostaria de agendar a tosa da raça para o meu pet.",
    },
  ];

  return (
    <section id="servicos" className="py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal className="inline-block px-4 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
            Nossos serviços
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-6">
              Cuidado completo para o seu pet
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="text-gray-600 text-lg">
              A clínica veterinária e a estética animal caminham juntas aqui. Cada serviço é conversado antes com o tutor, de acordo com a necessidade do animal.
            </p>
          </Reveal>
        </div>

        <div className="space-y-20">
          {/* Clínica Veterinária */}
          <div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="hidden sm:block h-px flex-1 bg-gray-200" />
              <h3 className="text-2xl font-bold text-brand-text flex items-center gap-2 text-center">
                <Stethoscope className="text-brand-primary" aria-hidden="true" />
                Clínica Veterinária
              </h3>
              <div className="hidden sm:block h-px flex-1 bg-gray-200" />
            </div>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              Atendimento veterinário voltado à saúde, prevenção e acompanhamento do seu pet.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vetServices.map((s, i) => (
                <ServiceCard key={s.title} icon={s.icon} title={s.title} description={s.description} whatsappMessage={s.msg} index={i} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <a 
                href={whatsappLinks.consultation} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline"
              >
                Consultar atendimento veterinário
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Estética Animal */}
          <div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="hidden sm:block h-px flex-1 bg-gray-200" />
              <h3 className="text-2xl font-bold text-brand-text flex items-center gap-2 text-center">
                <Bath className="text-brand-primary" aria-hidden="true" />
                Estética Animal
              </h3>
              <div className="hidden sm:block h-px flex-1 bg-gray-200" />
            </div>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              Cuidados de higiene e estética para ajudar seu pet a ficar confortável e bem cuidado.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groomingServices.map((s, i) => (
                <ServiceCard key={s.title} icon={s.icon} title={s.title} description={s.description} whatsappMessage={s.msg} index={i} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <a 
                href={whatsappLinks.grooming} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline"
              >
                Consultar banho e tosa
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-16 text-center text-sm text-gray-500 max-w-3xl mx-auto">
          A indicação de cada procedimento depende da avaliação individual do animal. Valores, duração e disponibilidade são informados pela Lucy no WhatsApp.
        </p>
      </div>
    </section>
  );
};

export default Services;
