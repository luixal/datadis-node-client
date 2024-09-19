export function formatDateToYearAndMonthOnly(date: Date) {
  return date.toISOString().split('-').slice(0,2).join('/');
}