import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { MatIconRegistry } from '@angular/material/icon';
import { By, DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let iconRegistry: MatIconRegistry;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    const mockIconRegistry = {
      addSvgIcon: jest.fn(),
      // Mocking getNamedSvgIcon to return an observable since it returns an Observable in Angular Material
      getNamedSvgIcon: jest.fn().mockReturnValue(of('mockSvgIcon')),
    };

    const mockSanitizer = {
      // Mock the DomSanitizer's bypassSecurityTrustResourceUrl method to simply return the URL.
      bypassSecurityTrustResourceUrl: jest.fn((url) => url),
    };
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: MatIconRegistry, useValue: mockIconRegistry },
        { provide: DomSanitizer, useValue: mockSanitizer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    iconRegistry = TestBed.inject(MatIconRegistry);
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct year', () => {
    const span = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(span.textContent).toContain(new Date().getFullYear().toString());
  });

  it('should register all SVG icons', () => {
    expect(iconRegistry.addSvgIcon).toHaveBeenCalledTimes(3); // Check that addSvgIcon was called three times

    // Get all calls to addSvgIcon and verify each one
    const calls = (iconRegistry.addSvgIcon as jest.Mock).mock.calls;

    // First call: GitHub icon
    expect(calls[0]).toEqual(['github', 'assets/icons/github.svg']);

    // Second call: LinkedIn icon
    expect(calls[1]).toEqual(['linkedin', 'assets/icons/linkedin.svg']);

    // Third call: Xing icon
    expect(calls[2]).toEqual(['xing', 'assets/icons/xing.svg']);
  });

  it('should contain the correct GitHun link', () => {
    const gitHubLink = fixture.debugElement.query(
      By.css('a[aria-label="GitHub"]')
    ).nativeElement;

    expect(gitHubLink.href).toContain('https://github.com/ShahriarMalik');
  });

  it('should contain the correctLinkedIn link', () => {
    const linkedInLink = fixture.debugElement.query(
      By.css('a[aria-label="LinkedIn"]')
    ).nativeElement;

    expect(linkedInLink.href).toContain(
      'https://www.linkedin.com/in/shahriar-malik-46a09411a/'
    );
  });

  it('should contain the correct Xing link', () => {
    const xingLink = fixture.debugElement.query(
      By.css('a[aria-label="Xing"]')
    ).nativeElement;
    expect(xingLink.href).toContain(
      'https://www.xing.com/profile/Shahriar_Malik/web_profiles'
    );
  });
});
