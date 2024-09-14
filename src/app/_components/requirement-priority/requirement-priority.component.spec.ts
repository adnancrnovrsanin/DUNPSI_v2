import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementPriorityComponent } from './requirement-priority.component';

describe('RequirementPriorityComponent', () => {
  let component: RequirementPriorityComponent;
  let fixture: ComponentFixture<RequirementPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementPriorityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
