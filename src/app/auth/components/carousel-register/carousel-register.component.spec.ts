import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselRegisterComponent } from './carousel-register.component';

describe('CarouselRegisterComponent', () => {
  let component: CarouselRegisterComponent;
  let fixture: ComponentFixture<CarouselRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
