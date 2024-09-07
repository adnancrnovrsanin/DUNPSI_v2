import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsRequestsComponent } from './projects-requests.component';

describe('ProjectsRequestsComponent', () => {
  let component: ProjectsRequestsComponent;
  let fixture: ComponentFixture<ProjectsRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
