import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationOverviewComponent } from './classification-overview.component';

describe('ClassificationOverviewComponent', () => {
  let component: ClassificationOverviewComponent;
  let fixture: ComponentFixture<ClassificationOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassificationOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassificationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
