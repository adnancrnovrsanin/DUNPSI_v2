import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementTypeIconComponent } from './requirement-type-icon.component';

describe('RequirementTypeIconComponent', () => {
  let component: RequirementTypeIconComponent;
  let fixture: ComponentFixture<RequirementTypeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementTypeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
