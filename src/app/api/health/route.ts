/**
 * Healthcheck do site.
 *
 * O site é institucional e totalmente estático: não depende de banco de dados
 * em tempo de execução. A rota é marcada como estática para continuar
 * funcionando também no build de exportação usado na publicação do Netlify
 * (`STATIC_EXPORT=1 next build`).
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    ok: true,
    service: "lu-correa-animal-care",
  });
}
