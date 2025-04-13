import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPanelForObjectsComponent } from './control-panel-for-objects.component';

describe('ControlPanelForObjectsComponent', () => {
  let component: ControlPanelForObjectsComponent;
  let fixture: ComponentFixture<ControlPanelForObjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlPanelForObjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlPanelForObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
