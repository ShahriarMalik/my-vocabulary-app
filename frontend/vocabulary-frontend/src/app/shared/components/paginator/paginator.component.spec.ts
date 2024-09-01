import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { By } from '@angular/platform-browser';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pageSize).toBe(4);
    expect(component.currentPage).toBe(0);
    expect(component.totalPages).toBe(0);
  });

  it('should emit pageChange event on previous page', () => {
    const pageChangeSpy = jest
      .spyOn(component.pageChange, 'emit')
      .mockImplementation(() => {});
    component.currentPage = 1;
    component.onPreviousPage();

    expect(pageChangeSpy).toHaveBeenCalledWith(0);
    expect(component.currentPage).toBe(0);
  });

  it('should emit pageChange event on next page', () => {
    const pageChangeSpy = jest
      .spyOn(component.pageChange, 'emit')
      .mockImplementation(() => {});

    component.length = 10;
    component.pageSize = 4;
    component.currentPage = 0;
    component.onNextPage();

    expect(pageChangeSpy).toHaveBeenCalledWith(1);
    expect(component.currentPage).toBe(1);
  });

  it('should emit pageSizeChange and pageChange events on page size change', () => {
    const pageSizeChangeSpy = jest
      .spyOn(component.pageSizeChange, 'emit')
      .mockImplementation(() => {});
    const pageChangeSpy = jest
      .spyOn(component.pageChange, 'emit')
      .mockImplementation(() => {});
    const event = { target: { value: '8' } } as any;
    component.onPageSizeChange(event);

    expect(component.pageSize).toBe(8);
    expect(component.currentPage).toBe(0);
    expect(pageSizeChangeSpy).toHaveBeenCalledWith(8);
    expect(pageChangeSpy).toHaveBeenCalledWith(0);
  });

  it('should disable previous button on the first page', () => {
    component.currentPage = 0;
    fixture.detectChanges();
    const prevButton = fixture.debugElement.query(
      By.css('button:first-child')
    ).nativeElement;
    expect(prevButton.disabled).toBe(true);
  });

  it('should disable next button on the last page', () => {
    // Set up the component with 12 items, 4 items per page (3 pages total)
    component.pageSize = 4;
    component.length = 12;
    component.currentPage = 2;

    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(
      By.css('button[aria-label="Next page"]')
    ).nativeElement;

    expect(nextButton.disabled).toBe(true);
  });
});
