/**
 * Processamento de assets - Lu Corrêa Animal Care
 *
 * Estratégia de máxima robustez em produção:
 *  - Cada fotografia é servida por UM ÚNICO arquivo JPEG (formato universal).
 *    Nada de <picture>/<source>, negociação de formato ou fallback por JS:
 *    menos arquivos, menos requisições, menos modos de falha.
 *  - Os arquivos originais ficam preservados em public/assets/images/original/.
 *  - Logotipo: o arquivo do Drive era JPEG com extensão .png e 58% de moldura
 *    branca; aqui ele é recortado e recebe fundo transparente.
 *  - Pôsteres de vídeo são frames reais extraídos dos próprios vídeos.
 *
 * Execução: node scripts/process-assets.mjs
 */
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  existsSync,
  renameSync,
  copyFileSync,
  statSync,
  rmSync,
  readdirSync,
} from "node:fs";
import path from "node:path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const root = process.cwd();
const P = (...p) => path.join(root, ...p);
const kb = (f) => `${(statSync(f).size / 1024).toFixed(0)} KB`;
const log = (...a) => console.log("•", ...a);

for (const dir of [
  "public/assets/logo",
  "public/assets/images",
  "public/assets/images/original",
  "public/assets/videos",
  "public/assets/posters",
]) {
  mkdirSync(P(dir), { recursive: true });
}

/* ------------------------------------------------------------------ */
/* 1. LOGOTIPO                                                         */
/* ------------------------------------------------------------------ */
const legacyLogo = P("public/assets/logo/logo.png");
const originalLogo = P("public/assets/logo/logo-original.jpg");
if (existsSync(legacyLogo) && !existsSync(originalLogo)) {
  renameSync(legacyLogo, originalLogo);
  log("logo original renomeado para logo-original.jpg (era JPEG com extensão .png)");
}
rmSync(P("public/assets/logo/logo-original-backup.jpg"), { force: true });

