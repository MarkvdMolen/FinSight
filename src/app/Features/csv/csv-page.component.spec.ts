import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvPageComponent } from './csv-page.component';

describe('CsvPageComponent', () => {
  let component: CsvPageComponent;
  let fixture: ComponentFixture<CsvPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
