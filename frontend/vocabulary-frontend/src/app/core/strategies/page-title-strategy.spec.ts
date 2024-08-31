import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PageTitleStrategy } from './page-title-strategy';

describe('PageTitleStrategy', () => {
  let pageTitleStrategy: PageTitleStrategy;
  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Title, PageTitleStrategy],
    });

    pageTitleStrategy = TestBed.inject(PageTitleStrategy);
    titleService = TestBed.inject(Title);
  });

  it('should set the page title with the given route title', () => {
    const mockRouteSnapshot: ActivatedRouteSnapshot = {
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: { title: 'Home' },
      outlet: 'primary',
      component: null,
      routeConfig: null,
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: {} as any,
      queryParamMap: {} as any,
      toString: jest.fn(),
      title: 'Home', // Adding the title property explicitly
    };

    const mockRouterStateSnapshot = {
      url: '/home',
      root: mockRouteSnapshot,
    } as RouterStateSnapshot;

    const setTitleSpy = jest.spyOn(titleService, 'setTitle');

    // Mock buildTitle to return 'Home'
    jest.spyOn(pageTitleStrategy, 'buildTitle').mockReturnValue('Home');

    pageTitleStrategy.updateTitle(mockRouterStateSnapshot);

    expect(setTitleSpy).toHaveBeenCalledWith('Home | VokabelProfi');
  });

  it('should not set the title if the route has no title', () => {
    const mockRouteSnapshot: ActivatedRouteSnapshot = {
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: { title: undefined },
      outlet: 'primary',
      component: null,
      routeConfig: null,
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: {} as any,
      queryParamMap: {} as any,
      toString: jest.fn(),
      title: undefined, // Explicitly setting title to undefined
    };

    const mockRouterStateSnapshot = {
      url: '/home',
      root: mockRouteSnapshot,
    } as RouterStateSnapshot;

    const setTitleSpy = jest.spyOn(titleService, 'setTitle');

    // Mock buildTitle to return undefined
    jest.spyOn(pageTitleStrategy, 'buildTitle').mockReturnValue(undefined);

    pageTitleStrategy.updateTitle(mockRouterStateSnapshot);

    expect(setTitleSpy).not.toHaveBeenCalled();
  });
});
