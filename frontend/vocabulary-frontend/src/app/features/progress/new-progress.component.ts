// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   BaseChartDirective,
//   provideCharts,
//   withDefaultRegisterables,
// } from 'ng2-charts';
// import { ChartData, ChartOptions } from 'chart.js';
// import { CefrProgressResponse } from '../../core/models/cefr-progress.model';
// import { LessonProgress } from '../../core/models/lesson-progress.model';
// import { ThemeService } from '../../core/services/theme.service';
// import { Subscription } from 'rxjs';
// import { NoticeComponent } from '../../shared/components/notice/notice.component';

// @Component({
//   selector: 'app-progress',
//   standalone: true,
//   imports: [CommonModule, BaseChartDirective, NoticeComponent],
//   providers: [provideCharts(withDefaultRegisterables())],
//   templateUrl: './progress.component.html',
//   styleUrls: ['./progress.component.css'],
// })
// export class ProgressComponent implements OnInit {
//   // Mock data for CEFR levels
//   private mockCefrData: CefrProgressResponse = {
//     cefr_levels: [
//       {
//         cefr_level: 'A1',
//         total_lessons: 32,
//         completed_lessons: 10,
//         progress_percentage: 31.25,
//       },
//       {
//         cefr_level: 'A2',
//         total_lessons: 30,
//         completed_lessons: 15,
//         progress_percentage: 50,
//       },
//       {
//         cefr_level: 'B1',
//         total_lessons: 25,
//         completed_lessons: 20,
//         progress_percentage: 80,
//       },
//       {
//         cefr_level: 'B2',
//         total_lessons: 20,
//         completed_lessons: 10,
//         progress_percentage: 50,
//       },
//     ],
//   };

