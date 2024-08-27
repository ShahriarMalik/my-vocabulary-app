import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Lesson } from '../../core/models/lesson.model';
import { LessonService } from '../../core/services/lesson.service';
import { WordManagementService } from '../../core/services/word-management.service';
import { NoticeComponent } from '../../shared/components/notice/notice.component';
import { Word } from '../../core/models/word.model';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { AudioPlayerComponent } from '../../shared/components/audio-player/audio-player.component';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [
    RouterModule,
    NoticeComponent,
    AudioPlayerComponent,
    PaginatorComponent,
  ],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.css',
})
export class LearnComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';
  lessons: Lesson[] = [];
  selectedLesson: Lesson | null = null;
  cefrLevels = ['', 'A1', 'A2', 'B1', 'B2'];
  selectedCefrLevel: string = '';
  limit = 40;
  offset = 0;
  allWords: any[] = []; // Store all words
  paginatedWords: any[] = []; // Store the paginated words
  currentPage = 0;
  pageSize = 4;

  constructor(
    private lessonService: LessonService,
    private wordService: WordManagementService
  ) {}

  ngOnInit(): void {}

  onCefrLevelSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCefrLevel = target.value;
    if (this.selectedCefrLevel) {
      this.loadLessons();
    }
  }

  onLessonSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLessonId = parseInt(target.value);
    this.selectedLesson =
      this.lessons.find((lesson) => lesson.id === selectedLessonId) || null;
    if (this.selectedLesson) {
      this.currentPage = 0;
      this.loadWords();
    }
  }

  loadLessons(): void {
    this.lessonService
      .fetchLessonsByLevel(this.selectedCefrLevel, this.limit, this.offset)
      .subscribe({
        next: (response) => {
          this.lessons = response.lessons;
          if (this.lessons.length > 0) {
            this.selectedLesson = this.lessons[0];
            this.currentPage = 0;
            this.loadWords();
          } else {
            this.allWords = [];
            this.paginatedWords = [];

            this.errorMessage = $localize`:@@noLessonCEFR:No lessons available for the selected CEFR level`;
          }
        },
        error: (err) => {
          this.errorMessage = $localize`:@@wentWrong:Something went wrong. Please try again later.`;
        },
      });

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 7000);
  }

  loadWords(): void {
    if (this.selectedLesson) {
      this.wordService
        .fetchWordsByCefrLevel(
          this.selectedCefrLevel,
          this.selectedLesson.lesson_number,
          this.limit,
          this.offset
        )
        .subscribe({
          next: (response) => {
            if (response.words.length <= 0) {
              this.errorMessage = $localize`:@@noWordsForSelection:No words available for the selection at this moment`;
              setTimeout(() => {
                this.errorMessage = '';
              }, 7000);
              this.allWords = [];
              this.paginatedWords = [];
              return;
            }
            this.currentPage = 0;
            this.allWords = response.words; // Store all words
            this.paginateWords(); // Paginate words
          },
          error: (err) => {
            this.errorMessage = $localize`::@@errorFetchingWords:Error fetching words for the selected lesson`;
          },
        });
    }
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 7000);
  }

  // Method to paginate words
  paginateWords(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedWords = this.allWords.slice(start, end); // Slice from allWords
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginateWords(); // Update paginatedWords when page changes
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.paginateWords();
  }
}
