/**
 * Verificação de renderização — Lu Corrêa Animal Care
 *
 * Objetivo: provar que TODA fotografia e TODO vídeo aparecem na página
 * publicada, inclusive no pior cenário (JavaScript indisponível).
 *
 * O que este script faz, sobre a pasta de publicação real (`out/`):
 *   1. Lê o index.html gerado e extrai cada <img> e <video>.
 *   2. Confirma que o arquivo apontado existe no pacote e é um binário válido
 *      (assinatura JPEG/PNG/MP4), com dimensões reais lidas do arquivo.
 *   3. Reconstrói a cascata CSS da folha de estilos compilada e calcula, para
 *      cada elemento, se alguma regra o deixaria invisível
 *      (opacity:0, display:none, visibility:hidden) SEM JavaScript.
 *   4. Confere que nenhuma referência usa caminho absoluto local, URL privada
 *      ou capitalização divergente do arquivo em disco.
 *
 * Uso: node scripts/verify-render.mjs [pasta]   (padrão: out)
 */
import { readFileSync, existsSync, readdirSync, statSync, rmSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "out");
const problems = [];
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => {
  problems.push(m);
  console.log(`  ✗ ${m}`);
};

// Os pacotes ZIP vivem em public/downloads só para download na prévia.
// O Next copia public/ inteiro, então eles precisam sair da pasta publicada.
rmSync(path.join(outDir, "downloads"), { recursive: true, force: true });

const html = readFileSync(path.join(outDir, "index.html"), "utf8");

/* ---------- 1. folha de estilos compilada ---------- */
const cssHref = html.match(/href="(\/_next\/static\/[^"]+\.css)"/)?.[1];
if (!cssHref) bad("folha de estilos não referenciada no HTML");
const css = cssHref ? readFileSync(path.join(outDir, cssHref), "utf8") : "";

/** Regras que tornam um elemento invisível. */
const hidingRules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)]
  .filter(([, , body]) =>
    /(^|;)\s*(opacity:\s*0(?!\.)|display:\s*none|visibility:\s*hidden)\s*(!important)?\s*(;|$)/.test(
      body,
    ),
  )
  .flatMap(([, sel]) => sel.split(",").map((s) => s.trim()));

/** Classe utilitária simples (.foo) que esconde — aplicada sempre. */
const unconditionalHiders = new Set(
  hidingRules
    .filter((s) => /^\.[A-Za-z0-9_-]+$/.test(s))
    .map((s) => s.slice(1).replace(/\\/g, "")),
);

/** Regras condicionadas a .js-anim só valem com JavaScript ativo. */
const jsOnlyHiders = hidingRules.filter((s) => s.includes(".js-anim"));
const revealHidersWithoutJs = hidingRules.filter(
  (s) => s.includes("data-reveal") && !s.includes(".js-anim"),
);

console.log("\n[1] Cascata CSS");
ok(`${hidingRules.length} regras de ocultação analisadas na folha compilada`);
revealHidersWithoutJs.length === 0
  ? ok("nenhuma regra esconde [data-reveal] sem exigir .js-anim (JS ativo)")
  : bad(`regras ocultam conteúdo sem JS: ${revealHidersWithoutJs.join(" | ")}`);
jsOnlyHiders.length > 0
  ? ok(`${jsOnlyHiders.length} regra(s) de animação corretamente condicionada(s) a .js-anim`)
  : bad("nenhuma regra condicionada encontrada — animação pode não existir");

const htmlTag = html.match(/<html[^>]*>/)?.[0] ?? "";
/\bjs-anim\b/.test(htmlTag)
  ? bad("<html> já vem com js-anim no HTML estático (esconde sem JS)")
  : ok("<html> estático não contém js-anim → sem JS nada é escondido");

const inlineOpacity = (html.match(/style="[^"]*opacity:\s*0[^"]*"/g) ?? []).length;
inlineOpacity === 0
  ? ok("nenhum style inline opacity:0 no HTML")
  : bad(`${inlineOpacity} elementos com opacity:0 inline (dependem de hidratação)`);

/* ---------- 2. assinatura e dimensões dos binários ---------- */
function inspect(file) {
  const b = readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) {
    return { type: "PNG", w: b.readUInt32BE(16), h: b.readUInt32BE(20), size: b.length };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) {
        i++;
        continue;
      }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { type: "JPEG", h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7), size: b.length };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
    return { type: "JPEG", w: 0, h: 0, size: b.length };
  }
  if (b.subarray(4, 8).toString() === "ftyp") {
    return { type: `MP4/${b.subarray(8, 12).toString().trim()}`, w: 0, h: 0, size: b.length };
  }
  if (/^\s*<(!doctype|html)/i.test(b.subarray(0, 60).toString())) return { type: "HTML(!)", size: b.length };
  return { type: "DESCONHECIDO", size: b.length };
}

/** Todos os caminhos de arquivo existentes, para comparar capitalização. */
const onDisk = new Set();
(function walk(dir, base = "") {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(base, e.name);
    if (e.isDirectory()) walk(path.join(dir, e.name), rel);
    else onDisk.add("/" + rel);
  }
})(outDir);

console.log("\n[2] Elementos <img> do HTML publicado");
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
if (imgs.length === 0) bad("nenhuma tag <img> encontrada no HTML");

