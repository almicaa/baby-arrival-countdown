
import type { MonthData } from './types';

// The user specified April 31st, 2026. Since April only has 30 days, we'll use April 30th.
export const DUE_DATE: string = '2026-04-30T23:59:59';

// The user specified the pregnancy started at the beginning of August 2025.
export const PREGNANCY_START_DATE: string = '2025-08-01T00:00:00';

export const MONTHS_DATA: MonthData[] = [
  { monthNumber: 1, imageUrl: 'https://picsum.photos/seed/month1/100' },
  { monthNumber: 2, imageUrl: 'https://picsum.photos/seed/month2/100' },
  { monthNumber: 3, imageUrl: 'https://picsum.photos/seed/month3/100' },
  { monthNumber: 4, imageUrl: 'https://picsum.photos/seed/month4/100' },
  { monthNumber: 5, imageUrl: 'https://picsum.photos/seed/month5/100' },
  { monthNumber: 6, imageUrl: 'https://picsum.photos/seed/month6/100' },
  { monthNumber: 7, imageUrl: 'https://picsum.photos/seed/month7/100' },
  { monthNumber: 8, imageUrl: 'https://picsum.photos/seed/month8/100' },
  { monthNumber: 9, imageUrl: 'https://picsum.photos/seed/month9/100' },
];
