
export interface Theme {
  name: string;
  colors: {
    '--bg-primary': string;
    '--bg-secondary': string;
    '--text-primary': string;
    '--text-secondary': string;
    '--accent-primary': string;
    '--accent-secondary': string;
    '--accent-highlight': string;
    '--accent-ring': string;
  };
}

export const themes: Theme[] = [
  {
    name: 'Orange',
    colors: {
      '--bg-primary': '#FFF7ED', // bg-orange-50
      '--bg-secondary': '#FFFFFF', // bg-white
      '--text-primary': '#475569', // text-slate-600
      '--text-secondary': '#64748B', // text-slate-500
      '--accent-primary': '#F97316', // text-orange-500
      '--accent-secondary': '#FFEDD5', // bg-orange-100
      '--accent-highlight': '#FED7AA', // bg-orange-200
      '--accent-ring': '#FDBA74', // ring-orange-300
    }
  },
  {
    name: 'Blue',
    colors: {
      '--bg-primary': '#EFF6FF', // bg-blue-50
      '--bg-secondary': '#FFFFFF',
      '--text-primary': '#475569',
      '--text-secondary': '#64748B',
      '--accent-primary': '#3B82F6', // text-blue-500
      '--accent-secondary': '#DBEAFE', // bg-blue-100
      '--accent-highlight': '#BFDBFE', // bg-blue-200
      '--accent-ring': '#93C5FD', // ring-blue-300
    }
  },
  {
    name: 'Green',
    colors: {
      '--bg-primary': '#F0FDF4', // bg-green-50
      '--bg-secondary': '#FFFFFF',
      '--text-primary': '#475569',
      '--text-secondary': '#64748B',
      '--accent-primary': '#22C55E', // text-green-500
      '--accent-secondary': '#DCFCE7', // bg-green-100
      '--accent-highlight': '#BBF7D0', // bg-green-200
      '--accent-ring': '#86EFAC', // ring-green-300
    }
  },
  {
    name: 'Neutral',
    colors: {
      '--bg-primary': '#F8FAFC', // bg-slate-50
      '--bg-secondary': '#FFFFFF',
      '--text-primary': '#1E293B', // text-slate-800
      '--text-secondary': '#64748B', // text-slate-500
      '--accent-primary': '#64748B', // text-slate-500
      '--accent-secondary': '#F1F5F9', // bg-slate-100
      '--accent-highlight': '#E2E8F0', // bg-slate-200
      '--accent-ring': '#CBD5E1', // ring-slate-300
    }
  }
];
