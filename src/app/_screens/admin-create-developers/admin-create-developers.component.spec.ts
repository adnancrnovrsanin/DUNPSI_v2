import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateDevelopersComponent } from './admin-create-developers.component';

describe('AdminCreateDevelopersComponent', () => {
  let component: AdminCreateDevelopersComponent;
  let fixture: ComponentFixture<AdminCreateDevelopersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateDevelopersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateDevelopersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
