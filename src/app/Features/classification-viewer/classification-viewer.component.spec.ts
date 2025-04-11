import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationViewerComponent } from './classification-viewer.component';

describe('ClassificationViewerComponent', () => {
  let component: ClassificationViewerComponent;
  let fixture: ComponentFixture<ClassificationViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassificationViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassificationViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
