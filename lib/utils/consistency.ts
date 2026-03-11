import dayjs from "dayjs";
import { GetHomeData200ConsistencyByDay } from "@/lib/api/fetch-generated";

/**
 * Calcula a ofensiva (streak) atual baseada no histórico de consistência.
 * A ofensiva continua se o dia atual for ignorado (ainda não treinou hoje) 
 * ou se o treino foi concluído. Se um dia passado não teve treino, a ofensiva quebra.
 */
export function calculateStreak(consistencyByDay: GetHomeData200ConsistencyByDay, today = dayjs()): number {
  const dates = Object.keys(consistencyByDay).sort().reverse();
  let calculatedStreak = 0;
  
  const todayStr = today.format("YYYY-MM-DD");

  for (const date of dates) {
    const currentDate = dayjs(date);
    
    // Ignora datas futuras
    if (currentDate.isAfter(today, 'day')) continue;
    
    const status = consistencyByDay[date];
    const isCompleted = status.workoutDayCompleted;
    
    if (isCompleted) {
      calculatedStreak++;
    } else if (date === todayStr) {
      // Se não completou hoje ainda, apenas continua procurando nos dias anteriores
      continue;
    } else {
      // Se não completou um dia passado, a ofensiva parou aqui
      break;
    }
  }
  
  return calculatedStreak;
}
