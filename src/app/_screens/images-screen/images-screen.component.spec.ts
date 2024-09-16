import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesScreenComponent } from './images-screen.component';

describe('ImagesScreenComponent', () => {
  let component: ImagesScreenComponent;
  let fixture: ComponentFixture<ImagesScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
