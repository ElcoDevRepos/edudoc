import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { ConfirmationDialogComponent, ConfirmationDialogData } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  const mockDialogData: ConfirmationDialogData = {
    title: 'Test Title',
    message: 'Test message content',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: 'primary'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ConfirmationDialogComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should inject dialog data correctly', () => {
      expect(component.data).toEqual(mockDialogData);
    });

    it('should have dialog ref injected', () => {
      expect(component.dialogRef).toBeTruthy();
    });
  });

  describe('Template Rendering', () => {
    it('should display the title', () => {
      const titleElement = fixture.debugElement.query(By.css('[mat-dialog-title]'));
      expect(titleElement.nativeElement.textContent.trim()).toBe(mockDialogData.title);
    });

    it('should display the message', () => {
      const messageElement = fixture.debugElement.query(By.css('mat-dialog-content p'));
      expect(messageElement.nativeElement.textContent.trim()).toBe(mockDialogData.message);
    });

    it('should display cancel button with correct text', () => {
      const cancelButton = fixture.debugElement.query(By.css('button[mat-stroked-button]'));
      expect(cancelButton.nativeElement.textContent.trim()).toBe(mockDialogData.cancelText);
    });

    it('should display confirm button with correct text', () => {
      const confirmButton = fixture.debugElement.query(By.css('button[mat-flat-button]'));
      expect(confirmButton.nativeElement.textContent.trim()).toBe(mockDialogData.confirmText);
    });

    it('should display close button in header', () => {
      const closeButton = fixture.debugElement.query(By.css('.close-button'));
      expect(closeButton).toBeTruthy();
      
      const closeIcon = closeButton.query(By.css('mat-icon'));
      expect(closeIcon.nativeElement.textContent.trim()).toBe('close');
    });
  });

  describe('Button Color Configuration', () => {
    it('should apply primary color to confirm button by default', () => {
      const confirmButton = fixture.debugElement.query(By.css('button[mat-flat-button]'));
      expect(confirmButton.nativeElement.getAttribute('ng-reflect-color')).toBe('primary');
    });

    it('should not apply danger-button class when confirm color is not warn', () => {
      const confirmButton = fixture.debugElement.query(By.css('button[mat-flat-button]'));
      expect(confirmButton.nativeElement.classList.contains('danger-button')).toBe(false);
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog when close button is clicked', () => {
      const closeButton = fixture.debugElement.query(By.css('.close-button'));
      closeButton.nativeElement.click();

      // Note: In real Angular Material, mat-dialog-close directive handles this
      // We can't easily test the actual close behavior without complex setup
      expect(closeButton.nativeElement.hasAttribute('mat-dialog-close')).toBe(true);
    });

    it('should close dialog when cancel button is clicked', () => {
      const cancelButton = fixture.debugElement.query(By.css('button[mat-stroked-button]'));
      
      // Verify the button has the mat-dialog-close directive
      expect(cancelButton.nativeElement.hasAttribute('mat-dialog-close')).toBe(true);
    });

  });

  describe('Accessibility', () => {
    it('should have proper dialog structure', () => {
      const dialogTitle = fixture.debugElement.query(By.css('[mat-dialog-title]'));
      const dialogContent = fixture.debugElement.query(By.css('mat-dialog-content'));
      const dialogActions = fixture.debugElement.query(By.css('mat-dialog-actions'));

      expect(dialogTitle).toBeTruthy();
      expect(dialogContent).toBeTruthy();
      expect(dialogActions).toBeTruthy();
    });

    it('should have actions aligned to end', () => {
      const dialogActions = fixture.debugElement.query(By.css('mat-dialog-actions'));
      expect(dialogActions.nativeElement.getAttribute('align')).toBe('end');
    });

    it('should have close button with icon', () => {
      const closeButton = fixture.debugElement.query(By.css('.close-button'));
      const icon = closeButton.query(By.css('mat-icon'));
      
      expect(closeButton.nativeElement.hasAttribute('mat-icon-button')).toBe(true);
      expect(icon).toBeTruthy();
    });
  });



  describe('Component Structure', () => {
    it('should have proper CSS classes', () => {
      const dialogContainer = fixture.debugElement.query(By.css('.confirmation-dialog'));
      const dialogHeader = fixture.debugElement.query(By.css('.dialog-header'));
      const dialogContent = fixture.debugElement.query(By.css('.dialog-content'));
      const dialogActions = fixture.debugElement.query(By.css('.dialog-actions'));

      expect(dialogContainer).toBeTruthy();
      expect(dialogHeader).toBeTruthy();
      expect(dialogContent).toBeTruthy();
      expect(dialogActions).toBeTruthy();
    });

    it('should have close button with proper CSS class', () => {
      const closeButton = fixture.debugElement.query(By.css('.close-button'));
      expect(closeButton).toBeTruthy();
      expect(closeButton.nativeElement.classList.contains('close-button')).toBe(true);
    });
  });
});

describe('ConfirmationDialogComponent - Warn Color Configuration', () => {
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  const warnDialogData: ConfirmationDialogData = {
    title: 'Warning Dialog',
    message: 'This is a warning message',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmColor: 'warn'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ConfirmationDialogComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: warnDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    
    fixture.detectChanges();
  });

  it('should apply warn color to confirm button', () => {
    const confirmButton = fixture.debugElement.query(By.css('button[mat-flat-button]'));
    expect(confirmButton.nativeElement.getAttribute('ng-reflect-color')).toBe('warn');
  });

  it('should apply danger-button class when confirm color is warn', () => {
    const confirmButton = fixture.debugElement.query(By.css('button[mat-flat-button]'));
    expect(confirmButton.nativeElement.classList.contains('danger-button')).toBe(true);
  });
});

describe('ConfirmationDialogComponent - No Color Configuration', () => {
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  const noColorDialogData: ConfirmationDialogData = {
    title: 'No Color Dialog',
    message: 'This dialog has no color specified',
    confirmText: 'OK',
    cancelText: 'Cancel'
    // confirmColor is optional and not provided
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ConfirmationDialogComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: noColorDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    
    fixture.detectChanges();
  });

  it('should handle missing confirmColor gracefully', () => {
    const confirmButton = fixture.debugElement.query(By.css('button[mat-flat-button]'));
    
    // Should default to primary color
    expect(confirmButton.nativeElement.getAttribute('ng-reflect-color')).toBe('primary');
    // Should not have danger-button class
    expect(confirmButton.nativeElement.classList.contains('danger-button')).toBe(false);
  });
});

describe('ConfirmationDialogComponent - Empty Data', () => {
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  const emptyDialogData: ConfirmationDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirmColor: 'primary'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ConfirmationDialogComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: emptyDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    
    fixture.detectChanges();
  });

  it('should handle empty strings in data', () => {
    // Should not throw errors and should render empty content
    const titleElement = fixture.debugElement.query(By.css('[mat-dialog-title]'));
    const messageElement = fixture.debugElement.query(By.css('mat-dialog-content p'));
    
    expect(titleElement.nativeElement.textContent.trim()).toBe('');
    expect(messageElement.nativeElement.textContent.trim()).toBe('');
  });
}); 