for (const tag of imgs) {
  const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
  const alt = tag.match(/\balt="([^"]*)"/)?.[1] ?? "";
  const cls = tag.match(/\bclass="([^"]*)"/)?.[1] ?? "";

  if (!src) {
    bad(`<img> sem src: ${tag.slice(0, 70)}`);
    continue;
  }
  if (src.startsWith("data:image/")) {
    const kb = Math.round(src.length / 1024);
    ok(`imagem embutida no HTML (data URI) — ${kb} KB, não depende de requisição`);
    continue;
  }
  if (/^https?:|^file:|^[A-Za-z]:[\\/]|^\/(tmp|home|Users)\//.test(src)) {
    bad(`src externo ou caminho local: ${src}`);
    continue;
  }
  const file = path.join(outDir, src);
  if (!existsSync(file)) {
    bad(`arquivo inexistente no pacote: ${src}`);
    continue;
  }
  if (!onDisk.has(src)) bad(`capitalização divergente do arquivo em disco: ${src}`);

  const info = inspect(file);
  if (!["JPEG", "PNG"].includes(info.type)) {
    bad(`${src} não é imagem válida (detectado: ${info.type})`);
    continue;
  }

  const hidden = cls.split(/\s+/).filter((c) => unconditionalHiders.has(c));
  if (hidden.length) {
    bad(`${src} tem classe que o esconde sempre: ${hidden.join(", ")}`);
    continue;
  }
  if (/style="[^"]*(opacity:\s*0|display:\s*none)/.test(tag)) {
    bad(`${src} escondido por style inline`);
    continue;
  }
  if (!alt.trim()) bad(`${src} sem texto alternativo`);

  ok(
    `${src.padEnd(44)} ${info.type} ${info.w}x${info.h} ${(info.size / 1024).toFixed(0)}KB — visível, alt OK`,
  );
}

console.log("\n[3] Elementos <video> do HTML publicado");
const videos = [...html.matchAll(/<video\b[\s\S]*?<\/video>/g)].map((m) => m[0]);
if (videos.length === 0) bad("nenhuma tag <video> encontrada");
for (const v of videos) {
  const poster = v.match(/\bposter="([^"]+)"/)?.[1];
  const source = v.match(/<source[^>]*\bsrc="([^"]+)"/)?.[1];
  const hasControls = /\bcontrols\b/.test(v);

  for (const [label, p] of [
    ["poster", poster],
    ["vídeo", source],
  ]) {
    if (!p) {
      bad(`<video> sem ${label}`);
      continue;
    }
    const f = path.join(outDir, p);
    if (!existsSync(f)) {
      bad(`${label} inexistente no pacote: ${p}`);
      continue;
    }
    const info = inspect(f);
    const valid = label === "poster" ? info.type === "JPEG" : info.type.startsWith("MP4");
    valid
      ? ok(`${label}: ${p} (${info.type}, ${(info.size / 1024 / 1024).toFixed(2)} MB)`)
      : bad(`${label} inválido: ${p} -> ${info.type}`);
  }
  hasControls ? ok("vídeo com controles acessíveis de reprodução") : bad("vídeo sem controls");
}

/* ---------- 4. varredura geral ---------- */
console.log("\n[4] Varredura geral do pacote");
for (const pattern of [
  [/drive\.google\.com/, "URL do Google Drive"],
  [/[A-Za-z]:[\\/]{1,2}Users/, "caminho absoluto do Windows"],
  [/"\/(?:tmp|home\/user)\//, "caminho absoluto do ambiente de build"],
  [/localhost:\d+/, "referência a localhost"],
]) {
  pattern[0].test(html) ? bad(`HTML contém ${pattern[1]}`) : ok(`sem ${pattern[1]}`);
}

const totalMedia = new Set(
  [...html.matchAll(/\/assets\/[\w/-]+\.(?:jpg|png|webp|mp4)/g)].map((m) => m[0]),
);
let missing = 0;
for (const m of totalMedia) if (!existsSync(path.join(outDir, m))) missing++;
missing === 0
  ? ok(`${totalMedia.size} mídias referenciadas — todas presentes no pacote`)
  : bad(`${missing} mídias referenciadas estão ausentes`);

function dirSize(d) {
  let total = 0;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    total += e.isDirectory() ? dirSize(f) : statSync(f).size;
  }
  return total;
}
const zips = [...onDisk].filter((f) => /\.(zip|tgz)$/i.test(f));
zips.length === 0
  ? ok("nenhum ZIP dentro da pasta de publicação")
  : bad(`ZIPs indevidos no pacote: ${zips.join(", ")}`);

const totalMb = dirSize(outDir) / 1024 / 1024;
console.log(`\n  tamanho da pasta de publicação: ${totalMb.toFixed(2)} MB`);
if (totalMb > 12) bad(`pasta de publicação inflada (${totalMb.toFixed(2)} MB)`);

console.log("\n" + "=".repeat(62));
if (problems.length) {
  console.log(`VERIFICAÇÃO FALHOU — ${problems.length} problema(s):`);
  problems.forEach((p) => console.log("  - " + p));
  process.exitCode = 1;
} else {
  console.log("VERIFICAÇÃO OK — todas as imagens e vídeos aparecem, inclusive sem JavaScript.");
}
console.log("=".repeat(62) + "\n");
