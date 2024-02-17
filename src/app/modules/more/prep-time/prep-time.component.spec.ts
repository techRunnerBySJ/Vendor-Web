import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepTimeComponent } from './prep-time.component';

describe('PrepTimeComponent', () => {
  let component: PrepTimeComponent;
  let fixture: ComponentFixture<PrepTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
