export const CATEGORIES = {
  parenting: { name: '企鵝寶寶副本', blurb: '陪一隻小企鵝長大的日常觀察' },
  working: { name: '副本裡的大人', blurb: '職場觀察、人生碎碎念，還有忙碌縫隙裡冒出來的想法' },
  travel: { name: '親子行李箱', blurb: '帶著企鵝寶寶走過的地方' },
  solo: { name: '一個人的行李箱', blurb: '副本開啟前，那個走過七大洲的女孩' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
