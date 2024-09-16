import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateProductManagersComponent } from './admin-create-product-managers.component';

describe('AdminCreateProductManagersComponent', () => {
  let component: AdminCreateProductManagersComponent;
  let fixture: ComponentFixture<AdminCreateProductManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateProductManagersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateProductManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
