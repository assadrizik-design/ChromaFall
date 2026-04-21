export const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const COLORS = {
  0: 'transparent',
  I: 'bg-[#06b6d4] shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] rounded-[2px]',
  J: 'bg-[#3b82f6] shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] rounded-[2px]',
  L: 'bg-[#ea580c] shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] rounded-[2px]',
  O: 'bg-[#eab308] shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] rounded-[2px]',
  S: 'bg-[#16a34a] shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] rounded-[2px]',
  Z: 'bg-[#ef4444] shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] rounded-[2px]',
  T: 'bg-[#a855f7] shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] rounded-[2px]',
};

export const LEVELS = [
  { level: 1, cols: 10, rows: 20, speed: 1000, linesToNext: 15 },
  { level: 2, cols: 10, rows: 20, speed: 750, linesToNext: 35 },
  { level: 3, cols: 11, rows: 21, speed: 550, linesToNext: 60 },
  { level: 4, cols: 12, rows: 22, speed: 450, linesToNext: 90 },
  { level: 5, cols: 13, rows: 23, speed: 350, linesToNext: 125 },
  { level: 6, cols: 14, rows: 24, speed: 280, linesToNext: 165 },
  { level: 7, cols: 15, rows: 25, speed: 220, linesToNext: 215 },
  { level: 8, cols: 16, rows: 26, speed: 160, linesToNext: 275 },
  { level: 9, cols: 17, rows: 27, speed: 110, linesToNext: 345 },
  { level: 10, cols: 18, rows: 28, speed: 70, linesToNext: 425 },
];
