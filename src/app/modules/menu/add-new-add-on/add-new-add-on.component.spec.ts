import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAddOnComponent } from './add-new-add-on.component';

describe('AddNewAddOnComponent', () => {
  let component: AddNewAddOnComponent;
  let fixture: ComponentFixture<AddNewAddOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAddOnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAddOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
