"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Expand } from 'lucide-react';
import Photo, { type PhotoName } from '@/components/Photo';
import Reveal from '@/components/Reveal';

type GalleryItem = {
  name: PhotoName;
  alt: string;
  span: string;
};

const images: GalleryItem[] = [
  {
    name: 'lucy-dog1',
    alt: 'Lucy Corrêa segurando um cachorro de pelo claro durante o atendimento',
    span: 'col-span-2 row-span-2',
  },
  {
    name: 'lucy-dog2',
    alt: 'Lucy Corrêa ao lado de um cachorro atendido na clínica',
    span: 'col-span-1 row-span-2',
  },
  {
    name: 'additional',
    alt: 'Registro do cuidado com um pet na Lu Corrêa Animal Care',
    span: 'col-span-1 row-span-2',
  },
  {
    name: 'lucy-portrait',
    alt: 'Retrato da profissional Lucy Corrêa',
    span: 'col-span-2 row-span-2',
  },
];

const Gallery = () => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected, close]);

  return (
    <section id="galeria" className="py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
            Nossa galeria
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-6">
            Um pouco do nosso cuidado na prática
          </h2>
          <p className="text-gray-600 text-lg">
            Momentos reais de carinho e dedicação registrados no dia a dia do atendimento.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[140px] sm:auto-rows-[180px]">
          {images.map((img, index) => (
            <Reveal key={img.name} animation="zoom" delay={index * 90} className={img.span}>
              <button
                type="button"
                onClick={() => setSelected(img)}
                aria-label={`Ampliar imagem: ${img.alt}`}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-md w-full h-full block"
              >
              <Photo
                name={img.name}
                alt={img.alt}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-brand-primary/25 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-sm bg-brand-primary/90 px-4 py-2 rounded-full inline-flex items-center gap-2">
                  <Expand size={16} aria-hidden="true" />
                  Ver foto
                </span>
              </span>
              </button>
            </Reveal>
          ))}

          {/* Bloco editorial: convite para acompanhar o trabalho no Instagram */}
          <Reveal animation="zoom" delay={330} className="col-span-2 row-span-2">
            <a
              href="https://www.instagram.com/lucorrea_animalcare"
              target="_blank"
              rel="noopener noreferrer"
              className="h-full w-full rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center gap-3 p-6 group"
            >
            <span className="bg-brand-primary-light text-brand-primary p-3 rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </span>
            <span className="text-lg font-bold text-brand-text">Acompanhe no Instagram</span>
            <span className="text-sm text-gray-500 max-w-[22rem]">
              Novos registros do atendimento são publicados em @lucorrea_animalcare.
            </span>
              <span className="text-brand-primary text-sm font-bold group-hover:underline">Ver o perfil</span>
            </a>
          </Reveal>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.alt}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={close}
          >
            <button
              type="button"
              className="absolute top-5 right-5 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={close}
              aria-label="Fechar visualização ampliada"
            >
              <X size={32} aria-hidden="true" />
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-h-full"
              onClick={(event) => event.stopPropagation()}
            >
              <Photo
                name={selected.name}
                alt={selected.alt}
                priority
                className="max-h-[85vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