const { data, info } = await sharp(originalLogo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const px = Buffer.from(data);
for (let i = 0; i < px.length; i += info.channels) {
  const r = px[i];
  const g = px[i + 1];
  const b = px[i + 2];
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const alpha = sat > 28 ? 255 : Math.round(((245 - lum) * 255) / 200);
  px[i + 3] = Math.max(0, Math.min(255, alpha));
}
const transparentPng = await sharp(px, {
  raw: { width: info.width, height: info.height, channels: info.channels },
})
  .png()
  .toBuffer();

const fullLogo = P("public/assets/logo/lu-correa-animal-care-logo.png");
const trimmed = await sharp(transparentPng).trim({ threshold: 6 }).png().toBuffer({ resolveWithObject: true });
await sharp(trimmed.data)
  .resize({ width: 900, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
  .toFile(fullLogo);
log(`logo recortado ${trimmed.info.width}x${trimmed.info.height} -> ${kb(fullLogo)}`);

const emblemCrop = await sharp(transparentPng)
  .extract({ left: 10, top: 290, width: 660, height: 470 })
  .png()
  .toBuffer();
const emblemBuf = await sharp(emblemCrop).trim({ threshold: 6 }).png().toBuffer();

for (const [file, size] of [
  ["public/icon.png", 512],
  ["public/apple-icon.png", 180],
  ["public/favicon-32.png", 32],
]) {
  await sharp(emblemBuf)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(P(file));
  log(`ícone ${file} (${size}px) -> ${kb(P(file))}`);
}

/* ------------------------------------------------------------------ */
/* 2. FOTOGRAFIAS: original preservado + JPEG único otimizado           */
/* ------------------------------------------------------------------ */
const photos = ["lucy-portrait", "lucy-dog1", "lucy-dog2", "additional"];
for (const name of photos) {
  const served = P(`public/assets/images/${name}.jpg`);
  const original = P(`public/assets/images/original/${name}.jpg`);

  // Preserva o original uma única vez (antes de qualquer reprocessamento).
  if (!existsSync(original)) {
    if (!existsSync(served)) {
      console.warn(`!! fotografia ausente: ${served}`);
      continue;
    }
    copyFileSync(served, original);
  }

  const before = statSync(original).size;
  const buf = await sharp(original)
    .rotate() // respeita a orientação EXIF
    .resize({ width: 1280, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toBuffer();
  await sharp(buf).toFile(served);
  log(`foto ${name}: ${(before / 1024).toFixed(0)} KB -> ${kb(served)} (arquivo único JPEG)`);
}

// Remove as versões WebP: o site passou a servir um único JPEG por foto.
rmSync(P("public/assets/images/optimized"), { recursive: true, force: true });
for (const f of readdirSync(P("public/assets/posters"))) {
  if (f.endsWith(".webp")) rmSync(P("public/assets/posters", f), { force: true });
}
log("versões WebP removidas (arquitetura de arquivo único)");

/* ------------------------------------------------------------------ */
/* 3. PÔSTERES REAIS DOS VÍDEOS                                        */
/* ------------------------------------------------------------------ */
const videos = [
  { file: "care.mp4", poster: "care-poster", at: "00:00:01.5" },
  { file: "vaccine.mp4", poster: "vaccine-poster", at: "00:00:01.0" },
];

for (const v of videos) {
  const src = P(`public/assets/videos/${v.file}`);
  if (!existsSync(src)) {
    console.warn(`!! vídeo ausente: ${src}`);
    continue;
  }
  const jpg = P(`public/assets/posters/${v.poster}.jpg`);
  execFileSync(
    ffmpegPath,
    ["-y", "-ss", v.at, "-i", src, "-frames:v", "1", "-q:v", "4", "-vf", "scale=720:-2", jpg],
    { stdio: "pipe" },
  );
  log(`poster extraído de ${v.file} -> ${kb(jpg)}`);

  // Decodifica o vídeo inteiro para confirmar que o arquivo é íntegro.
  execFileSync(ffmpegPath, ["-hide_banner", "-v", "error", "-i", src, "-f", "null", "-"], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  log(`vídeo ${v.file} decodificado integralmente sem erros (${kb(src)})`);
}

/* ------------------------------------------------------------------ */
/* 4. OPEN GRAPH                                                       */
/* ------------------------------------------------------------------ */
const ogSource = P("public/assets/images/original/lucy-dog1.jpg");
if (existsSync(ogSource)) {
  const og = P("public/assets/images/og-image.jpg");
  await sharp(ogSource).resize(1200, 630, { fit: "cover", position: "top" }).jpeg({ quality: 82 }).toFile(og);
  log(`open graph image -> ${kb(og)}`);
}

console.log("\n✓ Processamento de assets concluído.");

/* ------------------------------------------------------------------ */
/* 5. ALIASES DE COMPATIBILIDADE                                       */
/* ------------------------------------------------------------------ */
/**
 * Versões anteriores do site (e o manifesto original de assets) usavam outros
 * nomes de arquivo para as MESMAS fotografias. Se um HTML antigo continuar
 * publicado, ou se o deploy for parcial, essas referências retornariam 404 e
 * a foto não apareceria.
 *
 * Aqui criamos cópias reais das fotografias originais sob os nomes
 * alternativos conhecidos. Não são imagens genéricas nem arquivos vazios:
 * é exatamente a mesma fotografia, disponível em mais de um caminho.
 */
const aliases = [
  ["public/assets/images/lucy-dog1.jpg", "public/assets/images/lucy-with-dog-01.jpg"],
  ["public/assets/images/lucy-dog2.jpg", "public/assets/images/lucy-with-dog-02.jpg"],
  ["public/assets/images/lucy-portrait.jpg", "public/assets/images/lucy-correa.jpg"],
  ["public/assets/images/additional.jpg", "public/assets/images/additional-photo.jpg"],
  ["public/assets/logo/lu-correa-animal-care-logo.png", "public/assets/logo/logo.png"],
];
for (const [from, to] of aliases) {
  if (existsSync(P(from))) {
    copyFileSync(P(from), P(to));
    log(`alias de compatibilidade: ${path.basename(to)} -> ${path.basename(from)}`);
  } else {
    console.warn(`!! origem do alias ausente: ${from}`);
  }
}

// WebP: referenciado por uma versão anterior do HTML. Mantido só como alias.
mkdirSync(P("public/assets/images/optimized"), { recursive: true });
for (const name of photos) {
  const src = P(`public/assets/images/${name}.jpg`);
  if (!existsSync(src)) continue;
  const out = P(`public/assets/images/optimized/${name}.webp`);
  await sharp(src).webp({ quality: 80 }).toFile(out);
  log(`alias webp: optimized/${name}.webp -> ${kb(out)}`);
}

console.log("\n✓ Aliases de compatibilidade criados.");