//   // Mock data for lesson progress
//   private mockLessonData: LessonProgress[] = [
//     {
//       cefr_level: 'A1',
//       lesson_id: 1,
//       total_exercises: 20,
//       completed_exercises: 15,
//       exercises: [
//         {
//           exercise_id: 1,
//           word_id: 1,
//           question: 'What is the meaning of Familie',
//           completed: true,
//         },
//         {
//           exercise_id: 2,
//           word_id: 2,
//           question: 'What is the meaning of ab',
//           completed: true,
//         },
//         {
//           exercise_id: 3,
//           word_id: 3,
//           question: 'What is the meaning of Name',
//           completed: true,
//         },
//         {
//           exercise_id: 4,
//           word_id: 4,
//           question: 'What is the meaning of reisen',
//           completed: true,
//         },
//         {
//           exercise_id: 5,
//           word_id: 5,
//           question: 'What is the meaning of Telefon',
//           completed: true,
//         },
//         {
//           exercise_id: 6,
//           word_id: 6,
//           question: 'What is the meaning of Geburtsdatum',
//           completed: true,
//         },
//         {
//           exercise_id: 7,
//           word_id: 7,
//           question: 'What is the meaning of Geburtsort',
//           completed: true,
//         },
//         {
//           exercise_id: 8,
//           word_id: 8,
//           question: 'What is the meaning of Alter',
//           completed: true,
//         },
//         {
//           exercise_id: 9,
//           word_id: 9,
//           question: 'What is the meaning of Geschlecht',
//           completed: true,
//         },
//         {
//           exercise_id: 10,
//           word_id: 10,
//           question: 'What is the meaning of Familienstand',
//           completed: true,
//         },
//         {
//           exercise_id: 11,
//           word_id: 11,
//           question: 'What is the meaning of Staatsangehörigkeit',
//           completed: true,
//         },
//         {
//           exercise_id: 12,
//           word_id: 12,
//           question: 'What is the meaning of Aussehen',
//           completed: true,
//         },
//         {
//           exercise_id: 13,
//           word_id: 13,
//           question: 'What is the meaning of Gewohnheit',
//           completed: true,
//         },
//         {
//           exercise_id: 14,
//           word_id: 14,
//           question: 'What is the meaning of Wohnung',
//           completed: true,
//         },
//         {
//           exercise_id: 15,
//           word_id: 15,
//           question: 'What is the meaning of Räume',
//           completed: true,
//         },
//         {
//           exercise_id: 16,
//           word_id: 16,
//           question: 'What is the meaning of Einrichtung',
//           completed: false,
//         },
//         {
//           exercise_id: 17,
//           word_id: 17,
//           question: 'What is the meaning of Miete',
//           completed: false,
//         },
//         {
//           exercise_id: 18,
//           word_id: 18,
//           question: 'What is the meaning of Wohnungswechsel',
//           completed: false,
//         },
//         {
//           exercise_id: 19,
//           word_id: 19,
//           question: 'What is the meaning of Pflanzen',
//           completed: false,
//         },
//         {
//           exercise_id: 20,
//           word_id: 20,
//           question: 'What is the meaning of Tiere',
//           completed: false,
//         },
//       ],
//       progress_percentage: 75,
//     },
//     {
//       cefr_level: 'A1',
//       lesson_id: 1,
//       total_exercises: 20,
//       completed_exercises: 1,
//       exercises: [
//         {
//           exercise_id: 3,
//           word_id: 1,
//           question: 'What is the meaning of Familie',
//           completed: false,
//         },
//         {
//           exercise_id: 4,
//           word_id: 2,
//           question: 'What is the meaning of ab',
//           completed: true,
//         },
//         {
//           exercise_id: 5,
//           word_id: 3,
//           question: 'What is the meaning of Name',
//           completed: false,
//         },
//         {
//           exercise_id: 6,
//           word_id: 4,
//           question: 'What is the meaning of reisen',
//           completed: false,
//         },
//         {
//           exercise_id: 7,
//           word_id: 5,
//           question: 'What is the meaning of Telefon',
//           completed: false,
//         },
//         {
//           exercise_id: 8,
//           word_id: 6,
//           question: 'What is the meaning of Geburtsdatum',
//           completed: false,
//         },
//         {
//           exercise_id: 9,
//           word_id: 7,
//           question: 'What is the meaning of Geburtsort',
//           completed: false,
//         },
//         {
//           exercise_id: 10,
//           word_id: 8,
//           question: 'What is the meaning of Alter',
//           completed: false,
//         },
//         {
//           exercise_id: 11,
//           word_id: 9,
//           question: 'What is the meaning of Geschlecht',
//           completed: false,
//         },
//         {
//           exercise_id: 12,
//           word_id: 10,
//           question: 'What is the meaning of Familienstand',
//           completed: false,
//         },
//         {
//           exercise_id: 13,
//           word_id: 11,
//           question: 'What is the meaning of Staatsangehörigkeit',
//           completed: false,
//         },
//         {
//           exercise_id: 14,
//           word_id: 12,
//           question: 'What is the meaning of Aussehen',
//           completed: false,
//         },
//         {
//           exercise_id: 15,
//           word_id: 13,
//           question: 'What is the meaning of Gewohnheit',
//           completed: false,
//         },
//         {
//           exercise_id: 16,
//           word_id: 14,
//           question: 'What is the meaning of Wohnung',
//           completed: false,
//         },
//         {
//           exercise_id: 17,
//           word_id: 15,
//           question: 'What is the meaning of Räume',
//           completed: false,
//         },
//         {
//           exercise_id: 18,
//           word_id: 16,
//           question: 'What is the meaning of Einrichtung',
//           completed: false,
//         },
//         {
//           exercise_id: 19,
//           word_id: 17,
//           question: 'What is the meaning of Miete',
//           completed: false,
//         },
//         {
//           exercise_id: 20,
//           word_id: 18,
//           question: 'What is the meaning of Wohnungswechsel',
//           completed: false,
//         },
//         {
//           exercise_id: 21,
//           word_id: 19,
//           question: 'What is the meaning of Pflanzen',
//           completed: false,
//         },
//         {
//           exercise_id: 22,
//           word_id: 20,
//           question: 'What is the meaning of Tiere',
//           completed: false,
//         },
//       ],
//       progress_percentage: 5,
//     },
//     {
//       lesson_id: 2,
//       cefr_level: 'A1',
//       total_exercises: 10,
//       completed_exercises: 6,
//       exercises: [
//         {
//           exercise_id: 21,
//           word_id: 21,
//           question: 'What is the meaning of Klima',
//           completed: true,
//         },
//         {
//           exercise_id: 22,
//           word_id: 22,
//           question: 'What is the meaning of Wetter',
//           completed: true,
//         },
//         {
//           exercise_id: 23,
//           word_id: 23,
//           question: 'What is the meaning of Unterkunft',
//           completed: true,
//         },
//         {
//           exercise_id: 24,
//           word_id: 24,
//           question: 'What is the meaning of Gepäck',
//           completed: true,
//         },
//         {
//           exercise_id: 25,
//           word_id: 25,
//           question: 'What is the meaning of Nahrungsmittel',
//           completed: true,
//         },
//         {
//           exercise_id: 26,
//           word_id: 26,
//           question: 'What is the meaning of Mahlzeiten',
//           completed: true,
//         },
//         {
//           exercise_id: 27,
//           word_id: 27,
//           question: 'What is the meaning of Reise',
//           completed: false,
//         },
//         {
//           exercise_id: 28,
//           word_id: 28,
//           question: 'What is the meaning of Ziel',
//           completed: false,
//         },
//         {
//           exercise_id: 29,
//           word_id: 29,
//           question: 'What is the meaning of Stadt',
//           completed: false,
//         },
//         {
//           exercise_id: 30,
//           word_id: 30,
//           question: 'What is the meaning of Land',
//           completed: false,
//         },
//       ],
//       progress_percentage: 60,
//     },
//     {
//       cefr_level: 'A1',
//       lesson_id: 3,
//       completed_exercises: 3,
//       total_exercises: 5,
//       exercises: [
//         {
//           exercise_id: 31,
//           word_id: 31,
//           question: 'What is the meaning of Bank',
//           completed: true,
//         },
//         {
//           exercise_id: 32,
//           word_id: 32,
//           question: 'What is the meaning of Geld',
//           completed: true,
//         },
//         {
//           exercise_id: 33,
//           word_id: 33,
//           question: 'What is the meaning of Rechnung',
//           completed: true,
//         },
//         {
//           exercise_id: 34,
//           word_id: 34,
//           question: 'What is the meaning of Konto',
//           completed: false,
//         },
//         {
//           exercise_id: 35,
//           word_id: 35,
//           question: 'What is the meaning of Kreditkarte',
//           completed: false,
//         },
//       ],
//       progress_percentage: 60,
//     },
//     {
//       lesson_id: 4,
//       cefr_level: 'A1',
//       total_exercises: 8,
//       completed_exercises: 8,
//       exercises: [
//         {
//           exercise_id: 36,
//           word_id: 36,
//           question: 'What is the meaning of Computer',
//           completed: true,
//         },
//         {
//           exercise_id: 37,
//           word_id: 37,
//           question: 'What is the meaning of Internet',
//           completed: true,
//         },
//         {
//           exercise_id: 38,
//           word_id: 38,
//           question: 'What is the meaning of Software',
//           completed: true,
//         },
//         {
//           exercise_id: 39,
//           word_id: 39,
//           question: 'What is the meaning of Hardware',
//           completed: true,
//         },
//         {
//           exercise_id: 40,
//           word_id: 40,
//           question: 'What is the meaning of Monitor',
//           completed: true,
//         },
//         {
//           exercise_id: 41,
//           word_id: 41,
//           question: 'What is the meaning of Tastatur',
//           completed: true,
//         },
//         {
//           exercise_id: 42,
//           word_id: 42,
//           question: 'What is the meaning of Maus',
//           completed: true,
//         },
//         {
//           exercise_id: 43,
//           word_id: 43,
//           question: 'What is the meaning of Drucker',
//           completed: true,
//         },
//       ],
//       progress_percentage: 100,
//     },

