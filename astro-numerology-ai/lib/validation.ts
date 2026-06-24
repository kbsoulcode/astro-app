import { z } from 'zod';

export const birthInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  place: z.string().min(2).max(120),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  timezone: z.string().min(1).default('UTC'),
  houseSystem: z.enum(['placidus', 'whole-sign', 'koch', 'equal']).default('placidus')
});

export type BirthInputDto = z.infer<typeof birthInputSchema>;
