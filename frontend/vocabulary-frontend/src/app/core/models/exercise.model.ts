export interface Exercise {
  id?: number;
  exercise_type: string;
  word_id: number;
  lesson_id: number;
  cefr_level: string;
  translation?: string;
  question: string;
  options: string[]; // Array of options for multiple-choice questions
  correct_option: string; // Correct answer for the exercise
  created_at?: Date;
}
