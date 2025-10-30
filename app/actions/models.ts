'use server';

import { db } from '@/db';
import { models, evaluations } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';

export type ModelWithStats = {
  id: number;
  name: string;
  version: string;
  description: string;
  thumbsUp: number;
  thumbsDown: number;
};

export async function getModelsWithStats(): Promise<ModelWithStats[]> {
  const result = await db
    .select({
      id: models.id,
      name: models.name,
      version: models.version,
      description: models.description,
      thumbsUp: sql<number>`cast(count(case when ${evaluations.vote} = true then 1 end) as integer)`,
      thumbsDown: sql<number>`cast(count(case when ${evaluations.vote} = false then 1 end) as integer)`,
    })
    .from(models)
    .leftJoin(evaluations, eq(models.id, evaluations.modelId))
    .groupBy(models.id);

  return result;
}
