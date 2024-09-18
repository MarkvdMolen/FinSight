import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingFilesComponent } from './missing-files.component';

describe('MissingFilesComponent', () => {
  let component: MissingFilesComponent;
  let fixture: ComponentFixture<MissingFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
