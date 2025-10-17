import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tablist } from './tablist.component';

describe('Tablist', () => {
  let component: Tablist;
  let fixture: ComponentFixture<Tablist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tablist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tablist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
