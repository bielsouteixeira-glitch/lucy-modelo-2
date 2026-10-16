/**
 * Empacotamento para publicação — Lu Corrêa Animal Care
 *
 * 1. Executa o build estático real (`STATIC_EXPORT=1 next build`) gerando `out/`
 * 2. Valida a saída (index.html, assets, vídeos, logotipo, caminhos)
 * 3. Gera dois ZIPs em `public/downloads/`:
 *      - lu-correa-animal-care-netlify.zip  (arquivos compilados, upload direto)
 *      - lu-correa-animal-care-source.zip   (código-fonte para manutenção)
 *
 * Execução: node scripts/package.mjs
 */
import { execFileSync } from "node:child_process";
import {
  rmSync,
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  statSync,
  readdirSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const P = (...p) => path.join(root, ...p);
const outDir = P("out");
const downloads = P("public", "downloads");
const tmp = "/tmp/lu-correa-pkg";

const sh = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", cwd: root, ...opts });
const mb = (f) => `${(statSync(f).size / 1024 / 1024).toFixed(2)} MB`;

const problems = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  problems.push(msg);
  console.log(`  ✗ ${msg}`);
};

/* 1. BUILD ESTÁTICO ------------------------------------------------- */
console.log("\n[1/5] Build estático de produção (STATIC_EXPORT=1 next build)\n");
rmSync(outDir, { recursive: true, force: true });
rmSync(downloads, { recursive: true, force: true });
sh("npx", ["next", "build"], { env: { ...process.env, STATIC_EXPORT: "1" } });

/* 1b. IMAGENS EMBUTIDAS NO HTML ------------------------------------- */
console.log("\n[1b/6] Embutindo fotografias no HTML (garantia contra 404 de assets)\n");
execFileSync(process.execPath, [path.join(root, "scripts", "inline-images.mjs"), outDir], {
  stdio: "inherit",
  cwd: root,
});

/* 2. VALIDAÇÃO DA PASTA DE PUBLICAÇÃO -------------------------------- */
console.log("\n[2/6] Validação da pasta de publicação\n");

// Os pacotes ficam em public/downloads apenas para download na prévia.
// Eles NUNCA podem entrar na pasta publicada (inflariam o deploy a cada build).
rmSync(path.join(outDir, "downloads"), { recursive: true, force: true });

if (!existsSync(outDir)) {
  throw new Error("A pasta out/ não foi gerada pelo build estático.");
}

const indexPath = path.join(outDir, "index.html");
existsSync(indexPath) ? ok("index.html na raiz de out/") : fail("index.html ausente em out/");

const html = readFileSync(indexPath, "utf8");

// Todas as referências a arquivos locais precisam existir dentro de out/
const refs = new Set();
for (const m of html.matchAll(/(?:src|href|srcSet|srcset|poster|content)="(\/[^"]+)"/g)) {
  const url = m[1].split("?")[0].split("#")[0];
  if (/\.(png|jpe?g|webp|avif|svg|mp4|webm|css|js|ico|woff2?)$/i.test(url)) refs.add(url);
}
// Referências dentro dos chunks JS (vídeos e pôsteres são carregados pelos componentes)
for (const file of readdirSync(path.join(outDir, "_next", "static", "chunks"), {
  recursive: true,
  withFileTypes: true,
})) {
  if (!file.isFile() || !file.name.endsWith(".js")) continue;
  const js = readFileSync(path.join(file.parentPath ?? file.path, file.name), "utf8");
  for (const m of js.matchAll(/"(\/assets\/[^"]+\.(?:png|jpe?g|webp|mp4))"/g)) refs.add(m[1]);
}

let missing = 0;
for (const ref of [...refs].sort()) {
  if (!existsSync(path.join(outDir, ref))) {
    fail(`asset referenciado e ausente no pacote: ${ref}`);
    missing++;
  }
}
if (missing === 0) ok(`${refs.size} referências de assets verificadas — nenhuma quebrada`);

// Arquivos essenciais
const essentials = [
  "assets/logo/lu-correa-animal-care-logo.png",
  "assets/images/lucy-portrait.jpg",
  "assets/images/lucy-dog1.jpg",
  "assets/images/lucy-dog2.jpg",
  "assets/images/additional.jpg",
  "assets/images/original/lucy-dog1.jpg",
  "assets/images/og-image.jpg",
  "assets/images/lucy-with-dog-01.jpg",
  "assets/images/lucy-with-dog-02.jpg",
  "assets/logo/logo.png",
  "assets/logo/logo-original.jpg",
  "diagnostico.html",
  "_headers",
  "_redirects",
  "assets/videos/care.mp4",
  "assets/videos/vaccine.mp4",
  "assets/posters/care-poster.jpg",
  "assets/posters/vaccine-poster.jpg",
  "icon.png",
  "apple-icon.png",
  "favicon-32.png",
  "404.html",
  "api/health",
];
for (const file of essentials) {
  existsSync(path.join(outDir, file)) ? ok(`presente: ${file}`) : fail(`ausente: ${file}`);
}

// Conteúdo crítico renderizado no HTML
const contentChecks = [
  ["telefone/WhatsApp", "5511911879750"],
  ["Instagram oficial", "instagram.com/lucorrea_animalcare"],
  ["título SEO", "Lu Corrêa Animal Care"],
  ["dados estruturados", "VeterinaryCare"],
  ["idioma pt-BR", 'lang="pt-BR"'],
  ["horário de sábado", "09:00 às 15:00"],
  ["domingo fechado", "Fechado"],
];
for (const [label, needle] of contentChecks) {
  html.includes(needle) ? ok(`${label} presente no HTML`) : fail(`${label} ausente no HTML`);
}

