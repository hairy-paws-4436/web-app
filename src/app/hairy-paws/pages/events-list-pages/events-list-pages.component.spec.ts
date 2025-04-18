import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListPagesComponent } from './events-list-pages.component';

describe('EventsListPagesComponent', () => {
  let component: EventsListPagesComponent;
  let fixture: ComponentFixture<EventsListPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsListPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsListPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
