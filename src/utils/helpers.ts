let idCounter = 0;

export function generateId(): string {
  idCounter++;
  return `${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
