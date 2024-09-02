import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { fakeAsync, tick } from '@angular/core/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatExpansionModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        NoopAnimationsModule,
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with an empty selection', () => {
    const exerciseOptionControl = component.exerciseForm.get('exerciseOption');
    expect(exerciseOptionControl).toBeTruthy();
    expect(exerciseOptionControl?.value).toBe('');
    expect(exerciseOptionControl?.valid).toBeFalsy();
  });

  it('should display correct feedback when the correct option is selected', () => {
    const correctOption = component.exercises[0].correctOption;
    component.exerciseForm.get('exerciseOption')?.setValue(correctOption);

    component.submitAnswer();

    expect(component.feedbackMessage).toContain('Correct!');
    expect(component.feedbackColor).toBe('green');
  });

  it('should display incorrect feedback when the incorrect option is selected', () => {
    const incorrectOption = component.exercises[0].options.find(
      (option) => option !== component.exercises[0].correctOption
    );
    component.exerciseForm.get('exerciseOption')?.setValue(incorrectOption);

    component.submitAnswer();

    expect(component.feedbackMessage).toContain('Incorrect!');
    expect(component.feedbackColor).toBe('red');
  });

  it('should reset the form and clear feedback after submission', fakeAsync(() => {
    const correctOption = component.exercises[0].correctOption;
    component.exerciseForm.get('exerciseOption')?.setValue(correctOption);

    component.submitAnswer();

    tick(3000);

    expect(component.exerciseForm.get('exerciseOption')?.value).toBe(null);
    expect(component.feedbackMessage).toBe('');
    expect(component.feedbackColor).toBe('');
  }));

  it('should render the exercise question and options', () => {
    const questionElement = fixture.debugElement.query(
      By.css('.exercise-question')
    ).nativeElement;
    const optionElements = fixture.debugElement.queryAll(
      By.css('.option label')
    );

    expect(questionElement.textContent).toContain(
      component.exercises[0].question
    );
    expect(optionElements.length).toBe(component.exercises[0].options.length);
    component.exercises[0].options.forEach((option, index) => {
      expect(optionElements[index].nativeElement.textContent).toBe(option);
    });
  });

  it('should disable the submit button if no option is selected', () => {
    const submitButton = fixture.debugElement.query(
      By.css('.submit-button')
    ).nativeElement;

    expect(submitButton.disabled).toBeTruthy(); // Submit button should be disabled initially

    const exerciseOptionControl = component.exerciseForm.get('exerciseOption');
    exerciseOptionControl?.setValue('Climate');
    exerciseOptionControl?.markAsDirty();
    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalsy();
  });
});
