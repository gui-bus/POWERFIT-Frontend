export function checkIsPersonalRecord(currentWeightKg: number, historyWeightsKg: number[]): boolean {
  if (currentWeightKg <= 0 || historyWeightsKg.length === 0) {
    return false;
  }
  
  const bestHistorical = Math.max(...historyWeightsKg);
  return currentWeightKg > bestHistorical && bestHistorical > 0;
}

export function gramsToKg(grams: number): string {
  if (!grams) return "";
  return (grams / 1000).toString();
}
