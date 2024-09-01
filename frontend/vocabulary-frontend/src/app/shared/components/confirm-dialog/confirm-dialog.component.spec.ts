import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mocked } from 'jest-mock';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefMock: Mocked<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    // Create a mock for MatDialogRef using Jest, and cast it appropriately
    dialogRefMock = {
      close: jest.fn(),
    } as unknown as Mocked<MatDialogRef<ConfirmDialogComponent>>;

    const mockDialogData = { title: 'Confirm', message: 'Are you sure?' };

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title and message', () => {
    const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    const messageElement = fixture.debugElement.query(
      By.css('p')
    ).nativeElement;

    expect(titleElement.textContent).toBe('Confirm');
    expect(messageElement.textContent).toBe('Are you sure?');
  });

  it('should close the dialog with true when confirm button is clicked', () => {
    const confirmButton = fixture.debugElement.query(
      By.css('button[color="primary"]')
    ).nativeElement;

    confirmButton.click();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when confirm button cliked', () => {
    const cancelButton = fixture.debugElement.query(
      By.css('button:not([color="primary"])')
    ).nativeElement;

    cancelButton.click();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });
});
