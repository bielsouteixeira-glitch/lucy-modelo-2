import React from "react";

export type PhotoName = "lucy-portrait" | "lucy-dog1" | "lucy-dog2" | "additional";

/**
 * Dimensões reais dos arquivos servidos (largura máxima 1280px).
 * Declaradas para reservar o espaço e evitar deslocamento de layout.
 */
export const photoSizes: Record<PhotoName, { width: number; height: number }> = {
  "lucy-portrait": { width: 1280, height: 1707 },
  "lucy-dog1": { width: 1280, height: 1707 },
  "lucy-dog2": { width: 1280, height: 1600 },
  additional: { width: 1280, height: 1706 },
};

type PhotoProps = {
  name: PhotoName;
  alt: string;
  className?: string;
  /** Imagem da primeira dobra: carrega com prioridade e sem lazy loading. */
  priority?: boolean;
  sizes?: string;
};

/**
 * Fotografia real do acervo da clínica.
 *
 * Usa uma única tag <img> apontando para um único arquivo JPEG.
 * Decisão deliberada de robustez: sem <picture>, sem <source>, sem negociação
 * de formato e sem fallback por JavaScript. JPEG é suportado por todos os
 * navegadores, então a foto aparece mesmo sem JS, sem WebP e sem hidratação.
 */
export default function Photo({ name, alt, className, priority = false, sizes }: PhotoProps) {
  const { width, height } = photoSizes[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/images/${name}.jpg`}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={className}
    />
  );
}
