import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // SEO meta description，建議 80–120 字內
    category: z.enum(['parenting', 'working', 'travel', 'solo']),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    related: z.array(z.string()).optional(), // 其他文章的 slug 陣列，用於「延伸閱讀」
  }),
});

export const collections = { blog };
