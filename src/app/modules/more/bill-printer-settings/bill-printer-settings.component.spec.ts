import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPrinterSettingsComponent } from './bill-printer-settings.component';

describe('BillPrinterSettingsComponent', () => {
  let component: BillPrinterSettingsComponent;
  let fixture: ComponentFixture<BillPrinterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillPrinterSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillPrinterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
