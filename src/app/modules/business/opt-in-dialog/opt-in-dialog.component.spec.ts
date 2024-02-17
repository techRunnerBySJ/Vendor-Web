import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptInDialogComponent } from './opt-in-dialog.component';

describe('OptInDialogComponent', () => {
  let component: OptInDialogComponent;
  let fixture: ComponentFixture<OptInDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptInDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
