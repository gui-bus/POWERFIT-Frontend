export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}m`;
};

export const formatVolume = (grams: number) => {
  const kg = grams / 1000;
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }
  return `${Math.round(kg)}kg`;
};

export const getVolumeComparison = (grams: number) => {
  const kg = grams / 1000;
  if (kg >= 5000) return `≈ ${(kg / 5000).toFixed(1)} Elefantes`;
  if (kg >= 1200) return `≈ ${(kg / 1200).toFixed(1)} Carros`;
  if (kg >= 500) return `≈ ${(kg / 20).toFixed(0)} Sacos de Cimento`;
  if (kg >= 100) return `≈ ${(kg / 5).toFixed(0)} Galões de Água`;
  return "Rumo ao topo!";
};
