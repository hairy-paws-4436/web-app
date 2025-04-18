import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationActionComponent } from './notification-action.component';

describe('NotificationActionComponent', () => {
  let component: NotificationActionComponent;
  let fixture: ComponentFixture<NotificationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
