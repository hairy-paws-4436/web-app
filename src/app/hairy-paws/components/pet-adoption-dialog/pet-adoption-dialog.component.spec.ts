import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAdoptionDialogComponent } from './pet-adoption-dialog.component';

describe('PetAdoptionDialogComponent', () => {
  let component: PetAdoptionDialogComponent;
  let fixture: ComponentFixture<PetAdoptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetAdoptionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetAdoptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
