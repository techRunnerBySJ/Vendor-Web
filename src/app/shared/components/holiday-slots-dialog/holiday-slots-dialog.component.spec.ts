import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaySlotsDialogComponent } from './holiday-slots-dialog.component';

describe('HolidaySlotsDialogComponent', () => {
  let component: HolidaySlotsDialogComponent;
  let fixture: ComponentFixture<HolidaySlotsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaySlotsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaySlotsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
