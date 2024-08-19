import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Lesson } from '../../../core/models/lesson.model';
import { Word } from '../../../core/models/word.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-exercises-management',
  standalone: true,
  imports: [],
  templateUrl: './exercises-management.component.html',
  styleUrl: './exercises-management.component.css',
})
export class ExercisesManagementComponent {
  exerciseForm!: FormGroup;
  // To Do Make use of lesson endpoint
  cefrLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  lessons: Lesson[] = [];
  words: Word[] = [];
  displayedColumns: string[] = [
    'german_word',
    'part_of_speech',
    'example',
    'actions',
  ];

  dataSource = new MatTableDataSource<Word>(this.words);

  // Pagination and Sorting
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  totalWords = 0;
  pageSize = 20;

  constructor(private fb: FormBuilder) {}
}
