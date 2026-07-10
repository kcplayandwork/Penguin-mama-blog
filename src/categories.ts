export const CATEGORIES = {
  parenting: { name: '親子生活', blurb: '蒙特梭利、共讀、日常陪伴' },
  working: { name: '職場爸媽', blurb: '時間管理、育兒與工作的拉鋸' },
  travel: { name: '旅遊手記', blurb: '帶著孩子的自駕與慢旅行' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
