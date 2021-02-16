export function config(): string {
  return 'config';
}

export const CONFIG = {
  'micro-app': 3000,
  'express-app': 3050,
  'next-app': 3051,
} as const;
