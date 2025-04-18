import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationItemsComponent } from './donation-items.component';

describe('DonationItemsComponent', () => {
  let component: DonationItemsComponent;
  let fixture: ComponentFixture<DonationItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
