export const CATEGORIES = {
  parenting: { name: '企鵝寶寶長大中', blurb: '陪一隻小企鵝長大的日常觀察' },
  working: { name: '大人的功課', blurb: '職場觀察、人生碎碎念，還有忙碌縫隙裡冒出來的想法' },
  travel: { name: '兩個人的行李箱', blurb: '帶著企鵝寶寶走過的地方' },
  solo: { name: '住在行李箱的那幾年', blurb: '當媽媽以前，七大洲都踩過了' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
