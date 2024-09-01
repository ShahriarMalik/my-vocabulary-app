import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadingService } from './core/services/loading.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let loadingService: LoadingService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        LoadingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
      ],
    }).compileComponents();

    loadingService = TestBed.inject(LoadingService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should display the loading bar when isLoading$ is true', () => {
    const fixture = TestBed.createComponent(AppComponent);

    loadingService.loading$ = of(true);

    fixture.detectChanges();

    const complied = fixture.nativeElement as HTMLElement;
    const loadingBar = complied.querySelector('mat-progress-bar');

    expect(loadingBar).not.toBeNull();
    expect(loadingBar?.classList).toContain(
      'mdc-linear-progress--indeterminate'
    );
  });

  it('should render the NavbarComponent and FooterComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navbar = compiled.querySelector('app-navbar');
    const footer = compiled.querySelector('app-footer');

    expect(navbar).not.toBeNull();
    expect(footer).not.toBeNull();
  });

  it('should contain a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.nativeElement as HTMLElement;

    const routerOutlet = compiled.querySelector('router-outlet');

    expect(routerOutlet).not.toBeNull();
  });
});
