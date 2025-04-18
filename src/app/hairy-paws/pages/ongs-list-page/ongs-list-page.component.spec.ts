import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngsListPageComponent } from './ongs-list-page.component';

describe('OngsListPageComponent', () => {
  let component: OngsListPageComponent;
  let fixture: ComponentFixture<OngsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngsListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
