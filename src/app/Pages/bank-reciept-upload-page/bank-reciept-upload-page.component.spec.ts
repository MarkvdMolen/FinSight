import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankRecieptUploadPageComponent } from './bank-reciept-upload-page.component';

describe('CsvUploadComponent', () => {
  let component: BankRecieptUploadPageComponent;
  let fixture: ComponentFixture<BankRecieptUploadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankRecieptUploadPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankRecieptUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
