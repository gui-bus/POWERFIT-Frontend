import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export const WEEKDAY_TRANSLATIONS = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
} as const;

export const WEEKDAYS_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

export function formatRelativeTime(date: string | Date): string {
  if (!date) return "";
  return dayjs(date).fromNow();
}

export function formatDisplayDate(date: string | Date): string {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY");
}
