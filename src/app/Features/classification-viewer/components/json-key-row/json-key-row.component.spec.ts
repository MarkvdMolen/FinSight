import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonKeyRowComponent } from './json-key-row.component';

describe('JsonKeyRowComponent', () => {
  let component: JsonKeyRowComponent;
  let fixture: ComponentFixture<JsonKeyRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonKeyRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonKeyRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
