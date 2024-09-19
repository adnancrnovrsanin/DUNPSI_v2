import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnratedRequirementsComponent } from './unrated-requirements.component';

describe('UnratedRequirementsComponent', () => {
  let component: UnratedRequirementsComponent;
  let fixture: ComponentFixture<UnratedRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnratedRequirementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnratedRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
