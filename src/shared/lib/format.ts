/** 1 → "01" */
export function padIndex(value: number, length = 2) {
  return String(value).padStart(length, '0');
}
