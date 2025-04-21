import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngCardComponent } from './ong-card.component';

describe('OngCardComponent', () => {
  let component: OngCardComponent;
  let fixture: ComponentFixture<OngCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
