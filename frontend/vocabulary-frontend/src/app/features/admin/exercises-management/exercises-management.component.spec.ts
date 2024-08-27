import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseManagementComponent } from './exercises-management.component';

describe('ExerciseManagementComponent', () => {
  let component: ExerciseManagementComponent;
  let fixture: ComponentFixture<ExerciseManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
