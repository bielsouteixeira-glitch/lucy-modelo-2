/**
 * Servidor estático de verificação — emula o comportamento do Netlify
 * sobre a pasta de publicação (ou sobre o ZIP extraído).
 *
 * Uso: node scripts/serve-static.mjs <pasta> [porta]
 */
import http from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 4321);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".json": "application/json",
  ".txt": "text/plain",
  ".toml": "text/plain",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let file = path.join(root, urlPath);

    if (existsSync(file) && statSync(file).isDirectory()) {
      file = path.join(file, "index.html");
    }
    if (!existsSync(file)) {
      const alt = path.join(root, urlPath, "index.html");
      if (existsSync(alt)) file = alt;
      else {
        const notFound = path.join(root, "404.html");
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        return existsSync(notFound) ? createReadStream(notFound).pipe(res) : res.end("404");
      }
    }

    const size = statSync(file).size;
    const type = types[path.extname(file)] ?? "application/octet-stream";
    const range = req.headers.range;

    if (range && type === "video/mp4") {
      const [s, e] = range.replace("bytes=", "").split("-");
      const start = Number.parseInt(s, 10);
      const end = e ? Number.parseInt(e, 10) : size - 1;
      res.writeHead(206, {
        "Content-Type": type,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
      });
      return createReadStream(file, { start, end }).pipe(res);
    }

    res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
    createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`servindo ${root} em http://127.0.0.1:${port}`));
