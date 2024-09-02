import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsComponent } from './tips.component';
import { By } from '@angular/platform-browser';

describe('TipsComponent', () => {
  let component: TipsComponent;
  let fixture: ComponentFixture<TipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(titleElement.textContent).toContain(
      'Tips for Maximizing Your Learning with VokabelProfi'
    );
  });

  it('should render all tips with correct headings', () => {
    const tipsHeadings = fixture.debugElement.queryAll(By.css('.tip h3'));

    expect(tipsHeadings.length).toBe(7);
    const expectedHeadings = [
      '1. Set Clear Goals',
      '2. Consistency is Key',
      '3. Use Progress Tracking',
      '4. Diversify Your Learning',
      '5. Take Advantage of Audio Features',
      '6. Review Regularly',
      '7. Utilize the CEFR Structure',
    ];

    tipsHeadings.forEach((heading, index) => {
      expect(heading.nativeElement.textContent).toContain(
        expectedHeadings[index]
      );
    });
  });

  it('should render all tips with correct descriptions', () => {
    const tipsDescriptions = fixture.debugElement.queryAll(By.css('.tip p'));
    expect(tipsDescriptions.length).toBe(7);
  });
});