//     {
//       lesson_id: 5,
//       cefr_level: 'A1',
//       total_exercises: 6,
//       completed_exercises: 3,
//       exercises: [
//         {
//           exercise_id: 44,
//           word_id: 44,
//           question: 'What is the meaning of Auto',
//           completed: false,
//         },
//         {
//           exercise_id: 45,
//           word_id: 45,
//           question: 'What is the meaning of Bus',
//           completed: false,
//         },
//         {
//           exercise_id: 46,
//           word_id: 46,
//           question: 'What is the meaning of Zug',
//           completed: false,
//         },
//         {
//           exercise_id: 47,
//           word_id: 47,
//           question: 'What is the meaning of Flugzeug',
//           completed: false,
//         },
//         {
//           exercise_id: 48,
//           word_id: 48,
//           question: 'What is the meaning of Schiff',
//           completed: false,
//         },
//         {
//           exercise_id: 49,
//           word_id: 49,
//           question: 'What is the meaning of Fahrrad',
//           completed: false,
//         },
//       ],
//       progress_percentage: 40,
//     },
//     {
//       lesson_id: 6,
//       cefr_level: 'A1',
//       total_exercises: 8,
//       completed_exercises: 4,
//       exercises: [
//         {
//           exercise_id: 50,
//           word_id: 50,
//           question: 'What is the meaning of Küche',
//           completed: true,
//         },
//         {
//           exercise_id: 51,
//           word_id: 51,
//           question: 'What is the meaning of Bad',
//           completed: true,
//         },
//         {
//           exercise_id: 52,
//           word_id: 52,
//           question: 'What is the meaning of Wohnzimmer',
//           completed: true,
//         },
//         {
//           exercise_id: 53,
//           word_id: 53,
//           question: 'What is the meaning of Schlafzimmer',
//           completed: true,
//         },
//         {
//           exercise_id: 54,
//           word_id: 54,
//           question: 'What is the meaning of Flur',
//           completed: false,
//         },
//         {
//           exercise_id: 55,
//           word_id: 55,
//           question: 'What is the meaning of Balkon',
//           completed: false,
//         },
//         {
//           exercise_id: 56,
//           word_id: 56,
//           question: 'What is the meaning of Keller',
//           completed: false,
//         },
//         {
//           exercise_id: 57,
//           word_id: 57,
//           question: 'What is the meaning of Dachboden',
//           completed: false,
//         },
//       ],
//       progress_percentage: 50,
//     },
//     {
//       lesson_id: 7,
//       cefr_level: 'A1',
//       total_exercises: 12,
//       completed_exercises: 6,
//       exercises: [
//         {
//           exercise_id: 58,
//           word_id: 58,
//           question: 'What is the meaning of Schule',
//           completed: true,
//         },
//         {
//           exercise_id: 59,
//           word_id: 59,
//           question: 'What is the meaning of Lehrer',
//           completed: true,
//         },
//         {
//           exercise_id: 60,
//           word_id: 60,
//           question: 'What is the meaning of Schüler',
//           completed: true,
//         },
//         {
//           exercise_id: 61,
//           word_id: 61,
//           question: 'What is the meaning of Unterricht',
//           completed: true,
//         },
//         {
//           exercise_id: 62,
//           word_id: 62,
//           question: 'What is the meaning of Prüfung',
//           completed: true,
//         },
//         {
//           exercise_id: 63,
//           word_id: 63,
//           question: 'What is the meaning of Zeugnis',
//           completed: true,
//         },
//         {
//           exercise_id: 64,
//           word_id: 64,
//           question: 'What is the meaning of Klasse',
//           completed: false,
//         },
//         {
//           exercise_id: 65,
//           word_id: 65,
//           question: 'What is the meaning of Pause',
//           completed: false,
//         },
//         {
//           exercise_id: 66,
//           word_id: 66,
//           question: 'What is the meaning of Lehrerzimmer',
//           completed: false,
//         },
//         {
//           exercise_id: 67,
//           word_id: 67,
//           question: 'What is the meaning of Schulhof',
//           completed: false,
//         },
//         {
//           exercise_id: 68,
//           word_id: 68,
//           question: 'What is the meaning of Sporthalle',
//           completed: false,
//         },
//         {
//           exercise_id: 69,
//           word_id: 69,
//           question: 'What is the meaning of Bibliothek',
//           completed: false,
//         },
//       ],
//       progress_percentage: 50,
//     },
//     {
//       lesson_id: 8,
//       cefr_level: 'A1',
//       total_exercises: 4,
//       completed_exercises: 2,
//       exercises: [
//         {
//           exercise_id: 70,
//           word_id: 70,
//           question: 'What is the meaning of Arzt',
//           completed: true,
//         },
//         {
//           exercise_id: 71,
//           word_id: 71,
//           question: 'What is the meaning of Krankenhaus',
//           completed: true,
//         },
//         {
//           exercise_id: 72,
//           word_id: 72,
//           question: 'What is the meaning of Krankenschwester',
//           completed: false,
//         },
//         {
//           exercise_id: 73,
//           word_id: 73,
//           question: 'What is the meaning of Patient',
//           completed: false,
//         },
//       ],
//       progress_percentage: 50,
//     },
//     {
//       lesson_id: 9,
//       cefr_level: 'A1',
//       total_exercises: 5,
//       completed_exercises: 3,
//       exercises: [
//         {
//           exercise_id: 74,
//           word_id: 74,
//           question: 'What is the meaning of Schule',
//           completed: true,
//         },
//         {
//           exercise_id: 75,
//           word_id: 75,
//           question: 'What is the meaning of Lehrer',
//           completed: true,
//         },
//         {
//           exercise_id: 76,
//           word_id: 76,
//           question: 'What is the meaning of Schülerin',
//           completed: true,
//         },
//         {
//           exercise_id: 77,
//           word_id: 77,
//           question: 'What is the meaning of Unterricht',
//           completed: false,
//         },
//         {
//           exercise_id: 78,
//           word_id: 78,
//           question: 'What is the meaning of Prüfung',
//           completed: false,
//         },
//       ],
//       progress_percentage: 60,
//     },
//     {
//       lesson_id: 10,
//       cefr_level: 'A1',
//       total_exercises: 6,
//       completed_exercises: 4,
//       exercises: [
//         {
//           exercise_id: 79,
//           word_id: 79,
//           question: 'What is the meaning of Tisch',
//           completed: true,
//         },
//         {
//           exercise_id: 80,
//           word_id: 80,
//           question: 'What is the meaning of Stuhl',
//           completed: true,
//         },
//         {
//           exercise_id: 81,
//           word_id: 81,
//           question: 'What is the meaning of Fenster',
//           completed: true,
//         },
//         {
//           exercise_id: 82,
//           word_id: 82,
//           question: 'What is the meaning of Tür',
//           completed: true,
//         },
//         {
//           exercise_id: 83,
//           word_id: 83,
//           question: 'What is the meaning of Lampe',
//           completed: false,
//         },
//         {
//           exercise_id: 84,
//           word_id: 84,
//           question: 'What is the meaning of Sofa',
//           completed: false,
//         },
//       ],
//       progress_percentage: 67,
//     },
//     {
//       lesson_id: 11,
//       cefr_level: 'A1',
//       total_exercises: 3,
//       completed_exercises: 1,
//       exercises: [
//         {
//           exercise_id: 85,
//           word_id: 85,
//           question: 'What is the meaning of Stadt',
//           completed: true,
//         },
//         {
//           exercise_id: 86,
//           word_id: 86,
//           question: 'What is the meaning of Dorf',
//           completed: false,
//         },
//         {
//           exercise_id: 87,
//           word_id: 87,
//           question: 'What is the meaning of Land',
//           completed: false,
//         },
//       ],
//       progress_percentage: 33,
//     },
//     {
//       lesson_id: 12,
//       cefr_level: 'A1',
//       total_exercises: 4,
//       completed_exercises: 0,
//       exercises: [
//         {
//           exercise_id: 88,
//           word_id: 88,
//           question: 'What is the meaning of Wetter',
//           completed: false,
//         },
//         {
//           exercise_id: 89,
//           word_id: 89,
//           question: 'What is the meaning of Regen',
//           completed: false,
//         },
//         {
//           exercise_id: 90,
//           word_id: 90,
//           question: 'What is the meaning of Sonne',
//           completed: false,
//         },
//         {
//           exercise_id: 91,
//           word_id: 91,
//           question: 'What is the meaning of Schnee',
//           completed: false,
//         },
//       ],
//       progress_percentage: 0,
//     },
//     {
//       lesson_id: 13,
//       cefr_level: 'A1',
//       total_exercises: 7,
//       completed_exercises: 5,
//       exercises: [
//         {
//           exercise_id: 92,
//           word_id: 92,
//           question: 'What is the meaning of Auto',
//           completed: true,
//         },
//         {
//           exercise_id: 93,
//           word_id: 93,
//           question: 'What is the meaning of Bus',
//           completed: true,
//         },
//         {
//           exercise_id: 94,
//           word_id: 94,
//           question: 'What is the meaning of Zug',
//           completed: true,
//         },
//         {
//           exercise_id: 95,
//           word_id: 95,
//           question: 'What is the meaning of Flugzeug',
//           completed: true,
//         },
//         {
//           exercise_id: 96,
//           word_id: 96,
//           question: 'What is the meaning of Fahrrad',
//           completed: true,
//         },
//         {
//           exercise_id: 97,
//           word_id: 97,
//           question: 'What is the meaning of Motorrad',
//           completed: false,
//         },
//         {
//           exercise_id: 98,
//           word_id: 98,
//           question: 'What is the meaning of Schiff',
//           completed: false,
//         },
//       ],
//       progress_percentage: 71,
//     },
//     {
//       lesson_id: 14,
//       cefr_level: 'A1',
//       total_exercises: 5,
//       completed_exercises: 2,
//       exercises: [
//         {
//           exercise_id: 99,
//           word_id: 99,
//           question: 'What is the meaning of Obst',
//           completed: true,
//         },
//         {
//           exercise_id: 100,
//           word_id: 100,
//           question: 'What is the meaning of Gemüse',
//           completed: true,
//         },
//         {
//           exercise_id: 101,
//           word_id: 101,
//           question: 'What is the meaning of Brot',
//           completed: false,
//         },
//         {
//           exercise_id: 102,
//           word_id: 102,
//           question: 'What is the meaning of Milch',
//           completed: false,
//         },
//         {
//           exercise_id: 103,
//           word_id: 103,
//           question: 'What is the meaning of Käse',
//           completed: false,
//         },
//       ],
//       progress_percentage: 40,
//     },
//     {
//       lesson_id: 15,
//       cefr_level: 'A1',
//       total_exercises: 6,
//       completed_exercises: 4,
//       exercises: [
//         {
//           exercise_id: 104,
//           word_id: 104,
//           question: 'What is the meaning of Wasser',
//           completed: true,
//         },
//         {
//           exercise_id: 105,
//           word_id: 105,
//           question: 'What is the meaning of Saft',
//           completed: true,
//         },
//         {
//           exercise_id: 106,
//           word_id: 106,
//           question: 'What is the meaning of Tee',
//           completed: true,
//         },
//         {
//           exercise_id: 107,
//           word_id: 107,
//           question: 'What is the meaning of Kaffee',
//           completed: true,
//         },
//         {
//           exercise_id: 108,
//           word_id: 108,
//           question: 'What is the meaning of Wein',
//           completed: false,
//         },
//         {
//           exercise_id: 109,
//           word_id: 109,
//           question: 'What is the meaning of Bier',
//           completed: false,
//         },
//       ],
//       progress_percentage: 66.67,
//     },
//     {
//       lesson_id: 16,
//       cefr_level: 'A1',
//       total_exercises: 4,
//       completed_exercises: 3,
//       exercises: [
//         {
//           exercise_id: 110,
//           word_id: 110,
//           question: 'What is the meaning of Apfel',
//           completed: true,
//         },
//         {
//           exercise_id: 111,
//           word_id: 111,
//           question: 'What is the meaning of Banane',
//           completed: true,
//         },
//         {
//           exercise_id: 112,
//           word_id: 112,
//           question: 'What is the meaning of Orange',
//           completed: true,
//         },
//         {
//           exercise_id: 113,
//           word_id: 113,
//           question: 'What is the meaning of Traube',
//           completed: false,
//         },
//       ],
//       progress_percentage: 75,
//     },
//     {
//       lesson_id: 17,
//       cefr_level: 'A1',
//       total_exercises: 3,
//       completed_exercises: 1,
//       exercises: [
//         {
//           exercise_id: 114,
//           word_id: 114,
//           question: 'What is the meaning of Fleisch',
//           completed: true,
//         },
//         {
//           exercise_id: 115,
//           word_id: 115,
//           question: 'What is the meaning of Fisch',
//           completed: false,
//         },
//         {
//           exercise_id: 116,
//           word_id: 116,
//           question: 'What is the meaning of Ei',
//           completed: false,
//         },
//       ],
//       progress_percentage: 33.33,
//     },
//     {
//       lesson_id: 18,
//       cefr_level: 'A1',
//       total_exercises: 4,
//       completed_exercises: 2,
//       exercises: [
//         {
//           exercise_id: 117,
//           word_id: 117,
//           question: 'What is the meaning of Butter',
//           completed: true,
//         },
//         {
//           exercise_id: 118,
//           word_id: 118,
//           question: 'What is the meaning of Marmelade',
//           completed: true,
//         },
//         {
//           exercise_id: 119,
//           word_id: 119,
//           question: 'What is the meaning of Honig',
//           completed: false,
//         },
//         {
//           exercise_id: 120,
//           word_id: 120,
//           question: 'What is the meaning of Zucker',
//           completed: false,
//         },
//       ],
//       progress_percentage: 50,
//     },
//     {
//       lesson_id: 19,
//       cefr_level: 'A1',
//       total_exercises: 5,
//       completed_exercises: 3,
//       exercises: [
//         {
//           exercise_id: 121,
//           word_id: 121,
//           question: 'What is the meaning of Salz',
//           completed: true,
//         },
//         {
//           exercise_id: 122,
//           word_id: 122,
//           question: 'What is the meaning of Pfeffer',
//           completed: true,
//         },
//         {
//           exercise_id: 123,
//           word_id: 123,
//           question: 'What is the meaning of Öl',
//           completed: true,
//         },
//         {
//           exercise_id: 124,
//           word_id: 124,
//           question: 'What is the meaning of Essig',
//           completed: false,
//         },
//         {
//           exercise_id: 125,
//           word_id: 125,
//           question: 'What is the meaning of Senf',
//           completed: false,
//         },
//       ],
//       progress_percentage: 60,
//     },
//     {
//       lesson_id: 20,
//       cefr_level: 'A1',
//       total_exercises: 3,
//       completed_exercises: 2,
//       exercises: [
//         {
//           exercise_id: 126,
//           word_id: 126,
//           question: 'What is the meaning of Tisch',
//           completed: true,
//         },
//         {
//           exercise_id: 127,
//           word_id: 127,
//           question: 'What is the meaning of Stuhl',
//           completed: false,
//         },
//       ],
//       progress_percentage: 66.67,
//     },
//     {
//       lesson_id: 21,
//       cefr_level: 'A1',
//       total_exercises: 4,
//       completed_exercises: 3,
//       exercises: [
//         {
//           exercise_id: 128,
//           word_id: 128,
//           question: 'What is the meaning of Haus',
//           completed: true,
//         },
//       ],
//       progress_percentage: 75,
//     },
//     {
//       lesson_id: 22,
//       cefr_level: 'A1',
//       total_exercises: 5,
//       completed_exercises: 1,
//       exercises: [
//         {
//           exercise_id: 129,
//           word_id: 129,
//           question: 'What is the meaning of Auto',
//           completed: false,
//         },
//       ],
//       progress_percentage: 20,
//     },
//     {
//       lesson_id: 23,
//       cefr_level: 'A1',
//       total_exercises: 6,
//       completed_exercises: 4,
//       exercises: [
//         {
//           exercise_id: 130,
//           word_id: 130,
//           question: 'What is the meaning of Buch',
//           completed: true,
//         },
//       ],
//       progress_percentage: 66.67,
//     },
//     {
//       lesson_id: 24,
//       cefr_level: 'A1',
//       total_exercises: 2,
//       completed_exercises: 2,
//       exercises: [
//         {
//           exercise_id: 131,
//           word_id: 131,
//           question: 'What is the meaning of Tür',
//           completed: true,
//         },
//       ],
//       progress_percentage: 100,
//     },
//     {
//       lesson_id: 25,
//       cefr_level: 'A1',
//       total_exercises: 7,
//       completed_exercises: 5,
//       exercises: [
//         {
//           exercise_id: 132,
//           word_id: 132,
//           question: 'What is the meaning of Fenster',
//           completed: true,
//         },
//       ],
//       progress_percentage: 71.43,
//     },
//     {
//       lesson_id: 26,
//       cefr_level: 'A1',
//       total_exercises: 3,
//       completed_exercises: 1,
//       exercises: [
//         {
//           exercise_id: 133,
//           word_id: 133,
//           question: 'What is the meaning of Lampe',
//           completed: false,
//         },
//       ],
//       progress_percentage: 33.33,
//     },
//     {
//       lesson_id: 27,
//       cefr_level: 'A1',
//       total_exercises: 4,
//       completed_exercises: 2,
//       exercises: [
//         {
//           exercise_id: 134,
//           word_id: 134,
//           question: 'What is the meaning of Kühlschrank',
//           completed: true,
//         },
//       ],
//       progress_percentage: 50,
//     },
//     {
//       lesson_id: 28,
//       cefr_level: 'A1',
//       total_exercises: 5,
//       completed_exercises: 4,
//       exercises: [
//         {
//           exercise_id: 135,
//           word_id: 135,
//           question: 'What is the meaning of Bett',
//           completed: true,
//         },
//       ],
//       progress_percentage: 80,
//     },
//   ];

