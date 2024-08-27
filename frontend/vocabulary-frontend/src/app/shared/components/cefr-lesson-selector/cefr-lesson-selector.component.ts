import { Component, OnInit, output, Output } from '@angular/core';
import { Lesson } from '../../../core/models/lesson.model';
import { LessonService } from '../../../core/services/lesson.service';
import { CommonModule } from '@angular/common';
import { NoticeComponent } from '../notice/notice.component';

@Component({
  selector: 'app-cefr-lesson-selector',
  standalone: true,
  imports: [CommonModule, NoticeComponent],
  templateUrl: './cefr-lesson-selector.component.html',
  styleUrl: './cefr-lesson-selector.component.css',
})
export class CefrLessonSelectorComponent {
  errorMessage: string = '';
  successMessage: string = '';
  cefrLevelSelected = output<string>();
  lessonSelected = output<Lesson | null>();

  cefrLevels = ['A1', 'A2', 'B1', 'B2'];
  selectedCefrLevel: string = 'A1';
  lessons: Lesson[] = [];
  selectedLesson: Lesson | null = null;
  limit = 40;
  offset = 0;

  constructor(private lessonService: LessonService) {}

  ngOnInit() {
    this.cefrLevelSelected.emit(this.selectedCefrLevel);

    setTimeout(() => {
      this.loadLessons();
    }, 0);
  }

  loadLessons(): void {
    this.lessonService
      .fetchLessonsByLevel(this.selectedCefrLevel, this.limit, this.offset)
      .subscribe({
        next: (response) => {
          console.log('Received lessons:', response.lessons);
          this.lessons = response.lessons;

          // If lessons are available, select the first lesson by default and emit
          if (this.lessons.length > 0) {
            this.selectedLesson = this.lessons[0];
            this.lessonSelected.emit(this.selectedLesson); // Emit the lesson number
          } else {
            this.errorMessage = $localize`:@@noDataAvailableMessage:No data available for the selected CEFR level`;
            setTimeout(() => {
              this.errorMessage = '';
            }, 4000);
          }
        },
        error: (err) => {
          console.warn('Error fetching lessons:', err);
          this.errorMessage = $localize`:@@errorSomethingWentWrong:Something went wrong. Please try again later.`;
          this.lessons = [];
          setTimeout(() => {
            this.errorMessage = '';
          }, 4000);
        },
      });
  }

  onCefrLevelSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCefrLevel = target.value;
    this.cefrLevelSelected.emit(this.selectedCefrLevel);

    this.loadLessons();
  }

  onLessonSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLessonId = parseInt(target.value);
    this.selectedLesson =
      this.lessons.find((lesson) => lesson.id === selectedLessonId) || null;
    this.lessonSelected.emit(this.selectedLesson);
    console.log(this.selectedLesson);
  }
}
