import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsScreenComponent } from './requirements-screen.component';

describe('RequirementsScreenComponent', () => {
  let component: RequirementsScreenComponent;
  let fixture: ComponentFixture<RequirementsScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementsScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
