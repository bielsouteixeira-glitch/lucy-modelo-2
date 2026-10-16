import React from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsappLinks } from '@/lib/whatsapp';
import Photo from '@/components/Photo';
import Reveal from '@/components/Reveal';

const About = () => {
  return (
    <section id="sobre" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <Reveal animation="left" className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto border-8 border-brand-primary-light">
              <Photo
                name="lucy-portrait"
                alt="Lucy Corrêa, responsável pelo atendimento da Lu Corrêa Animal Care"
                sizes="(max-width: 1024px) 90vw, 420px"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Decorative Background Element */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand-accent rounded-full blur-3xl opacity-30 -z-10" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-primary-light rounded-full blur-3xl opacity-30 -z-10" />
          </Reveal>

          <Reveal animation="right" delay={120} className="flex flex-col space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider w-fit">
              Quem somos
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight">
              Cuidado de verdade, com atenção a cada pet
            </h2>
            
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Na <strong>Lu Corrêa Animal Care</strong>, acreditamos que cada animal é único e merece um atendimento que combine competência técnica com carinho e paciência.
              </p>
              <p>
                Lucy Corrêa dedica sua trajetória profissional a proporcionar saúde e bem-estar para os pets, entendendo que eles são membros fundamentais de nossas famílias. Seu atendimento é pautado na escuta atenta, no respeito ao tempo de cada animal e na busca constante pela excelência.
              </p>
              <p>
                Seja em uma consulta veterinária complexa ou em um momento de cuidado na estética animal, o objetivo é sempre o mesmo: garantir que seu amigo se sinta seguro, confortável e amado.
              </p>
            </div>
            
            <div className="pt-6">
              <a 
                href={whatsappLinks.general} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand-primary text-white px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg hover:shadow-brand-primary/30 active:scale-95"
              >
                <MessageCircle size={22} />
                Conversar com a Lucy
              </a>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default About;
