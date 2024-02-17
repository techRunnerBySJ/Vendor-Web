import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPointOfContactDialogComponent } from './view-point-of-contact-dialog.component';

describe('ViewPointOfContactComponent', () => {
  let component: ViewPointOfContactDialogComponent;
  let fixture: ComponentFixture<ViewPointOfContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPointOfContactDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPointOfContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
