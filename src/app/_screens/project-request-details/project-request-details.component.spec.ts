import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRequestDetailsComponent } from './project-request-details.component';

describe('ProjectRequestDetailsComponent', () => {
  let component: ProjectRequestDetailsComponent;
  let fixture: ComponentFixture<ProjectRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectRequestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
