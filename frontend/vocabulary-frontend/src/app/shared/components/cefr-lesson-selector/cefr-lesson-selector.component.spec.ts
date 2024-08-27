import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CefrLessonSelectorComponent } from './cefr-lesson-selector.component';

describe('CefrLessonSelectorComponent', () => {
  let component: CefrLessonSelectorComponent;
  let fixture: ComponentFixture<CefrLessonSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CefrLessonSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CefrLessonSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
