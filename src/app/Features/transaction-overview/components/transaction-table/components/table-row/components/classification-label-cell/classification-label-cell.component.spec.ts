import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationLabelCellComponent } from './classification-label-cell.component';

describe('ClassificationLabelCellComponent', () => {
  let component: ClassificationLabelCellComponent;
  let fixture: ComponentFixture<ClassificationLabelCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassificationLabelCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassificationLabelCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
