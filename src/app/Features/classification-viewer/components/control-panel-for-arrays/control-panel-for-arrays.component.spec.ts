import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPanelForArraysComponent } from './control-panel-for-arrays.component';

describe('ControlPanelForArraysComponent', () => {
  let component: ControlPanelForArraysComponent;
  let fixture: ComponentFixture<ControlPanelForArraysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlPanelForArraysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlPanelForArraysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
