import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerRequestsComponent } from './project-manager-requests.component';

describe('ProjectManagerRequestsComponent', () => {
  let component: ProjectManagerRequestsComponent;
  let fixture: ComponentFixture<ProjectManagerRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectManagerRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
