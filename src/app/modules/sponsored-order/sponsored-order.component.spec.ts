import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredOrderComponent } from './sponsored-order.component';

describe('SponsoredOrderComponent', () => {
  let component: SponsoredOrderComponent;
  let fixture: ComponentFixture<SponsoredOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsoredOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
