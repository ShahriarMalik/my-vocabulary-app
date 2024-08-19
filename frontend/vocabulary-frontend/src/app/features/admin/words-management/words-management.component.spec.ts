import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordManagementComponent } from './words-management.component';

describe('WordManagementComponent', () => {
  let component: WordManagementComponent;
  let fixture: ComponentFixture<WordManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WordManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
