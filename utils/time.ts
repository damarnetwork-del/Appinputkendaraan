
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const calculateDuration = (start: Date, end: Date): string => {
  const diffMs = end.getTime() - start.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  const seconds = diffSecs % 60;
  const minutes = diffMins % 60;
  const hours = diffHours;

  let durationString = '';
  if (hours > 0) {
    durationString += `${hours} jam `;
  }
  if (minutes > 0) {
    durationString += `${minutes} mnt `;
  }
  if (seconds > 0 || durationString === '') {
    durationString += `${seconds} dtk`;
  }

  return durationString.trim();
};

/**
 * Formats a Date object to a string compatible with datetime-local input.
 * e.g., "2024-07-30T10:30"
 * @param date The date to format.
 * @returns A string in YYYY-MM-DDTHH:mm format.
 */
export const formatToDateTimeLocal = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};