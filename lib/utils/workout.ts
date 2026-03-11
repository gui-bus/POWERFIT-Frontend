/**
 * Calcula se uma carga atual é um recorde pessoal baseado no histórico.
 */
export function checkIsPersonalRecord(currentWeightKg: number, historyWeightsKg: number[]): boolean {
  if (currentWeightKg <= 0 || historyWeightsKg.length === 0) {
    return false;
  }
  
  const bestHistorical = Math.max(...historyWeightsKg);
  return currentWeightKg > bestHistorical && bestHistorical > 0;
}

/**
 * Formata gramas para kg para exibição em inputs
 */
export function gramsToKg(grams: number): string {
  if (!grams) return "";
  return (grams / 1000).toString();
}
