import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxActionsComponent } from './tx-actions.component';

describe('TxActionsComponent', () => {
  let component: TxActionsComponent;
  let fixture: ComponentFixture<TxActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TxActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
