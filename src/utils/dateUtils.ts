export const daysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const firstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const isWeekend = (date: Date): boolean => {
  return date.getDay() === 0 || date.getDay() === 6;
};

export const isWeekday = (date: Date): boolean => {
  return !isWeekend(date);
};

export const getWeekendsInRange = (range: {
  start: Date | null;
  end: Date | null;
}): Date[] => {
  if (!range.start || !range.end) return [];

  const weekends: Date[] = [];
  let currentDate = new Date(range.start);

  while (currentDate <= range.end) {
    if (isWeekend(currentDate)) {
      weekends.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekends;
};
export const formatDate = (date: Date | null): string => {
  return date
    ? date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Not selected';
};
