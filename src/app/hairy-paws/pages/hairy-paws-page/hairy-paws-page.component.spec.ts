import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairyPawsPageComponent } from './hairy-paws-page.component';

describe('HairyPawsPageComponent', () => {
  let component: HairyPawsPageComponent;
  let fixture: ComponentFixture<HairyPawsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairyPawsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairyPawsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
