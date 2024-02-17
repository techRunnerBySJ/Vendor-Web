import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredRiderDialogComponent } from './sponsored-rider-dialog.component';

describe('SponsoredRiderDialogComponent', () => {
  let component: SponsoredRiderDialogComponent;
  let fixture: ComponentFixture<SponsoredRiderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsoredRiderDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredRiderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