//   errorMessage = '';
//   cefrProgress: CefrProgressResponse['cefr_levels'] = [];
//   lessonProgress: LessonProgress[] = [];
//   selectedCefrLevel: string | null = null;

//   // Line Chart for CEFR Progress
//   public cefrLineChartData: ChartData<'line'> = {
//     labels: [],
//     datasets: [],
//   };

//   public cefrLineChartOptions!: ChartOptions<'line'>;

//   public cefrLineChartType: 'line' = 'line'; // Directly assign the string literal 'line'

//   // Bar Chart for Lesson Progress
//   public lessonBarChartData: ChartData<'bar'> = {
//     labels: [],
//     datasets: [],
//   };
//   public lessonBarChartOptions: ChartOptions<'bar'> = {
//     responsive: true,
//   };
//   public lessonBarChartType: 'bar' = 'bar'; // Directly assign the string literal 'bar'

//   private themeSubscription!: Subscription;

//   constructor(private themeService: ThemeService) {}

//   ngOnInit(): void {
//     // Use the mock data to populate the charts
//     this.cefrProgress = this.mockCefrData.cefr_levels;
//     this.setupCefrLineChart();
//     this.applyThemeToCharts();

//     // Subscribe to theme changes and update chart options accordingly
//     this.themeSubscription = this.themeService
//       .getThemeObservable()
//       .subscribe(() => {
//         this.applyThemeToCharts();
//       });
//   }

