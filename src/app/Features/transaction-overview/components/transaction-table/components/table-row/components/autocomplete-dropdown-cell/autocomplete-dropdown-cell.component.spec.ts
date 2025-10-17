import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteDropdownCellComponent } from './autocomplete-dropdown-cell.component';

describe('AutocompleteDropdownComponent', () => {
  let component: AutocompleteDropdownCellComponent;
  let fixture: ComponentFixture<AutocompleteDropdownCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteDropdownCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteDropdownCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
