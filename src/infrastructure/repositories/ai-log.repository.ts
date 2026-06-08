import { createClient } from '@/lib/supabase/server';
import { IAILogRepository, AIServiceLog } from '@/domain/entities/ai-log.entity';

export class SupabaseAILogRepository implements IAILogRepository {
  async log(entry: Omit<AIServiceLog, 'id' | 'createdAt'>): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('ai_logs')
      .insert({
        user_id: entry.userId,
        prompt: entry.prompt,
        response: entry.response,
        model: entry.model,
        metadata: entry.metadata,
      });

    if (error) {
      console.error('Failed to log AI activity:', error);
    }
  }
}