//   ngOnDestroy(): void {
//     // Unsubscribe to prevent memory leaks
//     if (this.themeSubscription) {
//       this.themeSubscription.unsubscribe();
//     }
//   }

//   private applyThemeToCharts(): void {
//     const textColor = getComputedStyle(document.body)
//       .getPropertyValue('--text-color')
//       .trim();
//     const borderColor = getComputedStyle(document.body)
//       .getPropertyValue('--border-color')
//       .trim();

//     this.cefrLineChartOptions = {
//       responsive: true,
//       scales: {
//         x: {
//           ticks: {
//             color: textColor, // Use dynamically fetched color
//           },
//           grid: {
//             color: borderColor, // Use dynamically fetched color
//           },
//         },
//         y: {
//           ticks: {
//             color: textColor, // Use dynamically fetched color
//             callback: function (value) {
//               return value + '%'; // Adds percentage symbol to y-axis labels
//             },
//           },
//           grid: {
//             color: borderColor, // Use dynamically fetched color
//           },
//         },
//       },
//       plugins: {
//         legend: {
//           labels: {
//             color: textColor, // Use dynamically fetched color
//           },
//         },
//       },
//     };

//     this.lessonBarChartOptions = {
//       responsive: true,
//       scales: {
//         x: {
//           ticks: {
//             color: textColor, // Use dynamically fetched color
//           },
//           grid: {
//             color: borderColor, // Use dynamically fetched color
//           },
//         },
//         y: {
//           ticks: {
//             color: textColor, // Use dynamically fetched color
//             callback: function (value) {
//               return value + '%'; // Adds percentage symbol to y-axis labels
//             },
//           },
//           grid: {
//             color: borderColor, // Use dynamically fetched color
//           },
//         },
//       },
//       plugins: {
//         legend: {
//           labels: {
//             color: textColor, // Use dynamically fetched color
//           },
//         },
//       },
//     };
//   }

