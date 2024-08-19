import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesManagementComponent } from './exercises-management.component';

describe('ExercisesManagementComponent', () => {
  let component: ExercisesManagementComponent;
  let fixture: ComponentFixture<ExercisesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercisesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
