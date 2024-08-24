export interface CefrProgress {
  cefr_level: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export interface CefrProgressResponse {
  cefr_levels: CefrProgress[];
}
