import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectsActionNeededComponent } from './client-projects-action-needed.component';

describe('ClientProjectsActionNeededComponent', () => {
  let component: ClientProjectsActionNeededComponent;
  let fixture: ComponentFixture<ClientProjectsActionNeededComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProjectsActionNeededComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProjectsActionNeededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
