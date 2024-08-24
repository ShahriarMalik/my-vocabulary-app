import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { CefrProgressResponse } from '../../core/models/cefr-progress.model';
import { LessonProgress } from '../../core/models/lesson-progress.model';
import { ThemeService } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';
import { NoticeComponent } from '../../shared/components/notice/notice.component';
import { ProgressService } from '../../core/services/progress.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, NoticeComponent],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  cefrProgress: CefrProgressResponse['cefr_levels'] = [];
  lessonProgress: LessonProgress[] = [];
  selectedCefrLevel: string | null = null;
  userId!: number;
  isBrowser!: boolean;
  errorMessage = '';
  successMessage = '';

  // Line Chart for CEFR Progress
  public cefrLineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  public cefrLineChartOptions!: ChartOptions<'line'>;

  public cefrLineChartType: 'line' = 'line'; // Directly assign the string literal 'line'

  // Bar Chart for Lesson Progress
  public lessonBarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };
  public lessonBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  public lessonBarChartType: 'bar' = 'bar'; // Directly assign the string literal 'bar'

  private themeSubscription!: Subscription;

  constructor(
    private themeService: ThemeService,
    private progressService: ProgressService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.authService.getUserIdFromToken()) {
      this.successMessage = $localize`:@@logInToSeeProgress:You need to log in to view your progress. Please log in to continue.`;

      setTimeout(() => {
        this.successMessage = '';
        this.router.navigate(['/auth/login']);
      }, 5000);
      return;
    } else {
      this.userId = Number(this.authService.getUserIdFromToken());
    }

    setTimeout(() => {
      this.progressService.getCefrProgress(this.userId).subscribe({
        next: (response) => {
          console.log('getCefrProgress: ', response);
          this.cefrProgress = response.cefr_levels;
          this.setupCefrLineChart();
          this.applyThemeToCharts();
        },
        error: (error) => {
          console.error(error);
        },
      });
    }, 0);

    // Subscribe to theme changes and update chart options accordingly
    this.themeSubscription = this.themeService
      .getThemeObservable()
      .subscribe(() => {
        this.applyThemeToCharts();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private applyThemeToCharts(): void {
    const textColor = getComputedStyle(document.body)
      .getPropertyValue('--text-color')
      .trim();
    const borderColor = getComputedStyle(document.body)
      .getPropertyValue('--border-color')
      .trim();

    this.cefrLineChartOptions = {
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: textColor, // Use dynamically fetched color
          },
          grid: {
            color: borderColor, // Use dynamically fetched color
          },
        },
        y: {
          ticks: {
            color: textColor, // Use dynamically fetched color
            callback: function (value) {
              return value + '%'; // Adds percentage symbol to y-axis labels
            },
          },
          grid: {
            color: borderColor, // Use dynamically fetched color
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: textColor, // Use dynamically fetched color
          },
        },
      },
    };

    this.lessonBarChartOptions = {
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: textColor, // Use dynamically fetched color
          },
          grid: {
            color: borderColor, // Use dynamically fetched color
          },
        },
        y: {
          ticks: {
            color: textColor, // Use dynamically fetched color
            callback: function (value) {
              return value + '%'; // Adds percentage symbol to y-axis labels
            },
          },
          grid: {
            color: borderColor, // Use dynamically fetched color
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: textColor, // Use dynamically fetched color
          },
        },
      },
    };
  }

  onSelectCefrLevel(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCefrLevel = selectElement.value;

    // Log selected CEFR level
    console.log('Selected CEFR Level:', this.selectedCefrLevel);

    this.progressService
      .getLessonProgress(this.userId, this.selectedCefrLevel)
      .subscribe({
        next: (response) => {
          this.lessonProgress = response.lessons;

          if (this.lessonProgress.length > 0) {
            this.setupLessonBarChart();
          } else {
            this.errorMessage = $localize`:@@noInfoProgress:No info found for the selected CEFR level`;
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000);
          }
        },
        error: (error) => {
          console.log(error);
          this.lessonProgress = [];
          this.errorMessage = $localize`:@@noInfoProgress:No info found for the selected CEFR level`;
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        },
      });
  }

  private setupCefrLineChart(): void {
    this.cefrLineChartData.labels = this.cefrProgress.map(
      (cefr) => cefr.cefr_level
    );
    this.cefrLineChartData.datasets = [
      {
        data: this.cefrProgress.map((cefr) => cefr.progress_percentage),
        label: 'CEFR Progress (%)',
        borderColor: '#42A5F5',
        backgroundColor: 'white',
      },
    ];
  }

  private setupLessonBarChart(): void {
    console.log('Setting up lesson bar chart with data:', this.lessonProgress);

    this.lessonBarChartData.labels = this.lessonProgress.map(
      (lesson) => `L ${lesson.lesson_id}`
    );

    this.lessonBarChartData.datasets = [
      {
        data: this.lessonProgress.map((lesson) => lesson.progress_percentage),
        label: 'Lesson Progress (%)',
        backgroundColor: '#FFA726',
        hoverBackgroundColor: '#FF7043',
      },
    ];

    console.log('Lesson bar chart data:', this.lessonBarChartData);
  }
}
