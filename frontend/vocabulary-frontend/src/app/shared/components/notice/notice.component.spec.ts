import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeComponent } from './notice.component';
import { By } from '@angular/platform-browser';

describe('NoticeComponent', () => {
  let component: NoticeComponent;
  let fixture: ComponentFixture<NoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.message).toBe('');
    expect(component.isError).toBe(false);
  });

  it('should display the message and apply success styles when isError is false', () => {
    component.message = 'Success message';
    component.isError = false;

    fixture.detectChanges();

    const messageDiv = fixture.debugElement.query(
      By.css('.message')
    ).nativeElement;

    expect(messageDiv).toBeTruthy();
    expect(messageDiv.textContent).toContain('Success message');
    expect(messageDiv.style.opacity).toBe('1');
    expect(messageDiv.style.height).toBe('auto');
    expect(messageDiv.style.overflow).toBe('visible');
    expect(messageDiv.classList).toContain('success');
    expect(messageDiv).not.toContain('error');
  });

  it('should display the message and apply success styles when isError is true', () => {
    component.message = 'Error message';
    component.isError = true;

    fixture.detectChanges();

    const messageDiv = fixture.debugElement.query(
      By.css('.message')
    ).nativeElement;

    expect(messageDiv).toBeTruthy();
    expect(messageDiv.textContent).toContain('Error message');
    expect(messageDiv.style.opacity).toBe('1');
    expect(messageDiv.style.height).toBe('auto');
    expect(messageDiv.style.overflow).toBe('visible');
    expect(messageDiv.classList).toContain('error');
    expect(messageDiv).not.toContain('success');
  });
});
