import dayjs from "dayjs";
import { GetHomeData200ConsistencyByDay } from "@/lib/api/fetch-generated";

export function calculateStreak(consistencyByDay: GetHomeData200ConsistencyByDay, today = dayjs()): number {
  const dates = Object.keys(consistencyByDay).sort().reverse();
  let calculatedStreak = 0;
  
  const todayStr = today.format("YYYY-MM-DD");

  for (const date of dates) {
    const currentDate = dayjs(date);
    
    if (currentDate.isAfter(today, 'day')) continue;
    
    const status = consistencyByDay[date];
    const isCompleted = status.workoutDayCompleted;
    
    if (isCompleted) {
      calculatedStreak++;
    } else if (date === todayStr) {
      continue;
    } else {
      break;
    }
  }
  
  return calculatedStreak;
}
