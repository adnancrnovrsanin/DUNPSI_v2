import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerRequestDetailsComponent } from './project-manager-request-details.component';

describe('ProjectManagerRequestDetailsComponent', () => {
  let component: ProjectManagerRequestDetailsComponent;
  let fixture: ComponentFixture<ProjectManagerRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectManagerRequestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagerRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
