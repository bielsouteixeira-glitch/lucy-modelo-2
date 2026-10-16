"use client";

import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { whatsappLinks } from '@/lib/whatsapp';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <footer className="bg-brand-bg border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="space-y-6">
            <a href="#inicio" aria-label="Lu Corrêa Animal Care — ir para o início">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo/lu-correa-animal-care-logo.png"
                alt="Lu Corrêa Animal Care"
                width={900}
                height={386}
                loading="lazy"
                className="h-16 w-auto object-contain"
              />
            </a>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Cuidado, atenção e carinho para quem faz parte da família. Atendimento veterinário e estética animal de excelência.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-brand-text uppercase text-xs tracking-widest">Navegação</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-500 hover:text-brand-primary transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-brand-text uppercase text-xs tracking-widest">Contato</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.instagram.com/lucorrea_animalcare" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-primary transition-colors text-sm">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={whatsappLinks.general} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-primary transition-colors text-sm">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-brand-text uppercase text-xs tracking-widest">Agende agora</h4>
            <a 
              href={whatsappLinks.general} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md w-fit"
            >
              <MessageCircle size={18} />
              Fale com a Lucy
            </a>
          </div>

        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © {currentYear} Lu Corrêa Animal Care. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span>Desenvolvido com carinho</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
