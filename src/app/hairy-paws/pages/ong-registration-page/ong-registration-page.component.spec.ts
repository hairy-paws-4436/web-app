import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngRegistrationPageComponent } from './ong-registration-page.component';

describe('OngRegistrationPageComponent', () => {
  let component: OngRegistrationPageComponent;
  let fixture: ComponentFixture<OngRegistrationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngRegistrationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngRegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