//   onSelectCefrLevel(event: Event): void {
//     const selectElement = event.target as HTMLSelectElement;
//     this.selectedCefrLevel = selectElement.value;

//     // Log selected CEFR level
//     console.log('Selected CEFR Level:', this.selectedCefrLevel);

//     // Filter lesson data based on the selected CEFR level
//     const filteredLessons = this.mockLessonData.filter(
//       (lesson) => lesson.cefr_level === this.selectedCefrLevel
//     );

//     // If lessons for the selected CEFR level exist, update the lessonProgress
//     if (filteredLessons.length > 0) {
//       this.lessonProgress = filteredLessons;
//     } else {
//       this.lessonProgress = [];
//       this.errorMessage = 'No info found for the selected CEFR level';
//       setTimeout(() => {
//         this.errorMessage = '';
//       }, 5000);
//     }

//     this.setupLessonBarChart();
//   }

//   private setupCefrLineChart(): void {
//     this.cefrLineChartData.labels = this.cefrProgress.map(
//       (cefr) => cefr.cefr_level
//     );
//     this.cefrLineChartData.datasets = [
//       {
//         data: this.cefrProgress.map((cefr) => cefr.progress_percentage),
//         label: 'CEFR Progress (%)',
//         borderColor: '#42A5F5',
//         backgroundColor: 'white',
//       },
//     ];
//   }

//   private setupLessonBarChart(): void {
//     this.lessonBarChartData.labels = this.lessonProgress.map(
//       (lesson) => `${lesson.lesson_id}`
//     );
//     this.lessonBarChartData.datasets = [
//       {
//         data: this.lessonProgress.map((lesson) => lesson.progress_percentage),
//         label: 'Lesson Progress (%)',
//         backgroundColor: '#FFA726',
//         hoverBackgroundColor: '#FF7043',
//       },
//     ];
//   }
// }
