import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletInfoComponent } from './outlet-info.component';

describe('OutletInfoComponent', () => {
  let component: OutletInfoComponent;
  let fixture: ComponentFixture<OutletInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutletInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
