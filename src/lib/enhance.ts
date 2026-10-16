/**
 * Script de realce progressivo — Lu Corrêa Animal Care
 *
 * Executado inline no <head>, ANTES e INDEPENDENTEMENTE do bundle do Next.js.
 *
 * Princípio: o conteúdo (fotos, vídeos, cards) já nasce VISÍVEL no HTML
 * estático. Este script apenas ADICIONA a animação de entrada. Se ele não
 * rodar, falhar ou for bloqueado, nada desaparece.
 *
 * Camadas de segurança:
 *  1. A classe `js-anim` (que habilita a ocultação inicial) só é aplicada
 *     depois que o IntersectionObserver é confirmado como disponível.
 *  2. Qualquer exceção remove `js-anim` e revela tudo.
 *  3. Temporizadores de segurança revelam tudo mesmo que o observer falhe.
 *  4. Se a folha de estilos não carregar, não existe `js-anim` no CSS e o
 *     conteúdo permanece visível de qualquer forma.
 */
export const enhanceScript = `
(function () {
  var doc = document;
  var root = doc.documentElement;

  function showAll() {
    var nodes = doc.querySelectorAll("[data-reveal]:not([data-shown])");
    for (var i = 0; i < nodes.length; i++) nodes[i].setAttribute("data-shown", "");
  }

  try {
    var reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    root.className += " js-anim";

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.setAttribute("data-shown", "");
            observer.unobserve(entries[i].target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );

    function start() {
      var nodes = doc.querySelectorAll("[data-reveal]");
      for (var i = 0; i < nodes.length; i++) observer.observe(nodes[i]);
      /* O que já está na primeira dobra aparece imediatamente. */
      window.setTimeout(function () {
        var vh = window.innerHeight || 0;
        var all = doc.querySelectorAll("[data-reveal]:not([data-shown])");
        for (var j = 0; j < all.length; j++) {
          if (all[j].getBoundingClientRect().top < vh) all[j].setAttribute("data-shown", "");
        }
      }, 0);
    }

    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", start);
    } else {
      start();
    }

    /* Redes de segurança: nada pode ficar invisível de forma permanente. */
    window.setTimeout(showAll, 2500);
    window.addEventListener("load", function () { window.setTimeout(showAll, 1000); });
  } catch (err) {
    root.className = root.className.replace(/\\bjs-anim\\b/g, "");
    showAll();
  }
})();
`;
