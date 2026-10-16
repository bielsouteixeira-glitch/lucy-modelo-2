import React from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Direção da entrada. O conteúdo é sempre visível por padrão. */
  animation?: "up" | "left" | "right" | "zoom";
  /** Atraso em milissegundos, para escalonar a entrada de listas. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
};

/**
 * Wrapper de revelação ao rolar.
 *
 * IMPORTANTE: este componente NÃO é um client component e não usa JavaScript
 * para exibir o conteúdo. Ele apenas marca o elemento com `data-reveal`.
 * O HTML gerado no build já sai com o conteúdo VISÍVEL (sem `opacity: 0`
 * inline). A animação é progressiva: só acontece se o script de realce
 * conseguir rodar. Se o JavaScript falhar, não carregar ou for bloqueado,
 * as fotos, vídeos e cards continuam aparecendo normalmente.
 */
export default function Reveal({
  children,
  animation = "up",
  delay = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  return (
    <Tag
      data-reveal={animation}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
