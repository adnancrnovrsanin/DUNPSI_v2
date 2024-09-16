import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateProjectManagersComponent } from './admin-create-project-managers.component';

describe('AdminCreateProjectManagersComponent', () => {
  let component: AdminCreateProjectManagersComponent;
  let fixture: ComponentFixture<AdminCreateProjectManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateProjectManagersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateProjectManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
