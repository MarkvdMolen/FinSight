import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseIncomeLineChartComponent } from './expense-income-line-chart.component';

describe('ExpenseIncomeLineChartComponent', () => {
  let component: ExpenseIncomeLineChartComponent;
  let fixture: ComponentFixture<ExpenseIncomeLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseIncomeLineChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseIncomeLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
