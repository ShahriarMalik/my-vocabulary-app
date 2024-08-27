export interface UserProgress {
  user_id: number;
  cefr_level: string;
  lesson_id: number;
  word_id: number;
  word_score?: number;
  word_completed?: boolean;
  exercise_id?: number;
  exercise_score?: number;
  exercise_completed?: boolean;
}
