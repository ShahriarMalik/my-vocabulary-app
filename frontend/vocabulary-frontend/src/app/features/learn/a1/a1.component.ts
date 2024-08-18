import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../../core/services/lesson-service.service';

@Component({
  selector: 'app-a1',
  standalone: true,
  imports: [],
  templateUrl: './a1.component.html',
  styleUrl: './a1.component.css',
})
export class A1Component implements OnInit {
  lessonNumber = 'A1'; // Can be dynamically fetched if needed
  words: any[] = []; // Define a type based on your word model

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    const lessonId = this.route.snapshot.params['id']; // Fetch lesson id if needed
    this.fetchWords(lessonId);
  }

  fetchWords(lessonId: number): void {
    // this.lessonService.getWordsByLessonId(lessonId).subscribe((data) => {
    //   this.words = data;
    // });
  }
}
