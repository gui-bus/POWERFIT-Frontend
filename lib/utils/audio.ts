/**
 * Utilitário para gerar sons sintéticos profissionais usando Web Audio API
 */
export const playSoftPing = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Frequência pura e alta para um som "cristalino"
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Lá (A5)

    // Envelope de volume extremamente suave e curto
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02); // Ataque rápido
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); // Decaimento suave

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
    
  } catch (e) {
    console.warn("Audio feedback failed:", e);
  }
};
