import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerProjectHistoryComponent } from './manager-project-history.component';

describe('ManagerProjectHistoryComponent', () => {
  let component: ManagerProjectHistoryComponent;
  let fixture: ComponentFixture<ManagerProjectHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerProjectHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerProjectHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
