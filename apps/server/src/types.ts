export type User = { id: string; email: string };
export type Match = {
  id: string;
  event: string;
  red: string;
  blue: string;
  status: 'scheduled' | 'changed' | 'canceled' | 'finished';
};