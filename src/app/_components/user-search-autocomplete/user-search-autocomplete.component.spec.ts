import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchAutocompleteComponent } from './user-search-autocomplete.component';

describe('UserSearchAutocompleteComponent', () => {
  let component: UserSearchAutocompleteComponent;
  let fixture: ComponentFixture<UserSearchAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSearchAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
