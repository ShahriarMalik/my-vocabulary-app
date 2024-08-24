// Response from your API
export interface LessonProgressResponse {
  lessons: LessonProgress[];
}

// Each lesson within the lessons array
export interface LessonProgress {
  cefr_level: string;
  lesson_id: number;
  total_exercises: number;
  completed_exercises: number;
  progress_percentage: number;
  exercises: Exercise[]; // Array of exercises within a lesson
}

// Each exercise within a lesson
export interface Exercise {
  exercise_id: number;
  word_id: number;
  question: string;
  completed: boolean;
}
