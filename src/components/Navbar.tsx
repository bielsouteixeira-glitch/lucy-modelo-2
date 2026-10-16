"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { whatsappLinks } from '@/lib/whatsapp';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-2 shadow-sm' : 'bg-transparent py-4'}`}>
      <nav aria-label="Navegação principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-shrink-0 flex items-center">
            <a href="#inicio" aria-label="Lu Corrêa Animal Care — ir para o início">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo/lu-correa-animal-care-logo.png"
                alt="Lu Corrêa Animal Care"
                width={900}
                height={386}
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-brand-text hover:text-brand-primary transition-colors font-medium text-sm uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <a 
              href={whatsappLinks.general} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-primary text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Agendar
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-text p-2"
              aria-expanded={isOpen}
              aria-controls="menu-mobile"
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            id="menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-brand-text hover:bg-brand-primary-light hover:text-brand-primary rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href={whatsappLinks.general} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-brand-primary text-white px-3 py-4 rounded-lg font-semibold mt-4"
              >
                Conversar pelo WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
