import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

/**
 * Retorna o tempo relativo (ex: "há 2 horas")
 */
export function formatRelativeTime(date: string | Date): string {
  if (!date) return "";
  return dayjs(date).fromNow();
}

/**
 * Retorna uma data formatada para exibição
 */
export function formatDisplayDate(date: string | Date): string {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY");
}
