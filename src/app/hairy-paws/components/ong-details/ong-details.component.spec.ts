import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngDetailsComponent } from './ong-details.component';

describe('OngDetailsComponent', () => {
  let component: OngDetailsComponent;
  let fixture: ComponentFixture<OngDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