if (html.includes("drive.google.com")) fail("HTML ainda referencia o Google Drive");
else ok("nenhuma dependência de URL do Google Drive");

/* --- Resiliência sem JavaScript (causa da falha de fotos no Netlify) ----- */
const inlineHidden = (html.match(/opacity:0/g) ?? []).length;
inlineHidden === 0
  ? ok("nenhum style inline opacity:0 — fotos não dependem de hidratação")
  : fail(`${inlineHidden} elementos com opacity:0 inline — fotos somem se o JS falhar`);

const cssHref = html.match(/href="(\/_next\/static\/[^"]+\.css)"/)?.[1];
if (!cssHref) {
  fail("folha de estilos não encontrada no HTML");
} else {
  const css = readFileSync(path.join(outDir, cssHref), "utf8");
  const ungated = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(
    (m) =>
      /(^|;)\s*opacity:\s*0\s*(;|!important)?\s*(;|$)/.test(m[2]) &&
      m[1].includes("data-reveal") &&
      !m[1].includes(".js-anim"),
  );
  ungated.length === 0
    ? ok("nenhuma regra CSS esconde conteúdo sem exigir JavaScript ativo")
    : fail(`${ungated.length} regras CSS escondem conteúdo mesmo sem JS`);
}

// Cada mídia do HTML precisa estar fora de um bloco oculto
const hiddenMedia = new Set();
for (const chunk of html.split(/style="opacity:0[^"]*"/).slice(1)) {
  for (const m of chunk.slice(0, 3000).matchAll(/\/assets\/[\w/-]+\.(?:jpg|png|webp|mp4)/g)) {
    hiddenMedia.add(m[0]);
  }
}
hiddenMedia.size === 0
  ? ok("todas as fotos e vídeos são renderizados visíveis no HTML estático")
  : fail(`${hiddenMedia.size} mídias invisíveis sem JS: ${[...hiddenMedia].join(", ")}`);

html.includes("IntersectionObserver")
  ? ok("script de realce progressivo embutido no HTML")
  : fail("script de realce progressivo ausente");

// Garantia final: as fotos precisam estar embutidas no HTML.
const embedded = (html.match(/data:image\/(?:jpeg|png|webp);base64,/g) ?? []).length;
embedded >= 8
  ? ok(`${embedded} imagens embutidas no HTML — aparecem mesmo sem a pasta assets`)
  : fail(`apenas ${embedded} imagens embutidas no HTML (mínimo 8)`);

// Nenhum artefato de empacotamento pode ficar dentro da pasta publicada.
const strays = [];
(function scan(dir, base = "") {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) scan(path.join(dir, entry.name), rel);
    else if (/\.(zip|tgz|map|log)$/i.test(entry.name)) strays.push(rel);
  }
})(outDir);
strays.length === 0
  ? ok("pacote sem ZIPs/artefatos indevidos")
  : fail(`artefatos indevidos na pasta publicada: ${strays.join(", ")}`);

/* 3. netlify.toml dentro do pacote de publicação --------------------- */
console.log("\n[3/6] Configuração de publicação dentro de out/\n");
writeFileSync(
  path.join(outDir, "netlify.toml"),
  `# Lu Corrêa Animal Care — pacote de publicação (upload manual no Netlify)
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
`,
);
ok("netlify.toml (headers) incluído na raiz do pacote");

/* 4. ZIPS ------------------------------------------------------------ */
console.log("\n[4/6] Geração dos ZIPs\n");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const deployZip = path.join(tmp, "lu-correa-animal-care-netlify.zip");
sh("zip", ["-r", "-q", deployZip, "."], { cwd: outDir });
ok(`pacote de publicação: ${mb(deployZip)}`);

const sourceZip = path.join(tmp, "lu-correa-animal-care-source.zip");
sh(
  "zip",
  [
    "-r",
    "-q",
    sourceZip,
    "src",
    "public",
    "scripts",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "netlify.toml",
    "README.md",
    ".gitignore",
    "-x",
    "public/downloads/*",
    "-x",
    "**/.DS_Store",
  ],
  { cwd: root },
);
ok(`pacote de código-fonte: ${mb(sourceZip)}`);

mkdirSync(downloads, { recursive: true });
copyFileSync(deployZip, path.join(downloads, "lu-correa-animal-care-netlify.zip"));
copyFileSync(sourceZip, path.join(downloads, "lu-correa-animal-care-source.zip"));

/* 5. CONFERÊNCIA DO CONTEÚDO DO ZIP ---------------------------------- */
console.log("\n[5/6] Conferência do conteúdo do ZIP de publicação\n");
const listing = execFileSync("unzip", ["-Z1", deployZip], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);
listing.includes("index.html")
  ? ok("index.html está na RAIZ do ZIP (sem pasta externa)")
  : fail("index.html não está na raiz do ZIP");
for (const file of essentials) {
  listing.includes(file) ? ok(`no ZIP: ${file}`) : fail(`faltando no ZIP: ${file}`);
}
console.log(`  → ${listing.length} arquivos no pacote de publicação`);

console.log("\n==================================================");
if (problems.length) {
  console.log(`FALHAS ENCONTRADAS (${problems.length}):`);
  problems.forEach((p) => console.log(` - ${p}`));
  process.exitCode = 1;
} else {
  console.log("TUDO OK: pacote pronto para upload manual no Netlify.");
}
console.log("==================================================\n");
