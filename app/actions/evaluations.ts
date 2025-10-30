'use server';

import { db } from '@/db';
import { evaluations } from '@/db/schema';

export async function submitVote(modelId: number, vote: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    await db.insert(evaluations).values({
      modelId,
      vote,
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting vote:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit vote'
    };
  }
}
