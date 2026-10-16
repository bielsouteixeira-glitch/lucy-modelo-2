/**
 * Incorpora as fotografias DIRETAMENTE no HTML final (data URI).
 *
 * Por que isto existe
 * -------------------
 * Em várias rodadas o pacote estava correto (arquivos presentes, caminhos
 * corretos, ZIP conferido byte a byte) e ainda assim as fotos não apareciam
 * no site publicado. A única explicação possível é que a pasta de assets não
 * chega ao navegador no deploy final.
 *
 * A solução definitiva: embutir os pixels da fotografia dentro do próprio
 * HTML. Assim a imagem NÃO depende de nenhuma requisição adicional — não pode
 * dar 404, não pode ser bloqueada, não depende de pasta, de permissão nem de
 * configuração do servidor.
 *
 * O que é incorporado: fotografias, logotipo e pôsteres dos vídeos.
 * O que continua externo: os vídeos MP4 (grandes demais para embutir).
 *
 * Uso: node scripts/inline-images.mjs [pasta]   (padrão: out)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "out");
const htmlPath = path.join(outDir, "index.html");
let html = readFileSync(htmlPath, "utf8");
const before = html.length;

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Só src= e poster= de tags <img>/<video>. Não mexe em favicon nem em Open Graph. */
const refs = [...new Set([...html.matchAll(/(?:src|poster)="(\/[^"]+\.(?:jpg|jpeg|png|webp))"/g)].map((m) => m[1]))];

let inlined = 0;
let occurrences = 0;
let missing = 0;

for (const ref of refs) {
  const file = path.join(outDir, ref);
  if (!existsSync(file)) {
    missing++;
    console.warn(`  ! não encontrado para embutir: ${ref}`);
    continue;
  }
  const buf = readFileSync(file);
  const mime = MIME[path.extname(ref).toLowerCase()];
  if (!mime) continue;
  const uri = `data:${mime};base64,${buf.toString("base64")}`;

  let count = 0;
  html = html.replace(new RegExp(`"${ref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"), () => {
    count++;
    return `"${uri}"`;
  });
  if (count > 0) {
    inlined++;
    occurrences += count;
    console.log(`  ✓ ${ref.padEnd(44)} embutido em ${count} lugar(es) · ${(buf.length / 1024).toFixed(0)} KB`);
  }
}

writeFileSync(htmlPath, html);

console.log(
  `\n  ${inlined} arquivos embutidos, ${occurrences} tags, HTML ${(before / 1024).toFixed(0)} KB -> ${(html.length / 1024).toFixed(0)} KB`,
);
if (missing > 0) console.warn(`  atenção: ${missing} referência(s) não encontrada(s).`);
console.log(
  /data:image\/(jpeg|png|webp);base64,/.test(html)
    ? "  ✓ HTML agora contém imagens embutidas — não dependem de requisição externa."
    : "  ✗ nenhuma imagem foi embutida.",
);
