import React from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsappLinks } from '@/lib/whatsapp';

/**
 * Botão flutuante do WhatsApp.
 * Entrada feita por animação CSS (`.float-in`): o link continua visível e
 * clicável mesmo que o JavaScript não execute.
 */
const WhatsAppButton = () => {
  return (
    <a
      href={whatsappLinks.general}
      target="_blank"
      rel="noopener noreferrer"
      className="float-in group fixed bottom-5 right-5 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1ebe57] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
      aria-label="Conversar pelo WhatsApp com a Lu Corrêa Animal Care"
    >
      <MessageCircle size={28} aria-hidden="true" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-semibold text-brand-text shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block">
        Fale com a Lucy
      </span>
    </a>
  );
};

export default WhatsAppButton;
