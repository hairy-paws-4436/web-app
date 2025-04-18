import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPetCardComponent } from './my-pet-card.component';

describe('MyPetCardComponent', () => {
  let component: MyPetCardComponent;
  let fixture: ComponentFixture<MyPetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPetCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
