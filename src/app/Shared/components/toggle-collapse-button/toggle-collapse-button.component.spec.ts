import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCollapseButtonComponent } from './toggle-collapse-button.component';

describe('ToggleCollapseButtonComponent', () => {
  let component: ToggleCollapseButtonComponent;
  let fixture: ComponentFixture<ToggleCollapseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleCollapseButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleCollapseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
