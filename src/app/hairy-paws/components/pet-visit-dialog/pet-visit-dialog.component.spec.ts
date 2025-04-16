import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetVisitDialogComponent } from './pet-visit-dialog.component';

describe('PetVisitDialogComponent', () => {
  let component: PetVisitDialogComponent;
  let fixture: ComponentFixture<PetVisitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetVisitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetVisitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
