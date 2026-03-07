export type AnimationVariant = "circle-blur" | "fade" | "diagonal";
export type AnimationStart = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export function createAnimation() {
  const css = `
    /* Desativa animações padrão para evitar glitches */
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
      display: block;
      filter: none;
    }

    /* O tema antigo fica estático e visível por baixo */
    ::view-transition-old(root) {
      z-index: 1;
    }

    /* O tema novo entra com um corte diagonal agressivo */
    ::view-transition-new(root) {
      z-index: 9999;
      animation: 800ms cubic-bezier(0.85, 0, 0.15, 1) both diagonal-wipe;
      outline: 100vh solid transparent; /* Garante cobertura total */
    }

    @keyframes diagonal-wipe {
      0% {
        clip-path: inset(0 100% 0 0);
      }
      100% {
        clip-path: inset(0 0 0 0);
      }
    }

    /* Correção para evitar que o navegador renderize bordas brancas/pretas */
    html {
      background-color: transparent !important;
    }
  `;

  return { css, name: "diagonal-wipe" };
}
