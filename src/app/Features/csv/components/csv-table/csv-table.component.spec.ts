import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvTableComponent } from './csv-table.component';

describe('CsvTableComponent', () => {
  let component: CsvTableComponent;
  let fixture: ComponentFixture<CsvTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
